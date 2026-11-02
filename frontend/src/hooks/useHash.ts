import { useEffect, useState } from 'react'

// Hash atual da URL (#entrar, #registrar...), usado como rota simples entre telas
export function useHash() {
  const [hash, setHash] = useState(location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(location.hash)
    addEventListener('hashchange', onHashChange)
    return () => removeEventListener('hashchange', onHashChange)
  }, [])

  return hash
}
