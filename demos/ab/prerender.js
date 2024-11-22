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


    const appHtml = await renderStatic(`http://localhost:3003/${url}`)
    const html = template.replace(`<!--app-html-->`, appHtml)

    const filePath = `dist/static/${filename}.html`
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  }
})()
