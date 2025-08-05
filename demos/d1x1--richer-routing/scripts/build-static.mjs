#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const BUILD_DIR = path.resolve(projectRoot, 'build');
const STATIC_DIR = path.resolve(BUILD_DIR, 'static');
const HOME_DIR = path.join(projectRoot, 'home');

const cleanDirectory = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    console.log(`Cleaning up: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
};

const runBuild = () => {
  console.log('Building static site with SPA mode + prerendering...');
  console.log(`Project root: ${projectRoot}`);

  try {
    // Pre-build cleanup
    cleanDirectory(HOME_DIR);
    cleanDirectory(STATIC_DIR);

    // Run production build
    console.log('Running React Router build...');
    execSync('npm run build', { stdio: 'inherit', cwd: projectRoot });

    // Post-build cleanup
    cleanDirectory(HOME_DIR);

    // Prepare static output
    fs.mkdirSync(STATIC_DIR, { recursive: true });
    const assetsSource = path.join(BUILD_DIR, 'client', 'assets');
    const assetsDest = path.join(STATIC_DIR, 'assets');

    console.log('\nCopying assets...');
    if (fs.existsSync(assetsSource)) {
      fs.cpSync(assetsSource, assetsDest, { recursive: true, force: true });
      console.log('✓ Assets copied successfully');
    } else {
      console.warn('⚠️ Assets directory not found');
    }

    // Copy favicon
    const faviconSource = path.join(projectRoot, 'public', 'favicon.ico');
    if (fs.existsSync(faviconSource)) {
      fs.copyFileSync(
        faviconSource,
        path.join(STATIC_DIR, 'favicon.ico')
      );
      console.log('✓ Favicon copied');
    }

    // Generate prerendered HTML files
    console.log('\nGenerating prerendered HTML files...');
    const spaFallback = path.join(BUILD_DIR, 'client', '__spa-fallback.html');
    const htmlTemplate = fs.readFileSync(spaFallback, 'utf-8');

    // Home page
    const homeHtml = updateHtmlForRoute(htmlTemplate, 'Home', 'Welcome to our site');
    fs.writeFileSync(path.join(STATIC_DIR, 'index.html'), homeHtml);
    console.log('✓ Generated index.html');

    // MyPage
    const mypageHtml = updateHtmlForRoute(htmlTemplate, 'My Page', 'My custom page');
    fs.mkdirSync(path.join(STATIC_DIR, 'mypage'), { recursive: true });
    fs.writeFileSync(path.join(STATIC_DIR, 'mypage', 'index.html'), mypageHtml);
    console.log('✓ Generated mypage/index.html');

    console.log('\n✨ Static site generation complete!');
    console.log(`📁 Output directory: ${STATIC_DIR}`);
    console.log('\nYou can serve the static site with:\n  npx serve build/static');
  } catch (error) {
    cleanDirectory(HOME_DIR);
    console.error('Build failed:', error);
    process.exit(1);
  }
};

function updateHtmlForRoute(html, title, description) {
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  if (html.includes('<meta name="description"')) {
    html = html.replace(
      /<meta name="description" content=".*?"\s*\/?>/,
      `<meta name="description" content="${description}"/>`
    );
  } else {
    html = html.replace(
      '</head>',
      `    <meta name="description" content="${description}"/>
  </head>`
    );
  }
  return html;
}

runBuild();
