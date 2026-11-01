import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { GENEROS, JOGOS, PLATAFORMAS, type Jogo } from '../data/jogos'
import { useClickOutside } from '../hooks/useClickOutside'
import { useStore } from '../store/useStore'
import { brl, desconto, normalizar, textoDeBusca } from '../utils/format'
import GameCover from './GameCover'
import Icon from './Icon'
import './SearchBox.css'

const PRECO_MAXIMO = 350
const SUGESTOES = ['RPG', 'Corrida', 'Indie', 'Promoção', 'Multiplayer']

// Busca avançada: resultados ao vivo + filtros de plataforma, gênero e preço
function SearchBox() {
  const { abrirJogo, setBusca } = useStore()
  const [texto, setTexto] = useState('')
  const [aberto, setAberto] = useState(false)
  const [plataforma, setPlataforma] = useState('Todas')
  const [genero, setGenero] = useState('Todos')
  const [precoMax, setPrecoMax] = useState(PRECO_MAXIMO)
  const [ativo, setAtivo] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const caixaRef = useClickOutside<HTMLDivElement>(aberto, () => setAberto(false))

  // Atalho Ctrl+K ou "/" para focar a busca
  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      const digitando = (e.target as HTMLElement).matches('input, textarea, select')
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !digitando)) {
        e.preventDefault()
        inputRef.current?.focus()
        setAberto(true)
      }
    }
    addEventListener('keydown', onKeyDown)
    return () => removeEventListener('keydown', onKeyDown)
  }, [])

  const resultados = useMemo(() => {
    const termos = normalizar(texto).split(/\s+/).filter(Boolean)
    return JOGOS.filter((j) => {
      const base = textoDeBusca(j)
      return (
        termos.every((t) => base.includes(t)) &&
        (plataforma === 'Todas' || j.plataformas.includes(plataforma as Jogo['plataformas'][number])) &&
        (genero === 'Todos' || j.genero === genero) &&
        j.preco <= precoMax
      )
    })
  }, [texto, plataforma, genero, precoMax])

  const visiveis = resultados.slice(0, 6)
  const filtrando = texto.trim() !== '' || plataforma !== 'Todas' || genero !== 'Todos' || precoMax < PRECO_MAXIMO

  const escolher = (jogo: Jogo) => {
    abrirJogo(jogo)
    setAberto(false)
    inputRef.current?.blur()
  }

  const verTodos = () => {
    setBusca(texto)
    setAberto(false)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAtivo((a) => Math.min(a + 1, visiveis.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setAtivo((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (visiveis[ativo] && texto) escolher(visiveis[ativo])
      else verTodos()
    }
  }

  return (
    <div className={`search ${aberto ? 'open' : ''}`} ref={caixaRef}>
      <div className="search-field">
        <Icon name="search" size={18} />
        <input
          ref={inputRef}
          value={texto}
          placeholder="Buscar jogos, gêneros, plataformas..."
          onChange={(e) => {
            setTexto(e.target.value)
            setAtivo(0)
            setAberto(true)
          }}
          onFocus={() => setAberto(true)}
          onKeyDown={onKeyDown}
          aria-label="Buscar jogos"
          aria-expanded={aberto}
        />
        {texto ? (
          <button className="search-clear" onClick={() => setTexto('')} aria-label="Limpar busca">
            <Icon name="x" size={16} />
          </button>
        ) : (
          <kbd className="search-kbd">Ctrl K</kbd>
        )}
      </div>

      {aberto && (
        <div className="search-panel glass">
          <div className="search-filters">
            <div className="search-chips">
              {PLATAFORMAS.map((p) => (
                <button key={p} className={`search-chip ${plataforma === p ? 'on' : ''}`} onClick={() => setPlataforma(p)}>
                  {p}
                </button>
              ))}
            </div>
            <div className="search-row">
              <select value={genero} onChange={(e) => setGenero(e.target.value)} aria-label="Gênero">
                {GENEROS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              <label className="search-range">
                <span>Até {brl(precoMax)}</span>
                <input
                  type="range"
                  min={30}
                  max={PRECO_MAXIMO}
                  step={10}
                  value={precoMax}
                  onChange={(e) => setPrecoMax(Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          {!filtrando ? (
            <div className="search-suggest">
              <span>Buscas populares</span>
              <div>
                {SUGESTOES.map((s) => (
                  <button key={s} className="search-chip" onClick={() => setTexto(s)}>
                    <Icon name="trendingUp" size={13} /> {s}
                  </button>
                ))}
              </div>
            </div>
          ) : visiveis.length === 0 ? (
            <p className="search-empty">Nenhum jogo encontrado. Tente outros filtros.</p>
          ) : (
            <ul className="search-results" role="listbox">
              {visiveis.map((j, i) => (
                <li key={j.id}>
                  <button
                    className={`search-result ${i === ativo ? 'active' : ''}`}
                    onClick={() => escolher(j)}
                    onMouseEnter={() => setAtivo(i)}
                    role="option"
                    aria-selected={i === ativo}
                  >
                    <span className="search-thumb">
                      <GameCover jogo={j} logo={false} />
                    </span>
                    <span className="search-info">
                      <strong>{j.titulo}</strong>
                      <small>
                        {j.genero} · {j.plataformas.join(', ')}
                      </small>
                    </span>
                    <span className="search-price">
                      {desconto(j) > 0 && <span className="badge badge-off">-{desconto(j)}%</span>}
                      {brl(j.preco)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {filtrando && resultados.length > 0 && (
            <button className="search-all" onClick={verTodos}>
              Ver todos os {resultados.length} resultados no catálogo <Icon name="arrowRight" size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBox
