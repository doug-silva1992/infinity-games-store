import { useMemo, useState } from 'react'
import { GENEROS, JOGOS, MODOS, PLATAFORMAS, type Jogo } from '../data/jogos'
import { useStore } from '../store/useStore'
import { desconto, normalizar, textoDeBusca } from '../utils/format'
import { DragonMascot } from './Dragon'
import GameCard from './GameCard'
import Icon from './Icon'
import './Catalog.css'

type Ordem = 'relevancia' | 'menorPreco' | 'maiorPreco' | 'nota' | 'desconto' | 'recentes'

const ORDENADORES: Record<Ordem, (a: Jogo, b: Jogo) => number> = {
  relevancia: (a, b) => b.tendencia - a.tendencia,
  menorPreco: (a, b) => a.preco - b.preco,
  maiorPreco: (a, b) => b.preco - a.preco,
  nota: (a, b) => b.nota - a.nota,
  desconto: (a, b) => desconto(b) - desconto(a),
  recentes: (a, b) => b.lancamento.localeCompare(a.lancamento),
}

function Catalog() {
  const { busca, setBusca } = useStore()
  const [plataforma, setPlataforma] = useState<string>('Todas')
  const [genero, setGenero] = useState('Todos')
  const [modo, setModo] = useState<string>('Todos')
  const [soOfertas, setSoOfertas] = useState(false)
  const [ordem, setOrdem] = useState<Ordem>('relevancia')

  const jogos = useMemo(() => {
    const termos = normalizar(busca).split(/\s+/).filter(Boolean)
    return JOGOS.filter((j) => {
      const base = textoDeBusca(j)
      return (
        termos.every((t) => base.includes(t)) &&
        (plataforma === 'Todas' || j.plataformas.includes(plataforma as Jogo['plataformas'][number])) &&
        (genero === 'Todos' || j.genero === genero) &&
        (modo === 'Todos' || j.modo === modo) &&
        (!soOfertas || Boolean(j.precoAntigo))
      )
    }).sort(ORDENADORES[ordem])
  }, [busca, plataforma, genero, modo, soOfertas, ordem])

  const limpar = () => {
    setBusca('')
    setPlataforma('Todas')
    setGenero('Todos')
    setModo('Todos')
    setSoOfertas(false)
  }

  return (
    <section className="section" id="catalogo">
      <div className="section-head">
        <div>
          <span className="section-kicker">Explore tudo</span>
          <h2 className="section-title">Catálogo completo</h2>
        </div>
        <p className="catalog-count">
          <strong>{jogos.length}</strong> de {JOGOS.length} jogos
        </p>
      </div>

      <div className="catalog-bar glass">
        <div className="catalog-platforms" role="group" aria-label="Plataforma">
          {PLATAFORMAS.map((p) => (
            <button key={p} className={plataforma === p ? 'on' : ''} onClick={() => setPlataforma(p)}>
              {p}
            </button>
          ))}
        </div>
        <div className="catalog-controls">
          {busca && (
            <span className="catalog-query">
              “{busca}”
              <button onClick={() => setBusca('')} aria-label="Limpar busca">
                <Icon name="x" size={13} />
              </button>
            </span>
          )}
          <select value={genero} onChange={(e) => setGenero(e.target.value)} aria-label="Gênero">
            {GENEROS.map((g) => (
              <option key={g} value={g}>
                {g === 'Todos' ? 'Todos os gêneros' : g}
              </option>
            ))}
          </select>
          <select value={modo} onChange={(e) => setModo(e.target.value)} aria-label="Modo de jogo">
            {MODOS.map((m) => (
              <option key={m} value={m}>
                {m === 'Todos' ? 'Todos os modos' : m}
              </option>
            ))}
          </select>
          <select value={ordem} onChange={(e) => setOrdem(e.target.value as Ordem)} aria-label="Ordenar">
            <option value="relevancia">Em alta</option>
            <option value="recentes">Mais recentes</option>
            <option value="nota">Melhor avaliados</option>
            <option value="desconto">Maior desconto</option>
            <option value="menorPreco">Menor preço</option>
            <option value="maiorPreco">Maior preço</option>
          </select>
          <label className={`catalog-toggle ${soOfertas ? 'on' : ''}`}>
            <input type="checkbox" checked={soOfertas} onChange={(e) => setSoOfertas(e.target.checked)} />
            <span className="catalog-switch" />
            Só ofertas
          </label>
        </div>
      </div>

      {jogos.length > 0 ? (
        <div className="catalog-grid">
          {jogos.map((jogo) => (
            <GameCard key={jogo.id} jogo={jogo} />
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <DragonMascot size={72} />
          <p>O Ignis procurou por todo o reino e não achou nada com esses filtros.</p>
          <button className="btn btn-ghost btn-sm" onClick={limpar}>
            Limpar filtros
          </button>
        </div>
      )}
    </section>
  )
}

export default Catalog
