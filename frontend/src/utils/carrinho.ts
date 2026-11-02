import type { Jogo } from '../data/jogos'
import { xpGanhoPorCompra } from '../data/perfil'

// Valores do pedido, compartilhados pelo carrinho e pela tela de pagamento
export function resumoDoCarrinho(carrinho: Jogo[]) {
  const totalCheio = carrinho.reduce((s, j) => s + (j.precoAntigo ?? j.preco), 0)
  const total = carrinho.reduce((s, j) => s + j.preco, 0)
  const xp = carrinho.reduce((s, j) => s + xpGanhoPorCompra(j.preco), 0)
  return { totalCheio, total, economia: totalCheio - total, xp }
}
