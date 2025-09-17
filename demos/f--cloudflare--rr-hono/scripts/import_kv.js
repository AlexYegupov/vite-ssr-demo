// KV namespace import script
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import * as jsonc from 'jsonc-parser';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const parseJsonValues = args.includes('--json_values');
const useLocalKV = args.includes('--local_kv');
const showHelp = args.includes('--help') || args.includes('-h');
const usePreview = args.includes('--preview');

// Display help and exit if --help flag is present
if (showHelp) {
    console.log(`
Cloudflare KV Import Tool

Usage:
  node import_kv.js [options]

Options:
  --json_values  Parse JSON values instead of keeping them as strings
  --local_kv     Import data to local KV instead of outputting JSON
  --preview      Use preview namespace when using local KV
  --help, -h     Show this help message and exit
  --verbose      Show detailed information during execution

Description:
  Fetches data from Cloudflare KV storage and outputs it as JSON to stdout or imports to local KV.
  Always imports from remote KV - no stdin input is used.
  Requires KV_IMPORT_TOKEN environment variable to be set in .dev.vars file.

Examples:
  node import_kv.js                   # Output KV data as JSON (values as strings)
  node import_kv.js --json_values     # Output KV data as JSON (parse JSON values)
  node import_kv.js --local_kv        # Import data to local KV instead of outputting JSON
  node import_kv.js --verbose         # Show detailed information during execution
  node import_kv.js > data.json       # Save output to a file
`);
    process.exit(0);
}

// Logging function that only logs in verbose mode
function verboseLog(...messages) {
    if (isVerbose) {
        console.log(...messages);
    }
}

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Temporarily redirect console.log to suppress dotenv messages
const originalConsoleLog = console.log;
if (!isVerbose) {
    console.log = () => { }; // No-op function
}

// Load environment variables from .dev.vars file
const dotenvResult = dotenv.config({
    path: resolve(__dirname, '../.dev.vars')
});

// Restore console.log
console.log = originalConsoleLog;

// Log dotenv result in verbose mode
if (isVerbose && dotenvResult.parsed) {
    verboseLog(`Loaded ${Object.keys(dotenvResult.parsed).length} environment variables from .dev.vars`);
}

// Function to read and parse wrangler.jsonc using jsonc-parser
function readWranglerConfig() {
    try {
        const wranglerPath = resolve(__dirname, '../wrangler.jsonc');

        if (!existsSync(wranglerPath)) {
            console.error('wrangler.jsonc file not found.');
            process.exit(1);
        }

        // Read wrangler.jsonc
        const content = readFileSync(wranglerPath, 'utf8');

        // Parse JSONC content (handles comments automatically)
        const errors = [];
        const config = jsonc.parse(content, errors);

        if (errors.length > 0) {
            console.warn('Warning: Errors found while parsing wrangler.jsonc:', errors);
        }

        return config;
    } catch (e) {
        console.error('Error reading or parsing wrangler.jsonc:', e.message);
        process.exit(1);
    }
}

// Function to get KV configuration from wrangler.jsonc
function getKVConfig(binding = 'TODOS_KV') {
    const config = readWranglerConfig();

    // Extract account ID
    const accountId = config.account_id;
    if (!accountId) {
        console.error('account_id not found in wrangler.jsonc');
        process.exit(1);
    }

    // Find the KV namespace with the specified binding
    if (!config.kv_namespaces || !Array.isArray(config.kv_namespaces)) {
        console.error('No KV namespaces found in wrangler.jsonc');
        process.exit(1);
    }

    const namespace = config.kv_namespaces.find(ns => ns.binding === binding);
    if (!namespace) {
        console.error(`KV namespace with binding '${binding}' not found in wrangler.jsonc`);
        process.exit(1);
    }

    if (!namespace.id) {
        console.error(`ID for KV namespace '${binding}' not found in wrangler.jsonc`);
        process.exit(1);
    }

    return {
        accountId,
        namespaceId: namespace.id,
        binding: namespace.binding
    };
}

