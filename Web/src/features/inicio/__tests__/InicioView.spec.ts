import { afterEach, describe, it, expect, vi } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import InicioView from '../InicioView.vue'
import { getJson } from '@/shared/api/http'
import { faixasDeExemplo } from '@/shared/domain/__tests__/fixtures'
import { redefinirFaixasTaxa } from '@/shared/domain/useFaixasTaxa'

vi.mock('@/shared/api/http', async (original) => ({
  ...(await original<typeof import('@/shared/api/http')>()),
  getJson: vi.fn(),
}))

afterEach(() => {
  redefinirFaixasTaxa()
  vi.resetAllMocks()
})

describe('InicioView', () => {
  it('mostra a tabela de taxas que veio do back-end', async () => {
    vi.mocked(getJson).mockResolvedValue(faixasDeExemplo)
    const wrapper = mount(InicioView)
    await flushPromises()
    expect(getJson).toHaveBeenCalledWith('/api/taxas')
    expect(wrapper.findAll('tbody tr')).toHaveLength(6)
  })

  it('mostra os três passos de como funciona', () => {
    vi.mocked(getJson).mockResolvedValue(faixasDeExemplo)
    const wrapper = mount(InicioView)
    const titulos = wrapper.findAll('.at-step__title').map((titulo) => titulo.text())
    expect(titulos).toEqual(['Preencha os dados', 'Confira a taxa', 'Acompanhe no extrato'])
  })

  it('emite "agendar" e "extrato" pelos botões do hero', async () => {
    vi.mocked(getJson).mockResolvedValue(faixasDeExemplo)
    const wrapper = mount(InicioView)
    const [agendar, extrato] = wrapper.findAll('.at-hero__actions button')
    await agendar!.trigger('click')
    await extrato!.trigger('click')
    expect(wrapper.emitted('agendar')).toHaveLength(1)
    expect(wrapper.emitted('extrato')).toHaveLength(1)
  })
})
