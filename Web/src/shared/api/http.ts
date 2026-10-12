export class ErroApi extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ErroApi'
  }
}

const MENSAGEM_SEM_CONEXAO =
  'Erro: não foi possível falar com o servidor. Tente de novo em instantes.'
const MENSAGEM_PADRAO = 'Erro: o servidor não conseguiu concluir o pedido. Tente de novo.'

async function lerMensagem(resposta: Response): Promise<string> {
  try {
    const corpo: unknown = await resposta.json()
    if (corpo && typeof corpo === 'object') {
      const { mensagem, message } = corpo as { mensagem?: unknown; message?: unknown }
      const texto = typeof mensagem === 'string' ? mensagem : message
      if (typeof texto === 'string' && texto) {
        return texto.startsWith('Erro:') ? texto : `Erro: ${texto}`
      }
    }
  } catch {
    // Corpo vazio ou fora de JSON: cai na mensagem padrão.
  }
  return MENSAGEM_PADRAO
}

export async function postJson<T>(caminho: string, corpo: unknown): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(caminho, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(corpo),
    })
  } catch {
    throw new ErroApi(MENSAGEM_SEM_CONEXAO, 0)
  }
  if (!resposta.ok) throw new ErroApi(await lerMensagem(resposta), resposta.status)
  return (await resposta.json()) as T
}
