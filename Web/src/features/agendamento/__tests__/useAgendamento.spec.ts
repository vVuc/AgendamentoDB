import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apenasDigitosDaConta, useAgendamento } from '../useAgendamento'
import { agendarTransferencia } from '../agendamento.api'
import { ErroApi } from '@/shared/api/http'

vi.mock('../agendamento.api', () => ({ agendarTransferencia: vi.fn() }))

const agendarMock = vi.mocked(agendarTransferencia)

function preencher(agendamento: ReturnType<typeof useAgendamento>, dataTransferencia: string) {
  Object.assign(agendamento.formulario, {
    contaOrigem: '1234567890',
    contaDestino: '0987654321',
    valor: 1000,
    dataTransferencia,
  })
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 12, 10))
})

afterEach(() => {
  vi.useRealTimers()
  agendarMock.mockReset()
})

describe('apenasDigitosDaConta', () => {
  it('remove o que não é número e corta em 10 dígitos', () => {
    expect(apenasDigitosDaConta('12a34-567890123')).toBe('1234567890')
  })
})

describe('useAgendamento', () => {
  it('limita a data entre hoje e 50 dias', () => {
    const { hoje, dataMaxima } = useAgendamento()
    expect(hoje).toBe('2026-10-12')
    expect(dataMaxima).toBe('2026-12-01')
  })

  it('calcula a taxa da faixa de 11 a 20 dias', () => {
    const agendamento = useAgendamento()
    preencher(agendamento, '2026-10-27')
    expect(agendamento.faixa.value?.percentual).toBe(8.2)
    expect(agendamento.taxa.value).toBe(82)
    expect(agendamento.total.value).toBe(1082)
    expect(agendamento.podeAgendar.value).toBe(true)
  })

  it('bloqueia datas fora das faixas', () => {
    const agendamento = useAgendamento()
    preencher(agendamento, '2026-12-02')
    expect(agendamento.semTaxaAplicavel.value).toBe(true)
    expect(agendamento.podeAgendar.value).toBe(false)
  })

  it('só mostra erro de campo depois do blur', () => {
    const agendamento = useAgendamento()
    agendamento.formulario.contaOrigem = '123'
    expect(agendamento.erros.value.contaOrigem).toBe('')
    agendamento.tocar('contaOrigem')
    expect(agendamento.erros.value.contaOrigem).toBe('Erro: a conta deve ter 10 dígitos')
  })

  it('não aceita origem e destino iguais', () => {
    const agendamento = useAgendamento()
    preencher(agendamento, '2026-10-12')
    agendamento.formulario.contaDestino = '1234567890'
    expect(agendamento.erros.value.contaDestino).toBe(
      'Erro: a conta de destino deve ser diferente da origem',
    )
    expect(agendamento.podeAgendar.value).toBe(false)
  })

  it('agenda e limpa destino e valor, mantendo origem e data', async () => {
    const agendamento = useAgendamento()
    preencher(agendamento, '2026-10-12')
    agendarMock.mockResolvedValue({
      ...agendamento.formulario,
      id: 1,
      taxa: 28,
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

  it('mostra a mensagem de erro da API', async () => {
    const agendamento = useAgendamento()
    preencher(agendamento, '2026-10-12')
    agendarMock.mockRejectedValue(new ErroApi('Erro: conta bloqueada', 422))
    await agendamento.agendar()
    expect(agendamento.erroServidor.value).toBe('Erro: conta bloqueada')
    expect(agendamento.enviando.value).toBe(false)
  })
})
