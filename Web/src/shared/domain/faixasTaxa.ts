// A tabela de faixas vem do back-end (GET /api/taxas), que também recalcula a taxa ao salvar.
// O front usa as funções abaixo só para mostrar a prévia enquanto a pessoa preenche.
export interface FaixaTaxa {
  diasDe: number
  diasAte: number
  taxaFixa: number
  percentual: number
  rotulo: string
}

export function encontrarFaixa(faixas: FaixaTaxa[], dias: number): FaixaTaxa | null {
  return faixas.find((faixa) => dias >= faixa.diasDe && dias <= faixa.diasAte) ?? null
}

export function diasMaximos(faixas: FaixaTaxa[]): number {
  return Math.max(0, ...faixas.map((faixa) => faixa.diasAte))
}

// Arredonda para centavos com HALF_EVEN, o mesmo modo do BigDecimal no back-end.
function arredondarCentavos(valor: number): number {
  const centavos = Number((valor * 100).toFixed(6))
  const piso = Math.floor(centavos)
  const resto = centavos - piso
  const arredondado = resto > 0.5 || (resto === 0.5 && piso % 2 !== 0) ? piso + 1 : piso
  return arredondado / 100
}

export function calcularTaxa(valor: number, faixa: FaixaTaxa): number {
  return arredondarCentavos(faixa.taxaFixa + (valor * faixa.percentual) / 100)
}
