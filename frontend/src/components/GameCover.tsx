import { useId, useMemo, type CSSProperties, type ReactNode } from 'react'
import type { Jogo } from '../data/jogos'
import { DRAGAO_SILHUETA } from './dragon-paths'
import './GameCover.css'

const W = 640
const H = 360
const SOMBRA = '#05030c'

// Gerador pseudoaleatório determinístico: a mesma capa é desenhada sempre igual
function aleatorio(semente: number) {
  let a = semente * 2654435761
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Ctx = { p: string; r: () => number; c: [string, string, string]; jogo: Jogo; dragao: boolean }

const estrelas = ({ r }: Ctx, total: number, ateY = H) =>
  Array.from({ length: total }, (_, i) => (
    <circle key={i} cx={r() * W} cy={r() * ateY} r={r() * 1.3 + 0.2} fill="#fff" opacity={r() * 0.7 + 0.2} />
  ))

function cordilheira(r: () => number, base: number, amp: number, passos: number) {
  const pts = [`0,${H}`]
  for (let i = 0; i <= passos; i++) {
    const alto = i % 2 === 1
    const y = base - (alto ? 0.45 + r() * 0.55 : r() * 0.3) * amp
    pts.push(`${((W / passos) * i).toFixed(0)},${y.toFixed(0)}`)
  }
  pts.push(`${W},${H}`)
  return pts.join(' ')
}

function pinheiros(r: () => number, base: number, total: number, altMin: number, altMax: number) {
  let d = ''
  for (let i = 0; i < total; i++) {
    const x = (W / total) * i + r() * 30 - 15
    const h = altMin + r() * (altMax - altMin)
    const w = h * 0.38
    d += `M${x - w / 2},${base} L${x},${base - h} L${x + w / 2},${base} Z `
  }
  return `${d} M0,${base - 2} H${W} V${H} H0 Z`
}

const dragao = (x: number, y: number, escala: number, opacidade = 0.9) => (
  <path d={DRAGAO_SILHUETA} fill={SOMBRA} opacity={opacidade} transform={`translate(${x} ${y}) scale(${escala})`} />
)

const CENAS: Record<Jogo['cena'], (ctx: Ctx) => ReactNode> = {
  cidade: (ctx) => {
    const { p, r, c } = ctx
    const predios = (base: number, altMax: number, opacidade: number, janelas: boolean) => {
      const els: ReactNode[] = []
      for (let x = -10, i = 0; x < W; i++) {
        const w = 18 + r() * 26
        const h = 30 + r() * altMax
        els.push(<rect key={`p${i}`} x={x} y={base - h} width={w} height={h + 2} fill={SOMBRA} opacity={opacidade} />)
        if (janelas) {
          for (let k = 0; k < 6; k++) {
            if (r() > 0.45) {
              els.push(
                <rect key={`j${i}-${k}`} x={x + 3 + r() * (w - 8)} y={base - h + 6 + r() * (h - 14)} width={2.5} height={3.5} fill={c[2]} opacity={0.5 + r() * 0.5} />,
              )
            }
          }
        }
        x += w + 2
      }
      return els
    }
    return (
      <>
        <rect width={W} height={H} fill={`url(#${p}ceu)`} />
        {estrelas(ctx, 40, 160)}
        <circle cx={320} cy={190} r={190} fill={`url(#${p}brilho)`} opacity={0.55} />
        <circle cx={320} cy={185} r={92} fill={`url(#${p}sol)`} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={220} y={200 + i * 13} width={200} height={2 + i * 1.4} fill={c[1]} />
        ))}
        {predios(262, 120, 0.6, false)}
        {predios(262, 80, 1, true)}
        <rect y={262} width={W} height={H - 262} fill={SOMBRA} />
        <g stroke={c[2]} strokeWidth={1} opacity={0.55}>
          {[0, 1, 2, 3, 4, 5, 6].map((k) => (
            <line key={`h${k}`} x1={0} x2={W} y1={262 + k * k * 2.2 + k * 3} y2={262 + k * k * 2.2 + k * 3} />
          ))}
          {Array.from({ length: 21 }, (_, i) => (
            <line key={`v${i}`} x1={320 + (i - 10) * 18} y1={262} x2={320 + (i - 10) * 120} y2={H} />
          ))}
        </g>
      </>
    )
  },

  montanhas: (ctx) => {
    const { p, r, c, jogo } = ctx
    return (
      <>
        <rect width={W} height={H} fill={`url(#${p}ceu)`} />
        {estrelas(ctx, 30, 120)}
        <circle cx={430} cy={150} r={200} fill={`url(#${p}brilho)`} opacity={0.7} />
        <circle cx={430} cy={150} r={38} fill={c[2]} />
        {jogo.dragao && ctx.dragao && dragao(150, 50, 0.85)}
        <polygon points={cordilheira(r, 220, 130, 9)} fill={SOMBRA} opacity={0.35} />
        <rect y={150} width={W} height={120} fill={`url(#${p}nevoa)`} opacity={0.5} />
        <polygon points={cordilheira(r, 250, 110, 11)} fill={SOMBRA} opacity={0.6} />
        <polygon points={cordilheira(r, 290, 90, 13)} fill={SOMBRA} opacity={0.82} />
        <rect y={230} width={W} height={90} fill={`url(#${p}nevoa)`} opacity={0.35} />
        <polygon points={cordilheira(r, 335, 60, 15)} fill={SOMBRA} />
      </>
    )
  },

  espaco: (ctx) => {
    const { p, r, c } = ctx
    return (
      <>
        <rect width={W} height={H} fill={c[0]} />
        <ellipse cx={180} cy={120} rx={220} ry={90} fill={c[1]} opacity={0.35} filter={`url(#${p}blur)`} />
        <ellipse cx={520} cy={260} rx={200} ry={80} fill={c[2]} opacity={0.18} filter={`url(#${p}blur)`} />
        {estrelas(ctx, 130)}
        <circle cx={140} cy={80} r={16} fill={c[2]} opacity={0.8} />
        <circle cx={420} cy={190} r={170} fill={`url(#${p}brilho)`} opacity={0.4} />
        <circle cx={420} cy={190} r={108} fill={`url(#${p}planeta)`} />
        <circle cx={420} cy={190} r={108} fill={`url(#${p}sombraPlaneta)`} />
        <ellipse cx={420} cy={190} rx={185} ry={30} fill="none" stroke={c[2]} strokeWidth={5} opacity={0.55} transform="rotate(-14 420 190)" />
        <ellipse cx={420} cy={190} rx={160} ry={24} fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.3} transform="rotate(-14 420 190)" />
        <polygon points={cordilheira(r, 345, 40, 18)} fill={SOMBRA} />
      </>
    )
  },

  floresta: (ctx) => {
    const { p, r, c } = ctx
    return (
      <>
        <rect width={W} height={H} fill={`url(#${p}ceu)`} />
        {estrelas(ctx, 50, 180)}
        <circle cx={470} cy={105} r={150} fill={`url(#${p}brilho)`} opacity={0.75} />
        <circle cx={470} cy={105} r={44} fill={c[2]} />
        <path d={pinheiros(r, 250, 30, 60, 120)} fill={SOMBRA} opacity={0.45} />
        <rect y={180} width={W} height={100} fill={`url(#${p}nevoa)`} opacity={0.45} />
        <path d={pinheiros(r, 296, 22, 90, 170)} fill={SOMBRA} opacity={0.78} />
        {Array.from({ length: 18 }, (_, i) => (
          <circle key={i} cx={r() * W} cy={200 + r() * 140} r={1.4 + r() * 1.6} fill={c[2]} opacity={0.8} filter={`url(#${p}glow)`} />
        ))}
        <path d={pinheiros(r, 350, 14, 140, 260)} fill={SOMBRA} />
      </>
    )
  },

  oceano: (ctx) => {
    const { p, r, c } = ctx
    return (
      <>
        <rect width={W} height={H} fill={`url(#${p}ceu)`} />
        {estrelas(ctx, 25, 140)}
        <circle cx={360} cy={232} r={210} fill={`url(#${p}brilho)`} opacity={0.75} />
        <circle cx={360} cy={232} r={58} fill={c[2]} />
        <rect y={232} width={W} height={H - 232} fill={`url(#${p}mar)`} />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={360 - (60 - i * 6)} y={240 + i * 12} width={(60 - i * 6) * 2} height={3} rx={1.5} fill={c[2]} opacity={0.7 - i * 0.06} />
        ))}
        {Array.from({ length: 14 }, (_, i) => {
          const y = 250 + r() * 100
          const x = r() * W
          return <path key={`o${i}`} d={`M${x},${y} q12,-5 24,0 t24,0`} fill="none" stroke="#fff" strokeWidth={1} opacity={0.25} />
        })}
        <path d="M0,300 C40,262 90,250 150,262 C190,270 210,290 240,310 L240,360 L0,360 Z" fill={SOMBRA} />
        <rect x={128} y={192} width={14} height={72} fill={SOMBRA} />
        <polygon points="124,192 146,192 135,176" fill={SOMBRA} />
        <polygon points="142,196 330,150 330,236" fill={c[2]} opacity={0.16} />
        <circle cx={135} cy={198} r={5} fill={c[2]} filter={`url(#${p}glow)`} />
      </>
    )
  },

  arena: (ctx) => {
    const { p, r, c } = ctx
    return (
      <>
        <rect width={W} height={H} fill={`url(#${p}ceu)`} />
        {[60, 220, 420, 580].map((x, i) => (
          <polygon key={i} points={`${x - 8},0 ${x + 8},0 ${320 + (x - 320) * 0.25 + 90},${H} ${320 + (x - 320) * 0.25 - 90},${H}`} fill={c[2]} opacity={0.13} filter={`url(#${p}blur)`} />
        ))}
        {[60, 220, 420, 580].map((x, i) => (
          <circle key={`l${i}`} cx={x} cy={6} r={7} fill="#fff" filter={`url(#${p}glow)`} />
        ))}
        <path d={`M0,190 Q320,120 ${W},190 L${W},${H} L0,${H} Z`} fill={SOMBRA} opacity={0.7} />
        {Array.from({ length: 160 }, (_, i) => {
          const x = r() * W
          const y = 175 + r() * 70 - Math.sin((x / W) * Math.PI) * 45
          return <circle key={`t${i}`} cx={x} cy={y} r={1.3} fill={r() > 0.7 ? c[2] : c[1]} opacity={0.6} />
        })}
        <path d={`M0,250 Q320,205 ${W},250 L${W},${H} L0,${H} Z`} fill={SOMBRA} />
        <ellipse cx={320} cy={318} rx={300} ry={46} fill={`url(#${p}brilho)`} opacity={0.75} />
        <ellipse cx={320} cy={318} rx={150} ry={22} fill="none" stroke={c[2]} strokeWidth={2} opacity={0.8} />
        <line x1={320} y1={296} x2={320} y2={340} stroke={c[2]} strokeWidth={2} opacity={0.6} />
      </>
    )
  },

  deserto: (ctx) => {
    const { p, r } = ctx
    const duna = (base: number, amp: number) => {
      const a = base - r() * amp
      const b = base - r() * amp
      return `M0,${base} Q160,${a} 320,${base - amp * 0.3} T${W},${b} L${W},${H} L0,${H} Z`
    }
    return (
      <>
        <rect width={W} height={H} fill={`url(#${p}ceu)`} />
        <circle cx={330} cy={210} r={240} fill={`url(#${p}brilho)`} opacity={0.6} />
        <circle cx={330} cy={200} r={115} fill={`url(#${p}sol)`} />
        <g opacity={0.8}>
          <rect x={470} y={170} width={10} height={80} fill={SOMBRA} />
          <rect x={455} y={160} width={40} height={18} fill={SOMBRA} />
          <rect x={480} y={186} width={30} height={6} fill={SOMBRA} />
        </g>
        <path d={duna(250, 60)} fill={SOMBRA} opacity={0.45} />
        <path d={duna(285, 50)} fill={SOMBRA} opacity={0.72} />
        <path d={duna(325, 40)} fill={SOMBRA} />
      </>
    )
  },
}

