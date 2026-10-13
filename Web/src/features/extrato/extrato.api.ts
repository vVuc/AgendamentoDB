import { getJson } from '@/shared/api/http'
import type { Transferencia } from '@/shared/types/transferencia'

export function listarTransferencias(): Promise<Transferencia[]> {
  return getJson<Transferencia[]>('/api/transferencias')
}
