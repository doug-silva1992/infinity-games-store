import { useContext } from 'react'
import { StoreContext } from './context'

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore precisa estar dentro de <StoreProvider>')
  return store
}
