export class ErroApi extends Error {
  constructor(
    message: string,
    readonly status: number,
    // Erros por campo, enviados pelo back-end só no 400 de validação.
    readonly campos: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ErroApi'
  }
}

const MENSAGEM_SEM_CONEXAO =
  'Erro: não foi possível falar com o servidor. Tente de novo em instantes.'
const MENSAGEM_PADRAO = 'Erro: o servidor não conseguiu concluir o pedido. Tente de novo.'

function comPrefixo(texto: string): string {
  return texto.startsWith('Erro:') ? texto : `Erro: ${texto}`
}

async function lerErro(resposta: Response): Promise<ErroApi> {
  let mensagem = MENSAGEM_PADRAO
  const campos: Record<string, string> = {}
  try {
    const corpo: unknown = await resposta.json()
    if (corpo && typeof corpo === 'object') {
      const lido = corpo as { mensagem?: unknown; message?: unknown; campos?: unknown }
      const texto = typeof lido.mensagem === 'string' ? lido.mensagem : lido.message
      if (typeof texto === 'string' && texto) mensagem = comPrefixo(texto)
      if (lido.campos && typeof lido.campos === 'object') {
        for (const [campo, erro] of Object.entries(lido.campos)) {
          if (typeof erro === 'string') campos[campo] = comPrefixo(erro)
        }
      }
    }
  } catch {
    // Corpo vazio ou fora de JSON: cai na mensagem padrão.
  }
  return new ErroApi(mensagem, resposta.status, campos)
}

async function requisitar<T>(caminho: string, init: RequestInit): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(caminho, {
      ...init,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
  } catch {
    throw new ErroApi(MENSAGEM_SEM_CONEXAO, 0)
  }
  if (!resposta.ok) throw await lerErro(resposta)
  return (await resposta.json()) as T
}

export function getJson<T>(caminho: string, parametros: Record<string, string> = {}): Promise<T> {
  const busca = new URLSearchParams(parametros).toString()
  return requisitar<T>(busca ? `${caminho}?${busca}` : caminho, { method: 'GET' })
}

export function postJson<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisitar<T>(caminho, { method: 'POST', body: JSON.stringify(corpo) })
}
