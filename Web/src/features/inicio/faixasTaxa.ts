export interface FaixaTaxa {
  diasDe: number
  diasAte: number
  taxaFixa: number
  percentual: number
}

// Espelha a regra de taxa do back-end, que é a fonte da verdade do cálculo.
// Aqui ela só é exibida na página inicial.
export const faixasTaxa: FaixaTaxa[] = [
  { diasDe: 0, diasAte: 0, taxaFixa: 3, percentual: 2.5 },
  { diasDe: 1, diasAte: 10, taxaFixa: 12, percentual: 0 },
  { diasDe: 11, diasAte: 20, taxaFixa: 0, percentual: 8.2 },
  { diasDe: 21, diasAte: 30, taxaFixa: 0, percentual: 6.9 },
  { diasDe: 31, diasAte: 40, taxaFixa: 0, percentual: 4.7 },
  { diasDe: 41, diasAte: 50, taxaFixa: 0, percentual: 1.7 },
]
