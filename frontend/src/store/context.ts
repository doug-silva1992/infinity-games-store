import { createContext } from 'react'
import type { Jogo } from '../data/jogos'
import type { Notificacao } from '../data/perfil'
import type { Usuario } from '../utils/api'

export type Toast = {
  id: number
  tipo: 'carrinho' | 'desejo' | 'conquista' | 'nivel' | 'compra' | 'info'
  titulo: string
  texto?: string
}

export type Modal = { jogo: Jogo; trailer: boolean } | null

export type Store = {
  // Estado
  usuario: Usuario | null
  carrinho: Jogo[]
  desejos: Set<number>
  biblioteca: Set<number>
  xp: number
  nivel: number
  xpNoNivel: number
  conquistas: Set<string>
  notificacoes: Notificacao[]
  toasts: Toast[]
  carrinhoAberto: boolean
  modal: Modal
  busca: string
  // Ações
  entrar: (usuario: Usuario, lembrar: boolean) => void
  atualizarUsuario: (usuario: Usuario) => void
  sair: () => void
  adicionarAoCarrinho: (jogo: Jogo) => void
  removerDoCarrinho: (id: number) => void
  alternarDesejo: (jogo: Jogo) => void
  finalizarCompra: () => void
  setCarrinhoAberto: (aberto: boolean) => void
  abrirJogo: (jogo: Jogo, trailer?: boolean) => void
  fecharJogo: () => void
  setBusca: (busca: string) => void
  marcarNotificacoesLidas: () => void
  dispensarToast: (id: number) => void
}

export const StoreContext = createContext<Store | null>(null)
