import { useEffect, type ComponentType } from 'react'
import Background from './components/Background'
import BestSellers from './components/BestSellers'
import CartDrawer from './components/CartDrawer'
import Catalog from './components/Catalog'
import Checkout from './components/Checkout'
import Conta from './components/Conta'
import { DragonMascot } from './components/Dragon'
import Entrar from './components/Entrar'
import FlashSale from './components/FlashSale'
import Footer from './components/Footer'
import GameCard from './components/GameCard'
import GameModal from './components/GameModal'
import GamerHub from './components/GamerHub'
import Hero from './components/Hero'
import IndieShowcase from './components/IndieShowcase'
import Navbar from './components/Navbar'
import Rail from './components/Rail'
import Registrar from './components/Registrar'
import Toasts from './components/Toasts'
import { JOGOS } from './data/jogos'
import { useHash } from './hooks/useHash'
import StoreProvider from './store/StoreProvider'
import { dataCurta } from './utils/format'
import './App.css'

const EM_ALTA = [...JOGOS].sort((a, b) => b.tendencia - a.tendencia).slice(0, 8)
const RECOMENDADOS = JOGOS.filter((j) => j.dragao)
const LANCAMENTOS = [...JOGOS].sort((a, b) => b.lancamento.localeCompare(a.lancamento)).slice(0, 8)

// Motivos exibidos nos cards recomendados pelo Ignis
const MOTIVOS: Record<number, string> = {
  2: 'Você jogou 140h de RPG este ano',
  4: 'Perfeito para co-op com seus amigos',
  10: 'Quem curte Mecha Forge adora este',
  13: 'Joia indie com nota 4.9',
}

function Loja() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Hero />

        <Rail
          id="em-alta"
          kicker="Agora na comunidade"
          titulo="🔥 Em Alta na Infinity Games"
          sub="Os jogos mais jogados e comentados pelos jogadores nas últimas 24 horas."
        >
          {EM_ALTA.map((jogo, i) => (
            <GameCard key={jogo.id} jogo={jogo} etiqueta={`#${i + 1} em alta`} />
          ))}
        </Rail>

        <FlashSale />

        <Rail
          id="recomendados"
          kicker="Curadoria do Ignis"
          titulo="🎯 Recomendados para Você"
          intro={
            <div className="ignis-intro">
              <DragonMascot size={64} className="ignis-intro-dragon" />
              <div className="ignis-intro-bubble">
                <strong>Ignis analisou seu perfil</strong>
                <p>
                  Você curte mundos grandes e jogar com amigos. Separei estes com o selo <em>Recomendado pelo Dragão</em>.
                </p>
              </div>
            </div>
          }
        >
          {RECOMENDADOS.map((jogo) => (
            <GameCard key={jogo.id} jogo={jogo} motivo={MOTIVOS[jogo.id]} />
          ))}
        </Rail>

        <BestSellers />

        <GamerHub />

        <Rail
          id="lancamentos"
          kicker="Acabou de chegar"
          titulo="🆕 Lançamentos"
          sub="As estreias mais recentes da loja, com entrega digital imediata."
        >
          {LANCAMENTOS.map((jogo) => (
            <GameCard key={jogo.id} jogo={jogo} etiqueta={dataCurta(jogo.lancamento)} />
          ))}
        </Rail>

        <IndieShowcase />

        <Catalog />
      </main>

      <Footer />
      <CartDrawer />
      <GameModal />
    </>
  )
}

// Rotas pelo hash da URL: #entrar, #registrar, #checkout e #conta abrem telas próprias, o resto é a loja.
// O StoreProvider (e os toasts) ficam por fora para o carrinho sobreviver à troca de tela
const TELAS: Record<string, ComponentType> = {
  '#entrar': Entrar,
  '#registrar': Registrar,
  '#checkout': Checkout,
  '#conta': Conta,
}

function App() {
  const hash = useHash()
  const Tela = TELAS[hash] ?? Loja

  // Chaves para não devolver o retorno do scrollTo (uma Promise nos navegadores novos)
  useEffect(() => {
    scrollTo(0, 0)
  }, [Tela])

  return (
    <StoreProvider>
      <Background />
      <Tela />
      <Toasts />
    </StoreProvider>
  )
}

export default App
