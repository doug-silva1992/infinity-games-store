import { useEffect, useMemo, useState } from 'react'
import CartDrawer, { type ItemCarrinho } from './components/CartDrawer'
import GameCard from './components/GameCard'
import { GENEROS, JOGOS, PLATAFORMAS, type Jogo } from './data/jogos'
import { brl, desconto, gradiente } from './utils/format'
import './App.css'

type Ordem = 'relevancia' | 'menorPreco' | 'maiorPreco' | 'nota' | 'desconto'

const ORDENADORES: Partial<Record<Ordem, (a: Jogo, b: Jogo) => number>> = {
  menorPreco: (a, b) => a.preco - b.preco,
  maiorPreco: (a, b) => b.preco - a.preco,
  nota: (a, b) => b.nota - a.nota,
  desconto: (a, b) => desconto(b) - desconto(a),
}

const DESTAQUE = JOGOS[1]

function App() {
  const [busca, setBusca] = useState('')
  const [plataforma, setPlataforma] = useState<string>('Todas')
  const [genero, setGenero] = useState('Todos')
  const [ordem, setOrdem] = useState<Ordem>('relevancia')
  const [soOfertas, setSoOfertas] = useState(false)
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set())
  const [carrinho, setCarrinho] = useState<Record<number, number>>({}) // { id: quantidade }
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const jogosFiltrados = useMemo(() => {
    const lista = JOGOS.filter((j) => {
      const okBusca = j.titulo.toLowerCase().includes(busca.toLowerCase())
      const okPlat = plataforma === 'Todas' || j.plataformas.includes(plataforma as Jogo['plataformas'][number])
      const okGen = genero === 'Todos' || j.genero === genero
      const okOferta = !soOfertas || Boolean(j.precoAntigo)
      return okBusca && okPlat && okGen && okOferta
    })
    const ordenar = ORDENADORES[ordem]
    return ordenar ? [...lista].sort(ordenar) : lista
  }, [busca, plataforma, genero, ordem, soOfertas])

  const itensCarrinho: ItemCarrinho[] = Object.entries(carrinho).map(([id, qtd]) => ({
    ...JOGOS.find((j) => j.id === Number(id))!,
    qtd,
  }))
  const totalItens = itensCarrinho.reduce((s, i) => s + i.qtd, 0)

  const adicionar = (jogo: Jogo) => {
    setCarrinho((c) => ({ ...c, [jogo.id]: (c[jogo.id] ?? 0) + 1 }))
    setToast(`${jogo.titulo} adicionado ao carrinho`)
  }

  const alterarQtd = (id: number, delta: number) =>
    setCarrinho((c) => {
      const nova = (c[id] ?? 0) + delta
      const copia = { ...c }
      if (nova <= 0) delete copia[id]
      else copia[id] = nova
      return copia
    })

  const alternarFavorito = (id: number) =>
    setFavoritos((f) => {
      const n = new Set(f)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const finalizar = () => {
    setCarrinho({})
    setCarrinhoAberto(false)
    setToast('Pedido finalizado! Os códigos foram enviados por e-mail.')
  }

  return (
    <div className="gs">
      {/* Cabeçalho */}
      <header className="gs-header">
        <div className="gs-logo">
          <span className="gs-logo-icon">🎮</span> Pixel<strong>Play</strong>
        </div>
        <div className="gs-search">
          <span>🔍</span>
          <input
            placeholder="Buscar jogos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <nav className="gs-actions">
          <button className="gs-icon-btn" title="Favoritos">
            ♥<span className="gs-badge alt">{favoritos.size}</span>
          </button>
          <button className="gs-icon-btn" title="Carrinho" onClick={() => setCarrinhoAberto(true)}>
            🛒{totalItens > 0 && <span className="gs-badge">{totalItens}</span>}
          </button>
        </nav>
      </header>

      {/* Banner de destaque */}
      <section className="gs-hero" style={{ background: gradiente(DESTAQUE.cores, 120) }}>
        <div className="gs-hero-text">
          <span className="gs-pill">Destaque da semana</span>
          <h1>{DESTAQUE.titulo}</h1>
          <p>
            Explore um reino em ruínas, forme alianças e decida o destino de Aldoria neste RPG
            épico de mundo aberto.
          </p>
          <div className="gs-hero-cta">
            <span className="gs-hero-price">{brl(DESTAQUE.preco)}</span>
            <button className="gs-btn light" onClick={() => adicionar(DESTAQUE)}>
              Comprar agora
            </button>
          </div>
        </div>
        <div className="gs-hero-art">{DESTAQUE.icone}</div>
      </section>

      {/* Filtros */}
      <section className="gs-filters">
        <div className="gs-chips">
          {PLATAFORMAS.map((p) => (
            <button
              key={p}
              className={`gs-chip ${plataforma === p ? 'active' : ''}`}
              onClick={() => setPlataforma(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="gs-selects">
          <label className="gs-toggle">
            <input
              type="checkbox"
              checked={soOfertas}
              onChange={(e) => setSoOfertas(e.target.checked)}
            />
            Só ofertas
          </label>
          <select value={genero} onChange={(e) => setGenero(e.target.value)}>
            {GENEROS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <select value={ordem} onChange={(e) => setOrdem(e.target.value as Ordem)}>
            <option value="relevancia">Relevância</option>
            <option value="menorPreco">Menor preço</option>
            <option value="maiorPreco">Maior preço</option>
            <option value="nota">Melhor avaliados</option>
            <option value="desconto">Maior desconto</option>
          </select>
        </div>
      </section>

      <p className="gs-count">{jogosFiltrados.length} jogo(s) encontrado(s)</p>

      {/* Grade de produtos */}
      <main className="gs-grid">
        {jogosFiltrados.map((jogo) => (
          <GameCard
            key={jogo.id}
            jogo={jogo}
            favorito={favoritos.has(jogo.id)}
            onFavoritar={() => alternarFavorito(jogo.id)}
            onAdicionar={() => adicionar(jogo)}
          />
        ))}
        {jogosFiltrados.length === 0 && (
          <div className="gs-empty">Nenhum jogo encontrado com esses filtros. 👾</div>
        )}
      </main>

      <CartDrawer
        aberto={carrinhoAberto}
        itens={itensCarrinho}
        onFechar={() => setCarrinhoAberto(false)}
        onAlterarQtd={alterarQtd}
        onFinalizar={finalizar}
      />

      {toast && <div className="gs-toast">✔ {toast}</div>}

      <footer className="gs-footer">© 2026 PixelPlay · Loja de jogos digitais</footer>
    </div>
  )
}

export default App
