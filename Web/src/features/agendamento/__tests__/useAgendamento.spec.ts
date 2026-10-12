import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { effectScope } from 'vue'
import { apenasDigitosDaConta, ESPERA_DA_PREVIA_MS, useAgendamento } from '../useAgendamento'
import { agendarTransferencia, consultarTaxa } from '../agendamento.api'
import { ErroApi } from '@/shared/api/http'
import type { PreviaTaxa } from '@/shared/types/transferencia'

vi.mock('../agendamento.api', () => ({ agendarTransferencia: vi.fn(), consultarTaxa: vi.fn() }))

const agendarMock = vi.mocked(agendarTransferencia)
const consultarMock = vi.mocked(consultarTaxa)

const previaMesmoDia: PreviaTaxa = {
  dias: 0,
  rotulo: 'Mesmo dia',
  taxaFixa: 3,
  percentual: 2.5,
  taxa: 28,
  total: 1028,
}

const escopo = effectScope()

function criar() {
  return escopo.run(() => useAgendamento())!
}

async function preencher(
  agendamento: ReturnType<typeof useAgendamento>,
  dataTransferencia: string,
) {
  Object.assign(agendamento.formulario, {
    contaOrigem: '1234567890',
    contaDestino: '0987654321',
    valor: 1000,
    dataTransferencia,
  })
  await vi.advanceTimersByTimeAsync(ESPERA_DA_PREVIA_MS)
  await flushPromises()
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] })
  vi.setSystemTime(new Date(2026, 9, 12, 10))
  consultarMock.mockResolvedValue(previaMesmoDia)
})

afterEach(() => {
  vi.useRealTimers()
  vi.resetAllMocks()
})

describe('apenasDigitosDaConta', () => {
  it('remove o que não é número e corta em 10 dígitos', () => {
    expect(apenasDigitosDaConta('12a34-567890123')).toBe('1234567890')
  })
})

describe('useAgendamento', () => {
  it('limita a data entre hoje e 50 dias', () => {
    const { hoje, dataMaxima } = criar()
    expect(hoje).toBe('2026-10-12')
    expect(dataMaxima).toBe('2026-12-01')
  })

  it('pede a prévia da taxa ao servidor uma vez, depois da pausa', async () => {
    const agendamento = criar()
    agendamento.formulario.dataTransferencia = '2026-10-12'
    agendamento.formulario.valor = 1
    await vi.advanceTimersByTimeAsync(100)
    agendamento.formulario.valor = 1000
    expect(agendamento.consultandoTaxa.value).toBe(true)
    await vi.advanceTimersByTimeAsync(ESPERA_DA_PREVIA_MS)
    await flushPromises()
    expect(consultarMock).toHaveBeenCalledTimes(1)
    expect(consultarMock).toHaveBeenCalledWith(1000, '2026-10-12')
    expect(agendamento.previa.value).toEqual(previaMesmoDia)
    expect(agendamento.consultandoTaxa.value).toBe(false)
  })

  it('não pede a prévia sem valor', async () => {
    const agendamento = criar()
    agendamento.formulario.dataTransferencia = '2026-10-12'
    await vi.advanceTimersByTimeAsync(ESPERA_DA_PREVIA_MS)
    expect(consultarMock).not.toHaveBeenCalled()
  })

  it('libera o envio só com a prévia em mãos', async () => {
    const agendamento = criar()
    await preencher(agendamento, '2026-10-12')
    expect(agendamento.podeAgendar.value).toBe(true)
  })

  it('bloqueia quando o servidor diz que não há taxa', async () => {
    consultarMock.mockRejectedValue(new ErroApi('Erro: não há taxa aplicável', 422))
    const agendamento = criar()
    await preencher(agendamento, '2026-12-02')
    expect(agendamento.erroPrevia.value).toBe('Erro: não há taxa aplicável')
    expect(agendamento.semTaxaAplicavel.value).toBe(true)
    expect(agendamento.podeAgendar.value).toBe(false)
  })

  it('só mostra erro de campo depois do blur', () => {
    const agendamento = criar()
    agendamento.formulario.contaOrigem = '123'
    expect(agendamento.erros.value.contaOrigem).toBe('')
    agendamento.tocar('contaOrigem')
    expect(agendamento.erros.value.contaOrigem).toBe('Erro: a conta deve ter 10 dígitos')
  })

  it('não aceita origem e destino iguais', async () => {
    const agendamento = criar()
    await preencher(agendamento, '2026-10-12')
    agendamento.formulario.contaDestino = '1234567890'
    expect(agendamento.erros.value.contaDestino).toBe(
      'Erro: a conta de destino deve ser diferente da origem',
    )
    expect(agendamento.podeAgendar.value).toBe(false)
  })

  it('agenda e limpa destino e valor, mantendo origem e data', async () => {
    const agendamento = criar()
    await preencher(agendamento, '2026-10-12')
    agendarMock.mockResolvedValue({
      ...agendamento.formulario,
      id: 1,
      taxa: 28,
      total: 1028,
      dataAgendamento: '2026-10-12',
    })
    await agendamento.agendar()
    expect(agendarMock).toHaveBeenCalledWith({
      contaOrigem: '1234567890',
      contaDestino: '0987654321',
      valor: 1000,
      dataTransferencia: '2026-10-12',
    })
    expect(agendamento.agendada.value?.taxa).toBe(28)
    expect(agendamento.formulario).toMatchObject({
      contaOrigem: '1234567890',
      contaDestino: '',
      valor: 0,
      dataTransferencia: '2026-10-12',
    })
  })

  it('mostra a mensagem de erro da API ao agendar', async () => {
    const agendamento = criar()
    await preencher(agendamento, '2026-10-12')
    agendarMock.mockRejectedValue(new ErroApi('Erro: conta bloqueada', 422))
    await agendamento.agendar()
    expect(agendamento.erroServidor.value).toBe('Erro: conta bloqueada')
    expect(agendamento.enviando.value).toBe(false)
  })

  it('marca nos campos os erros de validação do servidor', async () => {
    const agendamento = criar()
    await preencher(agendamento, '2026-10-12')
    agendarMock.mockRejectedValue(
      new ErroApi('Erro: dados inválidos', 400, { contaDestino: 'Erro: conta inexistente' }),
    )
    await agendamento.agendar()
    expect(agendamento.erros.value.contaDestino).toBe('Erro: conta inexistente')
    agendamento.aoEditar()
    expect(agendamento.erros.value.contaDestino).toBe('')
  })
})
