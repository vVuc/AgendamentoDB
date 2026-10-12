import type { FaixaTaxa } from '../faixasTaxa'

// Mesma tabela que o back-end devolve em GET /api/taxas.
export const faixasDeExemplo: FaixaTaxa[] = [
  { diasDe: 0, diasAte: 0, taxaFixa: 3, percentual: 2.5, rotulo: 'Mesmo dia' },
  { diasDe: 1, diasAte: 10, taxaFixa: 12, percentual: 0, rotulo: '1 a 10 dias' },
  { diasDe: 11, diasAte: 20, taxaFixa: 0, percentual: 8.2, rotulo: '11 a 20 dias' },
  { diasDe: 21, diasAte: 30, taxaFixa: 0, percentual: 6.9, rotulo: '21 a 30 dias' },
  { diasDe: 31, diasAte: 40, taxaFixa: 0, percentual: 4.7, rotulo: '31 a 40 dias' },
  { diasDe: 41, diasAte: 50, taxaFixa: 0, percentual: 1.7, rotulo: '41 a 50 dias' },
]
