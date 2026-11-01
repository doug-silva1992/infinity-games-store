// Dados de exemplo (títulos fictícios)
export type Plataforma = 'PS5' | 'Xbox' | 'Switch' | 'PC'

export type Jogo = {
  id: number
  titulo: string
  plataformas: Plataforma[]
  genero: string
  preco: number
  precoAntigo?: number
  nota: number
  cores: [string, string]
  icone: string
  novo?: boolean
}

export const JOGOS: Jogo[] = [
  { id: 1, titulo: 'Nebula Drift', plataformas: ['PS5', 'PC'], genero: 'Corrida', preco: 249.9, precoAntigo: 299.9, nota: 4.7, cores: ['#ff3d71', '#7b2ff7'], icone: '🏎️', novo: true },
  { id: 2, titulo: 'Crônicas de Aldoria', plataformas: ['PS5', 'Xbox', 'PC'], genero: 'RPG', preco: 299.9, nota: 4.9, cores: ['#f7b733', '#fc4a1a'], icone: '🐉' },
  { id: 3, titulo: 'Esquadrão Ômega', plataformas: ['Xbox', 'PC'], genero: 'Tiro', preco: 179.9, precoAntigo: 259.9, nota: 4.3, cores: ['#11998e', '#0f3443'], icone: '🎯' },
  { id: 4, titulo: 'Pixel Pals', plataformas: ['Switch'], genero: 'Aventura', preco: 199.9, nota: 4.8, cores: ['#56ccf2', '#2f80ed'], icone: '🐾', novo: true },
  { id: 5, titulo: 'Liga Galáctica 26', plataformas: ['PS5', 'Xbox', 'Switch', 'PC'], genero: 'Esporte', preco: 329.9, nota: 4.1, cores: ['#00b09b', '#96c93d'], icone: '⚽' },
  { id: 6, titulo: 'Sombras de Kairo', plataformas: ['PS5'], genero: 'Terror', preco: 149.9, precoAntigo: 229.9, nota: 4.6, cores: ['#434343', '#8e0e00'], icone: '👁️' },
  { id: 7, titulo: 'Mecha Forge', plataformas: ['PC'], genero: 'Estratégia', preco: 119.9, nota: 4.4, cores: ['#8e9eab', '#2c3e50'], icone: '🤖' },
  { id: 8, titulo: 'Ilha dos Ventos', plataformas: ['Switch', 'PC'], genero: 'Aventura', preco: 99.9, precoAntigo: 139.9, nota: 4.5, cores: ['#a8e063', '#56ab2f'], icone: '🏝️' },
  { id: 9, titulo: 'Ringue Supremo', plataformas: ['PS5', 'Xbox'], genero: 'Luta', preco: 219.9, nota: 4.2, cores: ['#ee0979', '#ff6a00'], icone: '🥊', novo: true },
  { id: 10, titulo: 'Astro Colônia', plataformas: ['PC', 'Xbox'], genero: 'Estratégia', preco: 159.9, nota: 4.6, cores: ['#1a2a6c', '#b21f1f'], icone: '🚀' },
  { id: 11, titulo: 'Turbo Kart Mania', plataformas: ['Switch'], genero: 'Corrida', preco: 279.9, nota: 4.8, cores: ['#f12711', '#f5af19'], icone: '🏁' },
  { id: 12, titulo: 'Lâmina Eterna', plataformas: ['PS5', 'PC'], genero: 'RPG', preco: 269.9, precoAntigo: 349.9, nota: 4.7, cores: ['#614385', '#516395'], icone: '⚔️' },
]

export const PLATAFORMAS: ('Todas' | Plataforma)[] = ['Todas', 'PS5', 'Xbox', 'Switch', 'PC']
export const GENEROS = ['Todos', ...Array.from(new Set(JOGOS.map((j) => j.genero))).sort()]
