import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErroApi, postJson } from '../http'

function responder(status: number, corpo?: unknown) {
  const resposta = new Response(corpo === undefined ? null : JSON.stringify(corpo), { status })
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('postJson', () => {
  it('envia o corpo em JSON e devolve a resposta', async () => {
    responder(201, { id: 1 })
    await expect(postJson('/api/teste', { a: 1 })).resolves.toEqual({ id: 1 })
    expect(fetch).toHaveBeenCalledWith(
      '/api/teste',
      expect.objectContaining({ method: 'POST', body: '{"a":1}' }),
    )
  })

  it('usa a mensagem do servidor com o prefixo "Erro:"', async () => {
    responder(422, { mensagem: 'não há taxa aplicável' })
    await expect(postJson('/api/teste', {})).rejects.toEqual(
      new ErroApi('Erro: não há taxa aplicável', 422),
    )
  })

  it('aceita o campo "message" e não repete o prefixo', async () => {
    responder(400, { message: 'Erro: conta inválida' })
    await expect(postJson('/api/teste', {})).rejects.toThrow('Erro: conta inválida')
  })

  it('cai na mensagem padrão quando o corpo não é JSON', async () => {
    responder(500)
    await expect(postJson('/api/teste', {})).rejects.toThrow(
      'Erro: o servidor não conseguiu concluir o pedido. Tente de novo.',
    )
  })

  it('avisa quando não consegue falar com o servidor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const erro = await postJson('/api/teste', {}).catch((e: unknown) => e)
    expect(erro).toBeInstanceOf(ErroApi)
    expect((erro as ErroApi).status).toBe(0)
  })
})
