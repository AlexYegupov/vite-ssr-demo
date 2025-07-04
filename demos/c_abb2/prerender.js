// Pre-render the app into static HTML.
// run `yarn generate` and then `dist/static` can be served as a static site. asddfsa dfsafdasfdas 
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')

const { renderStatic, routes } = await import('./dist/server/entry-server.js')


async function renderSingleRoute(route, parentPath) {
  let url, filename, html;
  let notFound = false
  if (route.index) {
    url = parentPath
    filename = path.posix.join(parentPath, 'index')
  } else if (route.path === '*' ) {
    url = path.posix.join(parentPath, '--THIS-URL-NOT-EXISTS--')
    filename = 'notfound' //path.posix.join(parentPath, '404')
    notFound = true
  } else {
    url = path.posix.join(parentPath, route.path)
    filename = url
  }

  // route has dynamic segments
  if (url.includes(':') || url.includes('*')) {
    console.log(`Skip ${url} with dynamic segment`)
    return;
  }

  // skip if route has children index route
  if (route?.children?.some( childRoute => childRoute.index )) {
    console.log(`Skip ${url} in favor of child index route`)
    return;
  }

  if (route._skipSSG) {
    console.log(`Skip ${url} because of flag`)
    return;
  }

  try {
    let _html = await renderStatic(`http://no-matter${url}`)

    html = template.replace(`<!--app-html-->`, _html)
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
