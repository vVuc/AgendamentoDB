import type { Transferencia } from '@/shared/types/transferencia'

export const transferenciasDeExemplo: Transferencia[] = [
  {
    id: 1,
    contaOrigem: '0001234567',
    contaDestino: '5550001112',
    valor: 250,
    taxa: 12,
    total: 262,
    dataTransferencia: '2026-10-15',
    dataAgendamento: '2026-10-11',
  },
  {
    id: 2,
    contaOrigem: '0001234567',
    contaDestino: '9876543210',
    valor: 1000,
    taxa: 82,
    total: 1082,
    dataTransferencia: '2026-10-27',
    dataAgendamento: '2026-10-12',
  },
]
