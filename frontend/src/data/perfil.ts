import type { IconName } from '../components/Icon'

// Perfil gamer de demonstração (substituir pelos dados da API quando houver autenticação)
export const JOGADOR = {
  gamertag: 'InfinityRider',
  titulo: 'Domador de Dragões',
  xpInicial: 26640,
  horasJogadas: 1284,
  membroDesde: 2023,
}

export const XP_POR_NIVEL = 1000
export const nivelDe = (xp: number) => Math.floor(xp / XP_POR_NIVEL) + 1
export const xpGanhoPorCompra = (preco: number) => Math.round(preco * 2)

export type Raridade = 'Comum' | 'Rara' | 'Épica' | 'Lendária'

export type Conquista = {
  id: string
  nome: string
  descricao: string
  icone: IconName
  raridade: Raridade
  xp: number
}

export const CONQUISTAS: Conquista[] = [
  { id: 'veterano', nome: 'Veterano do Infinito', descricao: 'Membro há mais de 3 anos', icone: 'shield', raridade: 'Rara', xp: 200 },
  { id: 'critico', nome: 'Crítico de Elite', descricao: 'Avaliou 10 jogos', icone: 'star', raridade: 'Comum', xp: 100 },
  { id: 'coruja', nome: 'Coruja Noturna', descricao: 'Jogou às 3h da manhã', icone: 'moon', raridade: 'Comum', xp: 100 },
  { id: 'temporada', nome: 'Temporada Aberta', descricao: 'Faça sua primeira compra da temporada', icone: 'cart', raridade: 'Comum', xp: 150 },
  { id: 'colecionador', nome: 'Colecionador', descricao: 'Tenha 5 jogos na lista de desejos', icone: 'heart', raridade: 'Rara', xp: 250 },
  { id: 'cacador', nome: 'Caçador de Ofertas', descricao: 'Compre um jogo em promoção', icone: 'bolt', raridade: 'Rara', xp: 250 },
  { id: 'indie', nome: 'Coração Indie', descricao: 'Compre um jogo independente', icone: 'gem', raridade: 'Épica', xp: 400 },
  { id: 'maratonista', nome: 'Maratonista', descricao: 'Jogue 100 horas em um único jogo', icone: 'clock', raridade: 'Épica', xp: 500 },
  { id: 'dragao', nome: 'Amigo do Dragão', descricao: 'Compre um jogo recomendado pelo Ignis', icone: 'flame', raridade: 'Lendária', xp: 800 },
]

export const CONQUISTAS_INICIAIS = ['veterano', 'critico', 'coruja']
export const BIBLIOTECA_INICIAL = [5, 11]
export const DESEJOS_INICIAIS = [12, 14]

export const RANKING = [
  { gamertag: 'VoidWalker', xp: 41210 },
  { gamertag: 'NovaKnight', xp: 38990 },
  { gamertag: 'PixelSamurai', xp: 33450 },
  { gamertag: 'LunaByte', xp: 29870 },
  { gamertag: 'Kr4ken', xp: 27100 },
  { gamertag: 'GhostRacer', xp: 25980 },
  { gamertag: 'AuroraFox', xp: 24310 },
]

export type Notificacao = {
  id: number
  titulo: string
  texto: string
  tempo: string
  icone: IconName
  lida: boolean
}

export const NOTIFICACOES_INICIAIS: Notificacao[] = [
  { id: 1, titulo: 'Lâmina Eterna entrou em promoção', texto: 'Um jogo da sua lista de desejos está com 23% de desconto.', tempo: 'há 5 min', icone: 'bolt', lida: false },
  { id: 2, titulo: 'NovaKnight te desafiou', texto: 'Supere 38.990 XP para tomar o 2º lugar do ranking.', tempo: 'há 1 h', icone: 'trophy', lida: false },
  { id: 3, titulo: 'Ignis tem novas recomendações', texto: 'O dragão separou 4 jogos com base no seu perfil.', tempo: 'há 3 h', icone: 'flame', lida: true },
]
