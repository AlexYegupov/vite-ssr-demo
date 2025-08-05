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

const runBuild = async () => {
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

    console.log('\nGenerating prerendered HTML files...');
    
    // Import the server build
    let serverModule;
    try {
      serverModule = await import(path.join(projectRoot, 'build', 'server', 'assets', 'server-build-xUfVAezN.js'));
    } catch (error) {
      console.error('Error importing server build:', error);
      throw error;
    }
    
    // Get the client build assets
    const clientAssets = fs.readdirSync(path.join(BUILD_DIR, 'client', 'assets'));
    const cssFiles = clientAssets.filter(file => file.endsWith('.css'));
    const jsFiles = clientAssets.filter(file => file.endsWith('.js'));
    
    // Create a basic HTML template with a placeholder for content
    const createHtmlTemplate = (content = '') => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Router App</title>
    ${cssFiles.map(css => `<link rel="stylesheet" href="/assets/${css}" />`).join('\n    ')}
  </head>
  <body>
    <div id="root">${content}</div>
    ${jsFiles.map(js => `<script type="module" src="/assets/${js}"></script>`).join('\n    ')}
  </body>
</html>`;

    // Function to render a route to HTML
    const renderRoute = async (path) => {
      try {
        const { renderToReadableStream } = await import('react-dom/server.edge');
        const { createStaticHandler } = await import('@remix-run/router');
        const { createStaticRouter, StaticRouterProvider } = await import('react-router-dom/server.edge');
        
        // Get the routes from the server build
        const routes = serverModule.routes || [];
        
        // Create a static handler
        const { query } = createStaticHandler(routes);
        
        // Create a context for the static render
        const context = await query(new Request(`https://example.com${path}`));
        
        if (context instanceof Response) {
          throw new Error(`Failed to render ${path}: ${context.status} ${context.statusText}`);
        }
        
        // Create a static router
        const router = createStaticRouter(routes, context);
        
        // Render the app to a string
        const stream = await renderToReadableStream(
          <StaticRouterProvider router={router} context={context} />,
          {
            bootstrapModules: ['/assets/entry.client.js']
          }
        );
        
        // Convert the stream to a string
        const reader = stream.getReader();
        let result = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += new TextDecoder().decode(value);
        }
        
        return result;
      } catch (error) {
        console.error(`Error rendering ${path}:`, error);
        return '';
      }
    };

    // Render and save each route
    const routes = ['/', '/mypage'];
    
    for (const route of routes) {
      try {
        console.log(`\nRendering ${route}...`);
        const content = await renderRoute(route);
        const html = createHtmlTemplate(content);
        
        if (route === '/') {
          fs.writeFileSync(path.join(STATIC_DIR, 'index.html'), html);
          console.log('✓ Generated index.html');
        } else {
          const routeDir = route.replace(/^\/+/, ''); // Remove leading slashes
          const dirPath = path.join(STATIC_DIR, routeDir);
          fs.mkdirSync(dirPath, { recursive: true });
          fs.writeFileSync(path.join(dirPath, 'index.html'), html);
          console.log(`✓ Generated ${routeDir}/index.html`);
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${route}:`, error);
        throw error;
      }
    }

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

runBuild().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
