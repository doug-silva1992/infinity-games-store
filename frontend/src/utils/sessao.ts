import type { Usuario } from './api'

// "Lembrar de mim" guarda no localStorage; sem ele, a sessão some ao fechar a aba
const CHAVE = 'infinity:usuario'

export function lerSessao(): Usuario | null {
  try {
    const salvo = localStorage.getItem(CHAVE) ?? sessionStorage.getItem(CHAVE)
    return salvo ? (JSON.parse(salvo) as Usuario) : null
  } catch {
    return null
  }
}

// Sem "lembrar", mantém o usuário onde ele já estava (ex.: ao trocar o e-mail)
export function salvarSessao(usuario: Usuario | null, lembrar?: boolean) {
  try {
    lembrar ??= localStorage.getItem(CHAVE) !== null
    localStorage.removeItem(CHAVE)
    sessionStorage.removeItem(CHAVE)
    if (usuario) (lembrar ? localStorage : sessionStorage).setItem(CHAVE, JSON.stringify(usuario))
  } catch {
    // Armazenamento bloqueado: o login vale só enquanto a página estiver aberta
  }
}
