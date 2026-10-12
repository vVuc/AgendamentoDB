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
  dataAgendamento: string
}
