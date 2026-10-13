import { afterEach, describe, expect, it, vi } from 'vitest'
import { useExtrato } from '../useExtrato'
import { listarTransferencias } from '../extrato.api'
import { transferenciasDeExemplo } from './fixtures'

vi.mock('../extrato.api', () => ({ listarTransferencias: vi.fn() }))

afterEach(() => {
  vi.resetAllMocks()
})

describe('useExtrato', () => {
  it('ordena do agendamento mais recente para o mais antigo', async () => {
    vi.mocked(listarTransferencias).mockResolvedValue(transferenciasDeExemplo)
    const { transferencias, quantidade, carregar } = useExtrato()
    await carregar()
    expect(transferencias.value.map((t) => t.id)).toEqual([2, 1])
    expect(quantidade.value).toBe('2 agendamentos')
  })

  it('usa o singular para um agendamento', async () => {
    vi.mocked(listarTransferencias).mockResolvedValue([transferenciasDeExemplo[0]!])
    const { quantidade, carregar } = useExtrato()
    await carregar()
    expect(quantidade.value).toBe('1 agendamento')
  })

  it('guarda a mensagem de erro da API', async () => {
    vi.mocked(listarTransferencias).mockRejectedValue(new Error('Erro: sem conexão'))
    const { erro, carregando, carregar } = useExtrato()
    await carregar()
    expect(erro.value).toBe('Erro: sem conexão')
    expect(carregando.value).toBe(false)
  })
})