async function importKV() {
    try {
        // Get KV configuration from wrangler.jsonc
        const kvConfig = getKVConfig('TODOS_KV');

        // Check if API token is set in environment variables
        const apiTokenEnvVar = process.env.KV_IMPORT_TOKEN;

        if (!apiTokenEnvVar) {
            console.error('KV_IMPORT_TOKEN environment variable is required but not set.');
            console.error('Please set it in your .dev.vars file or environment variables.');
            process.exit(1);
        }

        let exportData = {};

        // Use configuration from wrangler.jsonc
        const accountId = kvConfig.accountId;
        const namespaceId = kvConfig.namespaceId;
        const apiToken = apiTokenEnvVar;

        const headers = {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        };

        try {
            // Get all keys with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const keysResponse = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/keys`,
                { headers, signal: controller.signal }
            );

            clearTimeout(timeoutId);

            const keysData = await keysResponse.json();

            if (!keysData.success) {
                throw new Error(`API Error: ${JSON.stringify(keysData.errors)}`);
            }

            const keys = keysData.result || [];
            verboseLog(`Found ${keys.length} keys`);

            // Get values for each key
            for (const keyObj of keys) {
                const key = keyObj.name;
                const valueResponse = await fetch(
                    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`,
                    { headers }
                );

                const valueText = await valueResponse.text();

                // Parse JSON values only if --json_values flag is provided
                if (parseJsonValues) {
                    // Try to parse the value as JSON if possible
                    try {
                        // Parse the JSON string to get the actual object
                        exportData[key] = JSON.parse(valueText);
                    } catch (e) {
                        // If it's not valid JSON, keep it as a string
                        exportData[key] = valueText;
                    }
                } else {
                    // Keep all values as strings
                    exportData[key] = valueText;
                }
            }
        } catch (error) {
            // If there's a network error or timeout, report it and exit
            if (isVerbose) {
                console.error(`API Error: ${error.message}`);
            } else {
                console.error(`Error: Unable to fetch data from Cloudflare KV`);
            }
            process.exit(1);
        }

        if (useLocalKV) {
            verboseLog(`Importing ${Object.keys(exportData).length} items to local KV using wrangler CLI`);
            
            let successCount = 0;
            let errorCount = 0;
            
            // Create a temporary directory for value files
            const tempDir = join(__dirname, '../.tmp_kv_import');
            try {
                // Ensure temp directory exists
                execSync(`mkdir -p ${tempDir}`);
                verboseLog(`Created temporary directory: ${tempDir}`);
            } catch (error) {
                console.error(`Error creating temporary directory: ${error.message}`);
                process.exit(1);
            }
            
            for (const key of Object.keys(exportData)) {
                const value = exportData[key];
                const valueString = typeof value === 'string' ? value : JSON.stringify(value);
                
                verboseLog(`Processing key: ${key}`);
                
                try {
                    // Write value to temp file to avoid command line escaping issues
                    const tempFilePath = join(tempDir, `${key.replace(/[^a-zA-Z0-9]/g, '_')}.tmp`);
                    writeFileSync(tempFilePath, valueString, 'utf8');
                    
                    // Use wrangler CLI with --path option to avoid escaping issues
                    const previewFlag = usePreview ? '--preview' : '--preview false';
                    const command = `npx wrangler kv key put --binding=TODOS_KV --local ${previewFlag} "${key}" --path="${tempFilePath}"`;
                    verboseLog(`Executing: ${command}`);
                    
                    // Always show stderr to preserve error messages, but control stdout based on verbose flag
                    execSync(command, { stdio: ['ignore', isVerbose ? 'inherit' : 'ignore', 'inherit'] });
                    verboseLog(`Successfully wrote key: ${key} to local KV`);
                    successCount++;
                } catch (error) {
                    // Just log the temp directory location and re-throw the error
                    console.error(`Temporary files are kept in: ${tempDir}`);
                    throw error; // Let the error propagate naturally
                }
            }
            
            // Clean up temp directory only if no errors occurred
            execSync(`rm -rf ${tempDir}`);
            verboseLog(`Removed temporary directory: ${tempDir}`);
            
            // Summary
            verboseLog(`Local KV import completed: ${successCount} keys written, ${errorCount} errors`);
            if (errorCount > 0) {
                console.error(`Warning: ${errorCount} keys failed to write to local KV`);
            } else {
                console.log(`Successfully imported ${successCount} keys to local KV`);
            }
        } else {
            // In non-verbose mode, just output the data directly to stdout
            if (isVerbose) {
                verboseLog(`Import completed!`);
                verboseLog(`Found ${Object.keys(exportData).length} items`);
            }
            console.log(JSON.stringify(exportData, null, 2));
        }

        return exportData;
    } catch (error) {
        // Handle any other errors
        if (isVerbose) {
            console.error(`Error in importKV: ${error.message}`);
            if (error.stack) console.error(error.stack);
        } else {
            console.error(`Error: ${error.message}`);
        }
        process.exit(1);
    }
}

importKV().catch(console.error);
