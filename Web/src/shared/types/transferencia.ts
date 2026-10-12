// Contrato da API de transferências. Valores em reais, datas em aaaa-mm-dd.
export interface NovaTransferencia {
  contaOrigem: string
  contaDestino: string
  valor: number
  dataTransferencia: string
}

export interface Transferencia extends NovaTransferencia {
  id: number
  taxa: number
  total: number
  dataAgendamento: string
}

// Prévia da taxa devolvida por GET /api/transferencias/taxa.
export interface PreviaTaxa {
  dias: number
  rotulo: string
  taxaFixa: number
  percentual: number
  taxa: number
  total: number
}
