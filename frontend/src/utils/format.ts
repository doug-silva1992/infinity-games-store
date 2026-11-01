import type { Jogo } from '../data/jogos'

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const desconto = (j: Jogo) =>
  j.precoAntigo ? Math.round((1 - j.preco / j.precoAntigo) * 100) : 0

export const gradiente = ([a, b]: [string, string], angulo = 135) =>
  `linear-gradient(${angulo}deg, ${a}, ${b})`
