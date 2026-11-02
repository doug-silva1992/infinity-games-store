import { useState, type FormEvent } from 'react'
import { SENHA_MINIMA, emailValido, esperar } from '../utils/validacao'
import AuthPage, { Sucesso } from './AuthPage'
import { Campo, Enviar, Marcar } from './Form'

type Erros = { email?: string; senha?: string }

// Tela de login (substituir o envio por POST /api/auth/login quando houver autenticação)
function Entrar() {
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
    await esperar(900)
    setEnviando(false)
    setPronto(true)
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
        <Sucesso titulo="Login realizado!" texto={`Bom te ver de novo, ${email.trim()}.`} />
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
          <Enviar enviando={enviando} rotulo="Entrar" carregando="Entrando..." />
        </form>
      )}
    </AuthPage>
  )
}

export default Entrar
