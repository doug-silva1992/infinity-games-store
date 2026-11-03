import { useState, type FormEvent } from 'react'
import { useStore } from '../store/useStore'
import { postar, type Usuario } from '../utils/api'
import { SENHA_MINIMA, emailValido } from '../utils/validacao'
import AuthPage, { Sucesso } from './AuthPage'
import { Campo, Enviar, Marcar } from './Form'

type Erros = { email?: string; senha?: string; geral?: string }

// Tela de login: confere a conta em POST /api/auth/login e guarda o jogador no store
function Entrar() {
  const { usuario, entrar } = useStore()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(true)
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [pronto, setPronto] = useState(false)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    const novos: Erros = {}
    if (!emailValido(email)) novos.email = 'Informe um e-mail válido.'
    if (senha.length < SENHA_MINIMA) novos.senha = `A senha tem pelo menos ${SENHA_MINIMA} caracteres.`
    setErros(novos)
    if (Object.keys(novos).length > 0) return

    setEnviando(true)
    try {
      entrar(await postar<Usuario>('/api/auth/login', { email, senha }), lembrar)
      setPronto(true)
    } catch (erro) {
      setErros({ geral: erro instanceof Error ? erro.message : 'Algo deu errado. Tente novamente.' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthPage
      kicker="Bem-vindo de volta"
      titulo="Entrar na sua conta"
      sub="Continue de onde parou: biblioteca, conquistas e lista de desejos."
      rodape={
        <>
          Ainda não tem conta? <a href="#registrar">Registre-se</a>
        </>
      }
    >
      {pronto ? (
        <Sucesso titulo="Login realizado!" texto={`Bom te ver de novo, ${usuario?.gamertag}.`} />
      ) : (
        <form className="auth-form" onSubmit={enviar} noValidate>
          <Campo
            rotulo="E-mail"
            icone="mail"
            tipo="email"
            valor={email}
            aoMudar={setEmail}
            erro={erros.email}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            autoFocus
          />
          <Campo
            rotulo="Senha"
            icone="lock"
            tipo="password"
            valor={senha}
            aoMudar={setSenha}
            erro={erros.senha}
            placeholder="Sua senha"
            autoComplete="current-password"
          />
          <Marcar marcado={lembrar} aoMudar={setLembrar}>
            Lembrar de mim neste dispositivo
          </Marcar>
          {erros.geral && (
            <small className="form-error" role="alert">
              {erros.geral}
            </small>
          )}
          <Enviar enviando={enviando} rotulo="Entrar" carregando="Entrando..." />
        </form>
      )}
    </AuthPage>
  )
}

export default Entrar
