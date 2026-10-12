import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import AgendarView from '../AgendarView.vue'
import { agendarTransferencia, consultarTaxa } from '../agendamento.api'
import { ESPERA_DA_PREVIA_MS } from '../useAgendamento'
import { ErroApi } from '@/shared/api/http'

vi.mock('../agendamento.api', () => ({ agendarTransferencia: vi.fn(), consultarTaxa: vi.fn() }))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] })
  vi.setSystemTime(new Date(2026, 9, 12, 10))
  vi.mocked(consultarTaxa).mockResolvedValue({
    dias: 0,
    rotulo: 'Mesmo dia',
    taxaFixa: 3,
    percentual: 2.5,
    taxa: 28,
    total: 1028,
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.resetAllMocks()
})

async function preencher(wrapper: ReturnType<typeof mount>, data: string) {
  const inputs = wrapper.findAll('input')
  await inputs[0]!.setValue('1234567890')
  await inputs[1]!.setValue('0987654321')
  await inputs[2]!.setValue('1000')
  await inputs[3]!.setValue(data)
  await vi.advanceTimersByTimeAsync(ESPERA_DA_PREVIA_MS)
  await flushPromises()
}

describe('AgendarView', () => {
  it('mostra a data de agendamento de hoje', () => {
    const wrapper = mount(AgendarView)
    const agendamento = wrapper.findAll('input')[4]!
    expect((agendamento.element as HTMLInputElement).value).toBe('12/10/2026')
  })

  it('mostra o resumo da taxa vindo do servidor e libera o envio', async () => {
    const wrapper = mount(AgendarView)
    await preencher(wrapper, '2026-10-12')
    expect(wrapper.find('.at-fee__badge').text()).toBe('Mesmo dia')
    expect(wrapper.find('.at-fee__total').text()).toMatch(/R\$\s1\.028,00/)
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('mostra erro e bloqueia quando não há taxa para a data', async () => {
    vi.mocked(consultarTaxa).mockRejectedValue(
      new ErroApi('Erro: não há taxa aplicável para a data informada.', 422),
    )
    const wrapper = mount(AgendarView)
    await preencher(wrapper, '2026-12-10')
    const alerta = wrapper.find('[role="alert"]').text()
    expect(alerta).toContain('Erro: não há taxa aplicável')
    expect(alerta).toContain('até 50 dias')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('confirma o agendamento depois do envio', async () => {
    vi.mocked(agendarTransferencia).mockResolvedValue({
      id: 1,
      contaOrigem: '1234567890',
      contaDestino: '0987654321',
      valor: 1000,
      dataTransferencia: '2026-10-12',
      dataAgendamento: '2026-10-12',
      taxa: 28,
      total: 1028,
    })
    const wrapper = mount(AgendarView)
    await preencher(wrapper, '2026-10-12')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const status = wrapper.find('.at-alert--success').text()
    expect(status).toContain('Transferência agendada')
    expect(status).toContain('conta 0987654321')
  })
})
