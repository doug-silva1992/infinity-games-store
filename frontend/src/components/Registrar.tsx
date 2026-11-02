import { useState, type FormEvent } from 'react'
import { SENHA_MINIMA, emailValido, esperar } from '../utils/validacao'
import AuthPage, { Sucesso } from './AuthPage'
import { Campo, Enviar, Marcar } from './Form'

type Erros = { gamertag?: string; email?: string; senha?: string; confirmacao?: string; termos?: string }

// Tela de cadastro (substituir o envio por POST /api/auth/registrar quando houver autenticação)
function Registrar() {
  const [gamertag, setGamertag] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [termos, setTermos] = useState(false)
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [pronto, setPronto] = useState(false)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    const novos: Erros = {}
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(gamertag)) novos.gamertag = 'De 3 a 16 caracteres: letras, números ou _.'
    if (!emailValido(email)) novos.email = 'Informe um e-mail válido.'
    if (senha.length < SENHA_MINIMA) novos.senha = `Use pelo menos ${SENHA_MINIMA} caracteres.`
    if (confirmacao !== senha) novos.confirmacao = 'As senhas não coincidem.'
    if (!termos) novos.termos = 'Aceite os termos para criar a conta.'
    setErros(novos)
    if (Object.keys(novos).length > 0) return

    setEnviando(true)
    await esperar(1100)
    setEnviando(false)
    setPronto(true)
  }

  return (
    <AuthPage
      kicker="Comece sua jornada"
      titulo="Criar sua conta"
      sub="Ganhe XP a cada compra, desbloqueie conquistas e suba no ranking da comunidade."
      rodape={
        <>
          Já tem conta? <a href="#entrar">Entrar</a>
        </>
      }
    >
      {pronto ? (
        <Sucesso titulo="Conta criada!" texto={`Bem-vindo à Infinity Games, ${gamertag}. O Ignis já está te esperando.`} />
      ) : (
        <form className="auth-form" onSubmit={enviar} noValidate>
          <Campo
            rotulo="Gamertag"
            icone="gamepad"
            valor={gamertag}
            aoMudar={setGamertag}
            erro={erros.gamertag}
            placeholder="Como a comunidade vai te ver"
            autoComplete="username"
            autoFocus
          />
          <Campo
            rotulo="E-mail"
            icone="mail"
            tipo="email"
            valor={email}
            aoMudar={setEmail}
            erro={erros.email}
            placeholder="voce@exemplo.com"
            autoComplete="email"
          />
          <div className="auth-pair">
            <Campo
              rotulo="Senha"
              icone="lock"
              tipo="password"
              valor={senha}
              aoMudar={setSenha}
              erro={erros.senha}
              placeholder={`Mín. ${SENHA_MINIMA} caracteres`}
              autoComplete="new-password"
            />
            <Campo
              rotulo="Confirmar senha"
              icone="lock"
              tipo="password"
              valor={confirmacao}
              aoMudar={setConfirmacao}
              erro={erros.confirmacao}
              placeholder="Repita a senha"
              autoComplete="new-password"
            />
          </div>
          <div>
            <Marcar marcado={termos} aoMudar={setTermos}>
              Li e aceito os termos de uso e a política de privacidade
            </Marcar>
            {erros.termos && <small className="form-error">{erros.termos}</small>}
          </div>
          <Enviar enviando={enviando} rotulo="Criar conta" carregando="Criando conta..." />
        </form>
      )}
    </AuthPage>
  )
}

export default Registrar
