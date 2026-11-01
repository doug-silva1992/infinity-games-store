import { useEffect, useRef } from 'react'

// Fecha um popover ao clicar fora dele ou apertar Esc
export function useClickOutside<T extends HTMLElement>(aberto: boolean, fechar: () => void) {
  const ref = useRef<T>(null)
  const fecharRef = useRef(fechar)
  fecharRef.current = fechar

  useEffect(() => {
    if (!aberto) return
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) fecharRef.current()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharRef.current()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [aberto])

  return ref
}
