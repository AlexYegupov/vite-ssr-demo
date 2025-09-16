// KV namespace export script
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as jsonc from 'jsonc-parser';
import dotenv from 'dotenv';

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const showHelp = args.includes('--help') || args.includes('-h');
const dryRun = args.includes('--dry-run');

// Display help and exit if --help flag is present
if (showHelp) {
    console.log(`
Cloudflare KV Export Tool

Usage:
  node export_kv.js [options]

Options:
  --dry-run      Show what would be written without actually writing to KV
  --help, -h     Show this help message and exit
  --verbose      Show detailed information during execution

Description:
  Reads JSON data from stdin and writes it to Cloudflare KV storage.
  Requires KV_IMPORT_TOKEN environment variable to be set in .dev.vars file.
  Input should be valid JSON with key-value pairs.

Examples:
  cat data.json | node export_kv.js                    # Write data to KV
  node export_kv.js < data.json                        # Same as above
  cat data.json | node export_kv.js --verbose          # With detailed logging
  cat data.json | node export_kv.js --dry-run          # Preview without writing
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

// Function to read JSON from stdin
async function readStdin() {
    return new Promise((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', chunk => {
            data += chunk;
        });

        process.stdin.on('end', () => {
            resolve(data);
        });

        process.stdin.on('error', reject);
    });
}

async function importKV() {
    try {
        // Read JSON data from stdin
        const inputData = await readStdin();

        if (!inputData.trim()) {
            console.error('Error: No input data received from stdin');
            process.exit(1);
        }

        // Parse the input JSON
        let parsedData;
        try {
            parsedData = JSON.parse(inputData);
        } catch (e) {
            console.error('Error: Invalid JSON input:', e.message);
            process.exit(1);
        }

        // Validate that it's an object
        if (typeof parsedData !== 'object' || parsedData === null) {
            console.error('Error: Input must be a JSON object with key-value pairs');
            process.exit(1);
        }

        const keys = Object.keys(parsedData);
        if (keys.length === 0) {
            console.error('Error: Input JSON object is empty');
            process.exit(1);
        }

        verboseLog(`Parsed ${keys.length} key-value pairs from input`);

        // Get KV configuration from wrangler.jsonc
        const kvConfig = getKVConfig('TODOS_KV');

        // Check if API token is set in environment variables
        const apiTokenEnvVar = process.env.KV_IMPORT_TOKEN;

        if (!apiTokenEnvVar) {
            console.error('KV_IMPORT_TOKEN environment variable is required but not set.');
            console.error('Please set it in your .env file or environment variables.');
            process.exit(1);
        }

        // Use configuration from wrangler.jsonc
        const accountId = kvConfig.accountId;
        const namespaceId = kvConfig.namespaceId;
        const apiToken = apiTokenEnvVar;

        const headers = {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        };

        if (dryRun) {
            verboseLog('DRY RUN MODE - No data will be written to KV');
        }

        let successCount = 0;
        let errorCount = 0;

        // Write each key-value pair to KV
        for (const key of keys) {
            const value = parsedData[key];
            const valueString = typeof value === 'string' ? value : JSON.stringify(value);

            verboseLog(`Processing key: ${key}`);

            if (dryRun) {
                verboseLog(`Would write: ${key} = ${valueString.substring(0, 100)}${valueString.length > 100 ? '...' : ''}`);
                successCount++;
                continue;
            }

            try {
                const response = await fetch(
                    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`,
                    {
                        method: 'PUT',
                        headers: {
                            ...headers,
                            'Content-Type': 'text/plain'
                        },
                        body: valueString
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`Error writing key '${key}': ${response.status} ${response.statusText}`);
                    if (errorData.errors) {
                        console.error('Details:', JSON.stringify(errorData.errors, null, 2));
                    }
                    errorCount++;
                } else {
                    verboseLog(`Successfully wrote key: ${key}`);
                    successCount++;
                }
            } catch (error) {
                console.error(`Network error writing key '${key}': ${error.message}`);
                errorCount++;
            }
        }

        // Summary
        if (dryRun) {
            verboseLog(`Dry run completed: ${successCount} keys would be written`);
        } else {
            verboseLog(`Export completed: ${successCount} keys written, ${errorCount} errors`);
            if (errorCount > 0) {
                console.error(`Warning: ${errorCount} keys failed to write`);
                process.exit(1);
            }
        }

        console.log('Export operation completed successfully');

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
