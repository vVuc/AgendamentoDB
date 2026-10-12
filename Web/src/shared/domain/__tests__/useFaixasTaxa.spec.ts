import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { redefinirFaixasTaxa, useFaixasTaxa } from '../useFaixasTaxa'
import { faixasDeExemplo } from './fixtures'
import { getJson } from '@/shared/api/http'

vi.mock('@/shared/api/http', async (original) => ({
  ...(await original<typeof import('@/shared/api/http')>()),
  getJson: vi.fn(),
}))

afterEach(() => {
  redefinirFaixasTaxa()
  vi.resetAllMocks()
})

describe('useFaixasTaxa', () => {
  it('pede a tabela ao back-end uma vez só', async () => {
    vi.mocked(getJson).mockResolvedValue(faixasDeExemplo)
    useFaixasTaxa()
    const { faixas } = useFaixasTaxa()
    await flushPromises()
    expect(getJson).toHaveBeenCalledTimes(1)
    expect(getJson).toHaveBeenCalledWith('/api/taxas')
    expect(faixas.value).toHaveLength(6)
  })

  it('guarda o erro e deixa tentar de novo', async () => {
    vi.mocked(getJson).mockRejectedValueOnce(new Error('Erro: servidor fora do ar'))
    const { erro, recarregar, faixas } = useFaixasTaxa()
    await flushPromises()
    expect(erro.value).toBe('Erro: servidor fora do ar')

    vi.mocked(getJson).mockResolvedValue(faixasDeExemplo)
    await recarregar()
    expect(erro.value).toBe('')
    expect(faixas.value).toHaveLength(6)
  })
})
