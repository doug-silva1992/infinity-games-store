import type { Jogo, Modo } from '../data/jogos'

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const desconto = (j: Jogo) =>
  j.precoAntigo ? Math.round((1 - j.preco / j.precoAntigo) * 100) : 0

const compactoFmt = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })
export const compacto = (n: number) => compactoFmt.format(n)

export const numero = (n: number) => n.toLocaleString('pt-BR')

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export const dataCurta = (iso: string) => {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return `${dia} ${MESES[mes - 1]} ${ano}`
}

export const modoCurto: Record<Modo, string> = {
  Singleplayer: 'Single',
  Multiplayer: 'Multi',
  'Single + Multi': 'Single + Multi',
}

export const normalizar = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

// Texto pesquisável de um jogo: título, gênero, plataformas e etiquetas
export const textoDeBusca = (j: Jogo) =>
  normalizar(
    [j.titulo, j.genero, ...j.plataformas, j.indie && 'indie', j.precoAntigo && 'promocao oferta']
      .filter(Boolean)
      .join(' '),
  )
