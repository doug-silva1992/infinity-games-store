// Conta devolvida pelo backend em /api/auth/registrar e /api/auth/login (sem a senha)
export type Usuario = {
  id: string
  gamertag: string
  email: string
  titulo: string
  xp: number
  horasJogadas: number
  criadoEm: string
}

export class ErroApi extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export type Metodo = 'cartao' | 'pix' | 'boleto'

// Pedido salvo pelo Checkout e listado na tela Minha conta
export type Pedido = {
  id: string
  numero: string
  itens: { jogoId: number; titulo: string; preco: number }[]
  total: number
  metodo: Metodo
  status: 'pago' | 'pendente'
  pagoEm: string | null
  criadoEm: string
}

// Requisição em JSON; erros do Nest chegam como { message: string | string[] }
export async function requisitar<T>(metodo: 'GET' | 'POST' | 'PATCH', caminho: string, corpo?: unknown): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(caminho, {
      method: metodo,
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    })
  } catch {
    throw new ErroApi('Não foi possível conectar ao servidor.', 0)
  }

  const dados = await resposta.json().catch(() => null)
  if (!resposta.ok) {
    const mensagem = [dados?.message].flat()[0]
    throw new ErroApi(typeof mensagem === 'string' ? mensagem : 'Algo deu errado. Tente novamente.', resposta.status)
  }
  return dados as T
}

export const buscar = <T>(caminho: string) => requisitar<T>('GET', caminho)
export const postar = <T>(caminho: string, corpo: unknown) => requisitar<T>('POST', caminho, corpo)
export const alterar = <T>(caminho: string, corpo: unknown) => requisitar<T>('PATCH', caminho, corpo)
