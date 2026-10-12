import { getJson, postJson } from '@/shared/api/http'
import type { NovaTransferencia, PreviaTaxa, Transferencia } from '@/shared/types/transferencia'

export function agendarTransferencia(transferencia: NovaTransferencia): Promise<Transferencia> {
  return postJson<Transferencia>('/api/transferencias', transferencia)
}

export function consultarTaxa(valor: number, data: string): Promise<PreviaTaxa> {
  return getJson<PreviaTaxa>('/api/transferencias/taxa', { valor: valor.toFixed(2), data })
}
