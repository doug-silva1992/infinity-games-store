// Catálogo de exemplo (títulos fictícios)
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

export const JOGOS: Jogo[] = [
  {
    id: 1, titulo: 'Nebula Drift', genero: 'Corrida', cena: 'cidade',
    descricao: 'Corridas clandestinas em uma megacidade suspensa, com drift magnético e rivais que aprendem com você.',
    plataformas: ['PS5', 'PC'], preco: 249.9, precoAntigo: 299.9, nota: 4.7, avaliacoes: 18400, horas: 25,
    modo: 'Single + Multi', lancamento: '2026-10-17', vendas: 8200, tendencia: 95,
    cores: ['#14072e', '#ff2e88', '#22d3ee'], novo: true,
  },
  {
    id: 2, titulo: 'Crônicas de Aldoria', genero: 'RPG', cena: 'montanhas',
    descricao: 'Explore um reino em ruínas, forme alianças e decida o destino de Aldoria neste RPG épico de mundo aberto.',
    plataformas: ['PS5', 'Xbox', 'PC'], preco: 299.9, nota: 4.9, avaliacoes: 32100, horas: 120,
    modo: 'Singleplayer', lancamento: '2025-11-20', vendas: 15400, tendencia: 99,
    cores: ['#1b0d3a', '#f97316', '#fbbf24'], dragao: true,
  },
  {
    id: 3, titulo: 'Esquadrão Ômega', genero: 'Tiro', cena: 'cidade',
    descricao: 'Operações táticas 5v5 em arenas urbanas destrutíveis. Cada bala conta, cada parede pode cair.',
    plataformas: ['Xbox', 'PC'], preco: 179.9, precoAntigo: 259.9, nota: 4.3, avaliacoes: 25600, horas: 40,
    modo: 'Multiplayer', lancamento: '2024-08-09', vendas: 12100, tendencia: 81,
    cores: ['#03111f', '#0ea5e9', '#a5f3fc'], relampago: true,
  },
  {
    id: 4, titulo: 'Pixel Pals', genero: 'Aventura', cena: 'floresta',
    descricao: 'Adote criaturas de pixel, construa sua vila na floresta e viva aventuras cooperativas com amigos.',
    plataformas: ['Switch'], preco: 199.9, nota: 4.8, avaliacoes: 9800, horas: 18,
    modo: 'Single + Multi', lancamento: '2026-10-03', vendas: 6900, tendencia: 88,
    cores: ['#0b2447', '#38bdf8', '#bef264'], novo: true, dragao: true,
  },
  {
    id: 5, titulo: 'Liga Galáctica 26', genero: 'Esporte', cena: 'arena',
    descricao: 'Futebol em estádios orbitais com gravidade variável. Monte seu elenco e conquiste a galáxia.',
    plataformas: ['PS5', 'Xbox', 'Switch', 'PC'], preco: 329.9, nota: 4.1, avaliacoes: 41200, horas: 60,
    modo: 'Multiplayer', lancamento: '2026-09-26', vendas: 18900, tendencia: 90,
    cores: ['#021a12', '#10b981', '#d9f99d'],
  },
  {
    id: 6, titulo: 'Sombras de Kairo', genero: 'Terror', cena: 'floresta',
    descricao: 'Uma vila esquecida, uma lua vermelha e algo que observa entre as árvores. Sobreviva até o amanhecer.',
    plataformas: ['PS5'], preco: 149.9, precoAntigo: 229.9, nota: 4.6, avaliacoes: 11300, horas: 14,
    modo: 'Singleplayer', lancamento: '2025-10-31', vendas: 7400, tendencia: 76,
    cores: ['#0a0406', '#7f1d1d', '#f87171'], relampago: true,
  },
  {
    id: 7, titulo: 'Mecha Forge', genero: 'Estratégia', cena: 'deserto',
    descricao: 'Projete mechas peça por peça e lidere batalhões em campanhas táticas pelo deserto de Vashir.',
    plataformas: ['PC'], preco: 119.9, nota: 4.4, avaliacoes: 7600, horas: 80,
    modo: 'Single + Multi', lancamento: '2024-03-14', vendas: 5200, tendencia: 62,
    cores: ['#1c0d06', '#ea580c', '#fde047'],
  },
  {
    id: 8, titulo: 'Ilha dos Ventos', genero: 'Aventura', cena: 'oceano',
    descricao: 'Velejar, explorar ruínas submersas e desvendar o segredo do farol que nunca se apaga.',
    plataformas: ['Switch', 'PC'], preco: 99.9, precoAntigo: 139.9, nota: 4.5, avaliacoes: 6100, horas: 22,
    modo: 'Singleplayer', lancamento: '2025-06-12', vendas: 4800, tendencia: 70,
    cores: ['#062a44', '#0ea5e9', '#fef08a'], indie: true, relampago: true,
  },
  {
    id: 9, titulo: 'Ringue Supremo', genero: 'Luta', cena: 'arena',
    descricao: 'Lutadores de 24 estilos, rollback netcode e torneios ranqueados toda semana.',
    plataformas: ['PS5', 'Xbox'], preco: 219.9, nota: 4.2, avaliacoes: 8700, horas: 30,
    modo: 'Multiplayer', lancamento: '2026-10-24', vendas: 5600, tendencia: 84,
    cores: ['#1f0610', '#e11d48', '#fdba74'], novo: true,
  },
  {
    id: 10, titulo: 'Astro Colônia', genero: 'Estratégia', cena: 'espaco',
    descricao: 'Funde colônias em planetas hostis, gerencie recursos escassos e mantenha sua tripulação viva.',
    plataformas: ['PC', 'Xbox'], preco: 159.9, nota: 4.6, avaliacoes: 10400, horas: 90,
    modo: 'Singleplayer', lancamento: '2025-02-27', vendas: 6300, tendencia: 74,
    cores: ['#050a24', '#3b82f6', '#c4b5fd'], dragao: true,
  },
  {
    id: 11, titulo: 'Turbo Kart Mania', genero: 'Corrida', cena: 'arena',
    descricao: 'Pistas malucas, itens caóticos e corridas para até 12 jogadores na mesma sala.',
    plataformas: ['Switch'], preco: 279.9, nota: 4.8, avaliacoes: 22800, horas: 35,
    modo: 'Multiplayer', lancamento: '2025-12-05', vendas: 13700, tendencia: 86,
    cores: ['#1a0b00', '#f59e0b', '#fef08a'],
  },
  {
    id: 12, titulo: 'Lâmina Eterna', genero: 'RPG', cena: 'montanhas',
    descricao: 'Combate preciso, chefes colossais e uma espada amaldiçoada que se lembra de cada vida que tirou.',
    plataformas: ['PS5', 'PC'], preco: 269.9, precoAntigo: 349.9, nota: 4.7, avaliacoes: 19900, horas: 70,
    modo: 'Singleplayer', lancamento: '2025-09-18', vendas: 10800, tendencia: 83,
    cores: ['#120a24', '#7c3aed', '#f0abfc'], relampago: true,
  },
  {
    id: 13, titulo: 'Lumen', genero: 'Plataforma', cena: 'floresta',
    descricao: 'Guie uma pequena chama por uma floresta bioluminescente onde a luz é seu único caminho.',
    plataformas: ['PC', 'Switch'], preco: 49.9, nota: 4.9, avaliacoes: 5400, horas: 10,
    modo: 'Singleplayer', lancamento: '2026-10-29', vendas: 3900, tendencia: 92,
    cores: ['#03141a', '#0e7490', '#67e8f9'], novo: true, indie: true, dragao: true,
  },
  {
    id: 14, titulo: 'Eco do Vazio', genero: 'Metroidvania', cena: 'espaco',
    descricao: 'Uma estação abandonada à deriva, habilidades perdidas e ecos de uma tripulação que nunca partiu.',
    plataformas: ['PC'], preco: 59.9, precoAntigo: 79.9, nota: 4.6, avaliacoes: 3800, horas: 15,
    modo: 'Singleplayer', lancamento: '2026-05-21', vendas: 2900, tendencia: 79,
    cores: ['#0d0221', '#6d28d9', '#22d3ee'], indie: true, relampago: true,
  },
  {
    id: 15, titulo: 'Pequeno Farol', genero: 'Puzzle', cena: 'oceano',
    descricao: 'Quebra-cabeças de luz e reflexo em um farol que guarda as memórias de quem passou por ali.',
    plataformas: ['PC', 'Switch', 'PS5'], preco: 39.9, nota: 4.7, avaliacoes: 4100, horas: 8,
    modo: 'Singleplayer', lancamento: '2026-08-14', vendas: 3100, tendencia: 72,
    cores: ['#1e1b4b', '#f472b6', '#fde68a'], indie: true,
  },
  {
    id: 16, titulo: 'Raízes', genero: 'Simulação', cena: 'montanhas',
    descricao: 'Cultive um vale esquecido, restaure o ecossistema e construa uma comunidade em modo co-op.',
    plataformas: ['PC'], preco: 69.9, nota: 4.5, avaliacoes: 3300, horas: 40,
    modo: 'Single + Multi', lancamento: '2026-07-02', vendas: 2500, tendencia: 68,
    cores: ['#052e16', '#16a34a', '#d9f99d'], indie: true,
  },
]

export const PLATAFORMAS: ('Todas' | Plataforma)[] = ['Todas', 'PS5', 'Xbox', 'Switch', 'PC']
export const GENEROS = ['Todos', ...Array.from(new Set(JOGOS.map((j) => j.genero))).sort()]
export const MODOS: ('Todos' | Modo)[] = ['Todos', 'Singleplayer', 'Multiplayer', 'Single + Multi']

export const jogoPorId = (id: number) => JOGOS.find((j) => j.id === id)!
