const formatoData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const formatoMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const formatoPercentual = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatarData(data: Date): string {
  return formatoData.format(data)
}

export function formatarMoeda(valor: number): string {
  return formatoMoeda.format(valor)
}

export function formatarPercentual(percentual: number): string {
  return `${formatoPercentual.format(percentual)}%`
}

const formatoValorCampo = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatarValorCampo(valor: number): string {
  return formatoValorCampo.format(valor)
}

// Lê o texto digitado no padrão brasileiro ("1.000,50") e devolve o número (1000.5).
export function lerValor(texto: string): number {
  const numero = Number(texto.replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(numero) ? numero : 0
}
