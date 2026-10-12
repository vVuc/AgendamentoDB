import { postJson } from '@/shared/api/http'
import type { NovaTransferencia, Transferencia } from '@/shared/types/transferencia'

export function agendarTransferencia(transferencia: NovaTransferencia): Promise<Transferencia> {
  return postJson<Transferencia>('/api/transferencias', transferencia)
}
