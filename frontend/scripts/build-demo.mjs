// Junta o build do Vite (HTML + JS + CSS + favicon) em um único arquivo,
// para abrir a loja direto do disco ou publicar como demonstração no portfólio.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(raiz, 'dist')
const destino = join(raiz, '..', 'docs', 'infinity-games-store.html')

const ler = (caminho) => readFileSync(join(dist, caminho.replace(/^\//, '')), 'utf8')
let html = ler('index.html')

html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, href) => `<style>\n${ler(href)}\n</style>`)

html = html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_, src) => {
  // Evita que um "</script" dentro do bundle feche a tag antes da hora
  const js = ler(src).replace(/<\/script/gi, '<\\/script')
  return `<script type="module">\n${js}\n</script>`
})

html = html.replace(/href="\/favicon\.svg"/, () => {
  const svg = Buffer.from(ler('favicon.svg')).toString('base64')
  return `href="data:image/svg+xml;base64,${svg}"`
})

const sobrou = html.match(/(src|href)="\/(?!\/)[^"]*"/g)
if (sobrou) throw new Error(`Arquivos não embutidos: ${sobrou.join(', ')}`)

mkdirSync(dirname(destino), { recursive: true })
writeFileSync(destino, html)
console.log(`Demo gerada em ${destino} (${(Buffer.byteLength(html) / 1024).toFixed(0)} kB)`)
