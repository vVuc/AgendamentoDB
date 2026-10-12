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
