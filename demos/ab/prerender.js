// Pre-render the app into static HTML.
// run `yarn generate` and then `dist/static` can be served as a static site.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')
const { renderStatic, routes } = await import('./dist/server/entry-server.js')

;(async () => {
  for (const route of routes[0].children) {
    let url, filename;
    if (route.index) {
      url = ''
      filename = 'index'
    } else if (route.path === '*' ) {
      url = '404'
      filename = '404'
    } else {
      url = route.path
      filename = url
    }

    let html;
    try {
      html = await renderStatic(`http://no-matter/${url}`)  //!!
      html = template.replace(`<!--app-html-->`, html)
    } catch (e) {
      if (e instanceof Response && e.status >= 300 && e.status <= 399) {
        html = `<!doctype html><html lang="en"><head><meta http-equiv="refresh" content="0;URL=${e?.headers?.get('Location')}" /><head></html>`
      } else {
        throw e;
      }
    }

    const filePath = `dist/static/${filename}.html`
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  }
})()
