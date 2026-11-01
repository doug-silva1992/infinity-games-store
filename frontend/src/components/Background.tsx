import { useEffect, useRef } from 'react'
import './Background.css'

type Particula = { x: number; y: number; vx: number; vy: number; r: number; cor: string }

const CORES = ['124, 58, 237', '59, 130, 246', '6, 182, 212']
const DISTANCIA_LINHA = 130

// Fundo fixo: brilhos, grid em perspectiva e partículas conectadas (canvas)
function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches
    let largura = 0
    let altura = 0
    let particulas: Particula[] = []
    let frame = 0

    const redimensionar = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      largura = innerWidth
      altura = innerHeight
      canvas.width = largura * dpr
      canvas.height = altura * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const total = Math.round(Math.min(90, (largura * altura) / 15000))
      particulas = Array.from({ length: total }, () => ({
        x: Math.random() * largura,
        y: Math.random() * altura,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22 - 0.06,
        r: Math.random() * 1.5 + 0.4,
        cor: CORES[Math.floor(Math.random() * CORES.length)],
      }))
    }

    const desenhar = () => {
      ctx.clearRect(0, 0, largura, altura)
      for (const p of particulas) {
        p.x = (p.x + p.vx + largura) % largura
        p.y = (p.y + p.vy + altura) % altura
      }
      for (let i = 0; i < particulas.length; i++) {
        for (let j = i + 1; j < particulas.length; j++) {
          const a = particulas[i]
          const b = particulas[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < DISTANCIA_LINHA) {
            ctx.strokeStyle = `rgba(${a.cor}, ${(1 - d / DISTANCIA_LINHA) * 0.16})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const p of particulas) {
        ctx.fillStyle = `rgba(${p.cor}, 0.85)`
        ctx.shadowColor = `rgba(${p.cor}, 0.9)`
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    const loop = () => {
      desenhar()
      frame = requestAnimationFrame(loop)
    }

    redimensionar()
    addEventListener('resize', redimensionar)
    if (reduzirMovimento) desenhar()
    else loop()

    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('resize', redimensionar)
    }
  }, [])

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-glow bg-glow-a" />
      <div className="bg-glow bg-glow-b" />
      <div className="bg-glow bg-glow-c" />
      <div className="bg-grid" />
      <canvas ref={canvasRef} className="bg-canvas" />
      <div className="bg-vignette" />
    </div>
  )
}

export default Background
