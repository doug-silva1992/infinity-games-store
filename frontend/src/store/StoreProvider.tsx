import { useRef, useState, type ReactNode } from 'react'
import { jogoPorId, type Jogo } from '../data/jogos'
import {
  BIBLIOTECA_INICIAL,
  CONQUISTAS,
  CONQUISTAS_INICIAIS,
  DESEJOS_INICIAIS,
  JOGADOR,
  NOTIFICACOES_INICIAIS,
  XP_POR_NIVEL,
  nivelDe,
  xpGanhoPorCompra,
} from '../data/perfil'
import type { Usuario } from '../utils/api'
import { lerSessao, salvarSessao } from '../utils/sessao'
import { StoreContext, type Modal, type Store, type Toast } from './context'

function StoreProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerSessao)
  const [carrinhoIds, setCarrinhoIds] = useState<number[]>([])
  const [desejos, setDesejos] = useState(() => new Set(DESEJOS_INICIAIS))
  const [biblioteca, setBiblioteca] = useState(() => new Set(BIBLIOTECA_INICIAL))
  const [xp, setXp] = useState(JOGADOR.xpInicial)
  const [conquistas, setConquistas] = useState(() => new Set(CONQUISTAS_INICIAIS))
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_INICIAIS)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [modal, setModal] = useState<Modal>(null)
  const [busca, setBusca] = useState('')
  const proximoToast = useRef(0)

  const dispensarToast = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  const notificar = (toast: Omit<Toast, 'id'>) => {
    const id = ++proximoToast.current
    setToasts((t) => [...t.slice(-3), { ...toast, id }])
    setTimeout(() => dispensarToast(id), 4200)
  }

  // Desbloqueia conquistas ainda não obtidas e devolve o XP bônus
  const desbloquear = (ids: string[]) => {
    const novas = CONQUISTAS.filter((c) => ids.includes(c.id) && !conquistas.has(c.id))
    if (novas.length === 0) return 0
    setConquistas((atual) => new Set([...atual, ...novas.map((c) => c.id)]))
    novas.forEach((c) =>
      notificar({ tipo: 'conquista', titulo: c.nome, texto: `${c.descricao} · +${c.xp} XP` }),
    )
    return novas.reduce((s, c) => s + c.xp, 0)
  }

  const ganharXp = (ganho: number) => {
    const novoXp = xp + ganho
    if (nivelDe(novoXp) > nivelDe(xp)) {
      notificar({ tipo: 'nivel', titulo: `Nível ${nivelDe(novoXp)} alcançado!`, texto: 'O Ignis está orgulhoso de você.' })
    }
    setXp(novoXp)
  }

  const entrar = (novo: Usuario, lembrar: boolean) => {
    salvarSessao(novo, lembrar)
    setUsuario(novo)
  }

  const atualizarUsuario = (novo: Usuario) => {
    salvarSessao(novo)
    setUsuario(novo)
  }

  const sair = () => {
    salvarSessao(null)
    setUsuario(null)
    notificar({ tipo: 'info', titulo: 'Você saiu da sua conta' })
  }

  const adicionarAoCarrinho = (jogo: Jogo) => {
    if (biblioteca.has(jogo.id)) {
      notificar({ tipo: 'info', titulo: 'Já está na sua biblioteca', texto: jogo.titulo })
      return
    }
    if (carrinhoIds.includes(jogo.id)) {
      setCarrinhoAberto(true)
      return
    }
    setCarrinhoIds((c) => [...c, jogo.id])
    notificar({ tipo: 'carrinho', titulo: 'Adicionado ao carrinho', texto: jogo.titulo })
  }

  const removerDoCarrinho = (id: number) => setCarrinhoIds((c) => c.filter((x) => x !== id))

  const alternarDesejo = (jogo: Jogo) => {
    const novos = new Set(desejos)
    if (novos.has(jogo.id)) {
      novos.delete(jogo.id)
      notificar({ tipo: 'info', titulo: 'Removido da lista de desejos', texto: jogo.titulo })
    } else {
      novos.add(jogo.id)
      notificar({ tipo: 'desejo', titulo: 'Adicionado à lista de desejos', texto: jogo.titulo })
    }
    setDesejos(novos)
    if (novos.size >= 5) {
      const bonus = desbloquear(['colecionador'])
      if (bonus) ganharXp(bonus)
    }
  }

  const finalizarCompra = () => {
    const itens = carrinhoIds.map(jogoPorId)
    if (itens.length === 0) return

    const ganho = itens.reduce((s, j) => s + xpGanhoPorCompra(j.preco), 0)
    const bonus = desbloquear([
      'temporada',
      ...(itens.some((j) => j.precoAntigo) ? ['cacador'] : []),
      ...(itens.some((j) => j.indie) ? ['indie'] : []),
      ...(itens.some((j) => j.dragao) ? ['dragao'] : []),
    ])

    setBiblioteca((b) => new Set([...b, ...carrinhoIds]))
    setDesejos((d) => new Set([...d].filter((id) => !carrinhoIds.includes(id))))
    setCarrinhoIds([])
    setCarrinhoAberto(false)
    setNotificacoes((n) => [
      {
        id: Date.now(),
        titulo: 'Compra confirmada',
        texto: `${itens.length} jogo(s) adicionados à sua biblioteca.`,
        tempo: 'agora',
        icone: 'check',
        lida: false,
      },
      ...n,
    ])
    notificar({ tipo: 'compra', titulo: 'Compra concluída!', texto: `+${ganho} XP pela compra` })
    ganharXp(ganho + bonus)
  }

  const store: Store = {
    usuario,
    carrinho: carrinhoIds.map(jogoPorId),
    desejos,
    biblioteca,
    xp,
    nivel: nivelDe(xp),
    xpNoNivel: xp % XP_POR_NIVEL,
    conquistas,
    notificacoes,
    toasts,
    carrinhoAberto,
    modal,
    busca,
    entrar,
    atualizarUsuario,
    sair,
    adicionarAoCarrinho,
    removerDoCarrinho,
    alternarDesejo,
    finalizarCompra,
    setCarrinhoAberto,
    abrirJogo: (jogo, trailer = false) => setModal({ jogo, trailer }),
    fecharJogo: () => setModal(null),
    setBusca,
    marcarNotificacoesLidas: () => setNotificacoes((n) => n.map((x) => ({ ...x, lida: true }))),
    dispensarToast,
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default StoreProvider