type Props = {
  jogo: Jogo
  logo?: boolean
  // Desenha o Ignis na arte dos jogos recomendados (o banner usa uma camada própria)
  dragao?: boolean
  className?: string
}

function GameCover({ jogo, logo = true, dragao = true, className = '' }: Props) {
  const p = `c${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const [c0, c1, c2] = jogo.cores

  const cena = useMemo(
    () => CENAS[jogo.cena]({ p, r: aleatorio(jogo.id), c: jogo.cores, jogo, dragao }),
    [jogo, p, dragao],
  )

  return (
    <div className={`cover ${className}`} style={{ '--cover-glow': c2 } as CSSProperties}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="cover-art" role="img" aria-label={`Arte de ${jogo.titulo}`}>
        <defs>
          <linearGradient id={`${p}ceu`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c0} />
            <stop offset="1" stopColor={c1} />
          </linearGradient>
          <radialGradient id={`${p}brilho`}>
            <stop offset="0" stopColor={c2} stopOpacity="0.9" />
            <stop offset="1" stopColor={c2} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${p}sol`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c2} />
            <stop offset="1" stopColor={c1} />
          </linearGradient>
          <linearGradient id={`${p}nevoa`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c1} stopOpacity="0" />
            <stop offset="0.6" stopColor={c1} stopOpacity="0.8" />
            <stop offset="1" stopColor={c1} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${p}mar`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c0} />
          </linearGradient>
          <radialGradient id={`${p}planeta`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor={c2} />
            <stop offset="0.5" stopColor={c1} />
            <stop offset="1" stopColor={c0} />
          </radialGradient>
          <radialGradient id={`${p}sombraPlaneta`} cx="0.8" cy="0.85" r="0.9">
            <stop offset="0" stopColor="#000" stopOpacity="0.85" />
            <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id={`${p}blur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id={`${p}glow`} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {cena}
      </svg>
      <div className="cover-sheen" />
      {logo && <span className="cover-logo">{jogo.titulo}</span>}
    </div>
  )
}

export default GameCover
