import type { Jogo } from '../data/jogos'
import { useStore } from '../store/useStore'
import Icon from './Icon'

type Props = {
  jogo: Jogo
  tamanho?: 'sm' | 'md'
  rotulo?: string
}

// Botão de compra com três estados: comprar, no carrinho, na biblioteca
function BuyButton({ jogo, tamanho = 'sm', rotulo = 'Comprar' }: Props) {
  const { biblioteca, carrinho, adicionarAoCarrinho, setCarrinhoAberto } = useStore()
  const sm = tamanho === 'sm' ? 'btn-sm' : ''

  if (biblioteca.has(jogo.id)) {
    return (
      <button className={`btn btn-owned ${sm}`} disabled>
        <Icon name="check" size={16} /> Na biblioteca
      </button>
    )
  }

  if (carrinho.some((j) => j.id === jogo.id)) {
    return (
      <button className={`btn btn-incart ${sm}`} onClick={() => setCarrinhoAberto(true)}>
        <Icon name="cart" size={16} /> No carrinho
      </button>
    )
  }

  return (
    <button className={`btn btn-primary ${sm}`} onClick={() => adicionarAoCarrinho(jogo)}>
      <Icon name="cart" size={16} /> {rotulo}
    </button>
  )
}

export default BuyButton
