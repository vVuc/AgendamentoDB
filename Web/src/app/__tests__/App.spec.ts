import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from '../App.vue'
import { getJson } from '@/shared/api/http'
import { redefinirFaixasTaxa } from '@/shared/domain/useFaixasTaxa'

vi.mock('@/shared/api/http', async (original) => ({
  ...(await original<typeof import('@/shared/api/http')>()),
  getJson: vi.fn().mockResolvedValue([]),
}))

afterEach(() => {
  redefinirFaixasTaxa()
})

describe('App', () => {
  it('abre o extrato pela aba e pelo botão "Ver extrato"', async () => {
    window.scrollTo = vi.fn()
    const wrapper = mount(App)
    await flushPromises()
    expect(wrapper.findAll('[role="tab"]').map((aba) => aba.text())).toEqual([
      'Início',
      'Agendar',
      'Extrato',
    ])

    const verExtrato = wrapper.findAll('button').find((b) => b.text() === 'Ver extrato')!
    await verExtrato.trigger('click')
    await flushPromises()
    expect(wrapper.find('h2').text()).toBe('Extrato de agendamentos')
    expect(getJson).toHaveBeenCalledWith('/api/transferencias')
  })
})
