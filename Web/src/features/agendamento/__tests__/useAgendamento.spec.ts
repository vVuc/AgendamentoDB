import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { VALOR_MAXIMO, apenasDigitosDaConta, useAgendamento } from '../useAgendamento'
import { agendarTransferencia } from '../agendamento.api'
import { ErroApi, getJson } from '@/shared/api/http'
import { faixasDeExemplo } from '@/shared/domain/__tests__/fixtures'
import { redefinirFaixasTaxa } from '@/shared/domain/useFaixasTaxa'

vi.mock('../agendamento.api', () => ({ agendarTransferencia: vi.fn() }))
vi.mock('@/shared/api/http', async (original) => ({
  ...(await original<typeof import('@/shared/api/http')>()),
  getJson: vi.fn(),
}))

const agendarMock = vi.mocked(agendarTransferencia)

async function criar() {
  const agendamento = useAgendamento()
  await flushPromises()
  return agendamento
}

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
  vi.mocked(getJson).mockResolvedValue(faixasDeExemplo)
})

afterEach(() => {
  vi.useRealTimers()
  vi.resetAllMocks()
  redefinirFaixasTaxa()
})

describe('apenasDigitosDaConta', () => {
  it('remove o que não é número e corta em 10 dígitos', () => {
    expect(apenasDigitosDaConta('12a34-567890123')).toBe('1234567890')
  })
})

describe('useAgendamento', () => {
  it('limita a data pelo maior prazo da tabela', async () => {
    const { hoje, limiteDias, dataMaxima } = await criar()
    expect(hoje).toBe('2026-10-12')
    expect(limiteDias.value).toBe(50)
    expect(dataMaxima.value).toBe('2026-12-01')
  })

  it('calcula a prévia com a tabela do back-end, sem chamar a API de novo', async () => {
    const agendamento = await criar()
    preencher(agendamento, '2026-10-27')
    expect(agendamento.faixa.value?.rotulo).toBe('11 a 20 dias')
    expect(agendamento.taxa.value).toBe(82)
    expect(agendamento.total.value).toBe(1082)
    agendamento.formulario.valor = 2000
    expect(agendamento.taxa.value).toBe(164)
    expect(getJson).toHaveBeenCalledTimes(1)
    expect(agendamento.podeAgendar.value).toBe(true)
  })

  it('bloqueia datas fora das faixas', async () => {
    const agendamento = await criar()
    preencher(agendamento, '2026-12-02')
    expect(agendamento.semTaxaAplicavel.value).toBe(true)
    expect(agendamento.podeAgendar.value).toBe(false)
  })

  it('não libera o envio sem a tabela de taxas', async () => {
    vi.mocked(getJson).mockRejectedValue(new ErroApi('Erro: sem conexão', 0))
    const agendamento = await criar()
    preencher(agendamento, '2026-10-12')
    expect(agendamento.erroFaixas.value).toBe('Erro: sem conexão')
    expect(agendamento.semTaxaAplicavel.value).toBe(false)
    expect(agendamento.podeAgendar.value).toBe(false)
  })

  it('só mostra erro de campo depois do blur', async () => {
    const agendamento = await criar()
    agendamento.formulario.contaOrigem = '123'
    expect(agendamento.erros.value.contaOrigem).toBe('')
    agendamento.tocar('contaOrigem')
    expect(agendamento.erros.value.contaOrigem).toBe('Erro: a conta deve ter 10 dígitos')
  })

  it('não aceita origem e destino iguais', async () => {
    const agendamento = await criar()
    preencher(agendamento, '2026-10-12')
    agendamento.formulario.contaDestino = '1234567890'
    expect(agendamento.erros.value.contaDestino).toBe(
      'Erro: a conta de destino deve ser diferente da origem',
    )
    expect(agendamento.podeAgendar.value).toBe(false)
  })

  it('aceita até o valor máximo e mostra o erro acima dele', async () => {
    const agendamento = await criar()
    preencher(agendamento, '2026-10-27')
    agendamento.formulario.valor = VALOR_MAXIMO
    expect(agendamento.erros.value.valor).toBe('')
    expect(agendamento.taxa.value).toBe(820000000000)
    expect(agendamento.podeAgendar.value).toBe(true)
    agendamento.formulario.valor = VALOR_MAXIMO + 0.01
    expect(agendamento.erros.value.valor).toBe('Erro: o valor máximo é R$ 9.999.999.999.999,99')
    expect(agendamento.podeAgendar.value).toBe(false)
  })

  it('agenda e limpa destino e valor, mantendo origem e data', async () => {
    const agendamento = await criar()
    preencher(agendamento, '2026-10-12')
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
    const agendamento = await criar()
    preencher(agendamento, '2026-10-12')
    agendarMock.mockRejectedValue(new ErroApi('Erro: conta bloqueada', 422))
    await agendamento.agendar()
    expect(agendamento.erroServidor.value).toBe('Erro: conta bloqueada')
    expect(agendamento.enviando.value).toBe(false)
  })

  it('marca nos campos os erros de validação do servidor', async () => {
    const agendamento = await criar()
    preencher(agendamento, '2026-10-12')
    agendarMock.mockRejectedValue(
      new ErroApi('Erro: dados inválidos', 400, { contaDestino: 'Erro: conta inexistente' }),
    )
    await agendamento.agendar()
    expect(agendamento.erros.value.contaDestino).toBe('Erro: conta inexistente')
    agendamento.aoEditar()
    expect(agendamento.erros.value.contaDestino).toBe('')
  })
})
