import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import AgendarView from '../AgendarView.vue'
import { agendarTransferencia } from '../agendamento.api'
import { getJson } from '@/shared/api/http'
import { faixasDeExemplo } from '@/shared/domain/__tests__/fixtures'
import { redefinirFaixasTaxa } from '@/shared/domain/useFaixasTaxa'

vi.mock('../agendamento.api', () => ({ agendarTransferencia: vi.fn() }))
vi.mock('@/shared/api/http', async (original) => ({
  ...(await original<typeof import('@/shared/api/http')>()),
  getJson: vi.fn(),
}))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 12, 10))
  vi.mocked(getJson).mockResolvedValue(faixasDeExemplo)
})

afterEach(() => {
  vi.useRealTimers()
  vi.resetAllMocks()
  redefinirFaixasTaxa()
})

async function montar() {
  const wrapper = mount(AgendarView)
  await flushPromises()
  return wrapper
}

async function preencher(wrapper: ReturnType<typeof mount>, data: string) {
  const inputs = wrapper.findAll('input')
  await inputs[0]!.setValue('1234567890')
  await inputs[1]!.setValue('0987654321')
  await inputs[2]!.setValue('1000')
  await inputs[3]!.setValue(data)
}

describe('AgendarView', () => {
  it('mostra a data de agendamento de hoje e o limite da tabela', async () => {
    const wrapper = await montar()
    const inputs = wrapper.findAll('input')
    expect((inputs[4]!.element as HTMLInputElement).value).toBe('12/10/2026')
    expect(inputs[3]!.attributes('max')).toBe('2026-12-01')
    expect(wrapper.text()).toContain('Até 50 dias a partir de hoje')
  })

  it('mostra o resumo da taxa e libera o envio', async () => {
    const wrapper = await montar()
    await preencher(wrapper, '2026-10-12')
    expect(wrapper.find('.at-fee__badge').text()).toBe('Mesmo dia')
    expect(wrapper.find('.at-fee__total').text()).toMatch(/R\$\s1\.028,00/)
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('mostra erro e bloqueia quando não há taxa para a data', async () => {
    const wrapper = await montar()
    await preencher(wrapper, '2026-12-10')
    expect(wrapper.find('[role="alert"]').text()).toContain('Erro: não há taxa aplicável')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('avisa quando não consegue carregar a tabela de taxas', async () => {
    vi.mocked(getJson).mockRejectedValueOnce(new Error('Erro: sem conexão'))
    const wrapper = await montar()
    expect(wrapper.find('[role="alert"]').text()).toContain('Erro: sem conexão')
    await wrapper.find('.agendar__repetir').trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
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
    const wrapper = await montar()
    await preencher(wrapper, '2026-10-12')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const status = wrapper.find('.at-alert--success').text()
    expect(status).toContain('Transferência agendada')
    expect(status).toContain('conta 0987654321')
  })
})
