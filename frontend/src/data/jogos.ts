export type Plataforma = 'PS5' | 'Xbox' | 'Switch' | 'PC'
export type Modo = 'Singleplayer' | 'Multiplayer' | 'Single + Multi'
export type Cena = 'cidade' | 'montanhas' | 'espaco' | 'floresta' | 'oceano' | 'arena' | 'deserto'

export type Jogo = {
  id: number
  titulo: string
  descricao: string
  plataformas: Plataforma[]
  genero: string
  preco: number
  precoAntigo?: number
  nota: number
  avaliacoes: number
  horas: number
  modo: Modo
  lancamento: string
  vendas: number
  tendencia: number
  // Arte da capa: cena ilustrada + [céu, horizonte, luz de destaque]
  cena: Cena
  cores: [string, string, string]
  novo?: boolean
  indie?: boolean
  dragao?: boolean
  relampago?: boolean
}

// Vazio: os produtos passam a ser cadastrados na tabela "produtos" do banco
export const JOGOS: Jogo[] = []

export const PLATAFORMAS: ('Todas' | Plataforma)[] = ['Todas', 'PS5', 'Xbox', 'Switch', 'PC']
export const GENEROS = ['Todos', ...Array.from(new Set(JOGOS.map((j) => j.genero))).sort()]
export const MODOS: ('Todos' | Modo)[] = ['Todos', 'Singleplayer', 'Multiplayer', 'Single + Multi']

export const jogoPorId = (id: number) => JOGOS.find((j) => j.id === id)!
