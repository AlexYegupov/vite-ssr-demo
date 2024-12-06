// Pre-render the app into static HTML.
// run `yarn generate` and then `dist/static` can be served as a static site.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')
const { renderStatic, routes } = await import('./dist/server/entry-server.js')


async function renderSingleRoute(route, parentPath) {
  let url, filename, html;
  if (route.index) {
    url = parentPath
    filename = path.posix.join(parentPath, 'index')
  } else if (route.path === '*' ) {
    url = path.posix.join(parentPath, '--THIS-URL-NOT-EXISTS--')
    filename = '404'
  } else {
    url = path.posix.join(parentPath, route.path)
    filename = url
  }
  // check if route has children index route
  if (route?.children?.some( childRoute => childRoute.index )) {
    // skip if children index route present
    console.log(`SKIP:`, url)
  } else {
    try {
      const _html = await renderStatic(`http://no-matter${url}`)
      html = template.replace(`<!--app-html-->`, _html)

      if (filename.includes('404')) console.log(`!!`, url , filename, `http://no-matter${url}`, _html) 
    } catch (e) {
      console.log(`CATCH`, url, e)
      if (e instanceof Response && e.status >= 300 && e.status <= 399) {
        html = `<!doctype html><html lang="en"><head><meta http-equiv="refresh" content="0;URL=${e?.headers?.get('Location')}" /><head></html>`
      } else {
        throw e;
      }
    }

    const filePath = path.posix.join('dist/static/', `${filename}.html`)
    //console.log(`RENDERING`, filePath, '->>', parentPath, url)
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(toAbsolute(filePath), html)
  }
}

async function renderRoutes(routes, parentPath = '') {
  for (const route of routes) {
    await renderSingleRoute(route, parentPath)

    if (route.children) {
      const fullPath = path.posix.join(parentPath, route.path)
      renderRoutes(route.children, fullPath);
    }
  }
}

renderRoutes(routes)
