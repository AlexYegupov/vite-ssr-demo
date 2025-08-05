#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const BUILD_DIR = path.resolve(projectRoot, 'build');
const STATIC_DIR = path.resolve(BUILD_DIR, 'static');

const cleanDirectory = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    console.log(`Cleaning up: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
};

const runBuild = async () => {
  console.log('Building static site...');
  console.log(`Project root: ${projectRoot}`);

  try {
    // Clean up
    cleanDirectory(STATIC_DIR);
    
    // Build the app
    console.log('Building the app...');
    execSync('npm run build', { stdio: 'inherit', cwd: projectRoot });
    
    // Create static directory
    fs.mkdirSync(STATIC_DIR, { recursive: true });
    
    // Copy client assets
    console.log('\nCopying assets...');
    const assetsSource = path.join(BUILD_DIR, 'client', 'assets');
    const assetsDest = path.join(STATIC_DIR, 'assets');
    
    if (fs.existsSync(assetsSource)) {
      fs.cpSync(assetsSource, assetsDest, { recursive: true, force: true });
      console.log('✓ Assets copied successfully');
    } else {
      console.warn('⚠️ Assets directory not found');
    }
    
    // Copy favicon
    const faviconSource = path.join(projectRoot, 'public', 'favicon.ico');
    if (fs.existsSync(faviconSource)) {
      fs.copyFileSync(faviconSource, path.join(STATIC_DIR, 'favicon.ico'));
      console.log('✓ Favicon copied');
    }
    
    // Create HTML files for each route
    console.log('\nGenerating HTML files...');
    const routes = ['/', '/mypage'];
    const clientAssets = fs.readdirSync(assetsDest);
    const cssFiles = clientAssets.filter(file => file.endsWith('.css'));
    const jsFiles = clientAssets.filter(file => file.endsWith('.js'));
    
    const createHtml = (title) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${cssFiles.map(css => `<link rel="stylesheet" href="/assets/${css}" />`).join('\n    ')}
  </head>
  <body>
    <div id="root"></div>
    ${jsFiles.map(js => `<script type="module" src="/assets/${js}"></script>`).join('\n    ')}
  </body>
</html>`;
    
    for (const route of routes) {
      const title = route === '/' ? 'Home' : 'My Page';
      const html = createHtml(title);
      
      if (route === '/') {
        fs.writeFileSync(path.join(STATIC_DIR, 'index.html'), html);
        console.log('✓ Generated index.html');
      } else {
        const dir = path.join(STATIC_DIR, route.replace(/^\/+/, ''));
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
        console.log(`✓ Generated ${route}/index.html`);
      }
    }
    
    console.log('\n✨ Static site generation complete!');
    console.log(`📁 Output directory: ${STATIC_DIR}`);
    console.log('\nYou can serve the static site with:\n  npx serve build/static');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

runBuild();
