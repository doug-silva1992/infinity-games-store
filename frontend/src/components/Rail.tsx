import { useEffect, useRef, useState, type ReactNode } from 'react'
import Icon from './Icon'
import './Rail.css'

type Props = {
  id?: string
  kicker: string
  titulo: string
  sub?: string
  intro?: ReactNode
  children: ReactNode
}

// Seção com trilho horizontal de cards e setas de navegação
function Rail({ id, kicker, titulo, sub, intro, children }: Props) {
  const trilhoRef = useRef<HTMLDivElement>(null)
  const [limites, setLimites] = useState({ inicio: true, fim: false })

  const atualizar = () => {
    const el = trilhoRef.current
    if (!el) return
    setLimites({
      inicio: el.scrollLeft <= 4,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }

  useEffect(() => {
    atualizar()
    addEventListener('resize', atualizar)
    return () => removeEventListener('resize', atualizar)
  }, [])

  const rolar = (direcao: number) =>
    trilhoRef.current?.scrollBy({ left: direcao * trilhoRef.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section className="section" id={id}>
      <div className="section-head">
        <div>
          <span className="section-kicker">{kicker}</span>
          <h2 className="section-title">{titulo}</h2>
          {sub && <p className="section-sub">{sub}</p>}
        </div>
        <div className="rail-nav">
          <button className="rail-arrow" onClick={() => rolar(-1)} disabled={limites.inicio} aria-label="Anterior">
            <Icon name="chevronLeft" />
          </button>
          <button className="rail-arrow" onClick={() => rolar(1)} disabled={limites.fim} aria-label="Próximo">
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
      {intro}
      <div className="rail" ref={trilhoRef} onScroll={atualizar}>
        {children}
      </div>
    </section>
  )
}

export default Rail
