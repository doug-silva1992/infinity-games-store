export const SENHA_MINIMA = 6
export const emailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

// Simula a latência da API enquanto o backend não tem autenticação
export const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))
