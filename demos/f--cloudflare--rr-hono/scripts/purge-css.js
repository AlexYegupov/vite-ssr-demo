#!/usr/bin/env node

import { PurgeCSS } from 'purgecss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const buildDir = path.join(projectRoot, 'build');

// Get all HTML files from the build directory
const getHtmlFiles = (dir) => {
    const results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results.push(...getHtmlFiles(filePath));
        } else if (path.extname(file) === '.html') {
            results.push(filePath);
        }
    });

    return results;
};

// Get all CSS files from the build directory
const getCssFiles = (dir) => {
    const results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results.push(...getCssFiles(filePath));
        } else if (path.extname(file) === '.css') {
            results.push(filePath);
        }
    });

    return results;
};

// Get all JS files from the build directory
const getJsFiles = (dir) => {
    const results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results.push(...getJsFiles(filePath));
        } else if (path.extname(file) === '.js') {
            results.push(filePath);
        }
    });

    return results;
};

async function purgeCSSFromBuild() {
    console.log('Starting PurgeCSS on build directory...');

    try {
        // Get all HTML, CSS, and JS files
        const htmlFiles = getHtmlFiles(buildDir);
        const cssFiles = getCssFiles(buildDir);
        const jsFiles = getJsFiles(buildDir);

        console.log(`Found ${htmlFiles.length} HTML files, ${cssFiles.length} CSS files, and ${jsFiles.length} JS files`);

        if (cssFiles.length === 0) {
            console.log('No CSS files found to purge');
            return;
        }

        // Content to analyze for CSS selectors
        const content = [...htmlFiles, ...jsFiles];

        // If no HTML files found, we need to use JS files at minimum
        if (content.length === 0) {
            console.error('No content files found to analyze CSS against');
            return;
        }

        // Process each CSS file
        for (const cssFile of cssFiles) {
            console.log(`Processing ${path.relative(projectRoot, cssFile)}`);

            const originalSize = fs.statSync(cssFile).size;

            // Get file size before purging
            console.log(`Original size: ${(originalSize / 1024).toFixed(2)} KB`);

            // Run PurgeCSS
            const result = await new PurgeCSS().purge({
                content: content,
                css: [cssFile],
                safelist: {
                    standard: [/^:/, /^::/, /^data-/, /^aria-/],
                    deep: [/^:/, /^::/, /^data-/, /^aria-/],
                    greedy: [/^:/, /^::/, /^data-/, /^aria-/, /rt-BaseButton/],
                },
                // Add any specific selectors you want to keep
                // safelist: ['specific-class-to-keep', /^specific-prefix-.*$/]
            });

            if (result.length > 0 && result[0].css) {
                // Write the purged CSS back to the file
                fs.writeFileSync(cssFile, result[0].css);

                // Get file size after purging
                const newSize = fs.statSync(cssFile).size;
                console.log(`New size: ${(newSize / 1024).toFixed(2)} KB`);
                console.log(`Reduced by: ${((originalSize - newSize) / 1024).toFixed(2)} KB (${((originalSize - newSize) / originalSize * 100).toFixed(2)}%)`);
            } else {
                console.log(`No changes made to ${cssFile}`);
            }
        }

        console.log('PurgeCSS completed successfully!');
    } catch (error) {
        console.error('Error running PurgeCSS:', error);
    }
}

purgeCSSFromBuild();
