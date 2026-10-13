import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ExtratoView from '../ExtratoView.vue'
import { listarTransferencias } from '../extrato.api'
import { transferenciasDeExemplo } from './fixtures'

vi.mock('../extrato.api', () => ({ listarTransferencias: vi.fn() }))

afterEach(() => {
  vi.resetAllMocks()
})

describe('ExtratoView', () => {
  it('carrega o extrato ao abrir a aba', async () => {
    vi.mocked(listarTransferencias).mockResolvedValue(transferenciasDeExemplo)
    const wrapper = mount(ExtratoView)
    expect(wrapper.find('[role="status"]').text()).toBe('Carregando o extrato...')
    await flushPromises()
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.find('.extrato__quantidade').text()).toBe('2 agendamentos')
  })

  it('mostra o erro e deixa tentar de novo', async () => {
    vi.mocked(listarTransferencias).mockRejectedValueOnce(new Error('Erro: sem conexão'))
    const wrapper = mount(ExtratoView)
    await flushPromises()
    expect(wrapper.find('[role="alert"]').text()).toContain('Erro: sem conexão')

    vi.mocked(listarTransferencias).mockResolvedValue([])
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.find('.at-table__empty').exists()).toBe(true)
  })
})
