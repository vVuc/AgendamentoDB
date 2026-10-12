import { describe, it, expect } from 'vitest'

import { calcularTaxa, diasMaximos, encontrarFaixa } from '../faixasTaxa'
import { faixasDeExemplo as faixas } from './fixtures'

describe('faixasTaxa', () => {
  it.each([
    [0, 0],
    [1, 1],
    [10, 1],
    [11, 11],
    [50, 41],
  ])('encontra a faixa de %i dias', (dias, inicioDaFaixa) => {
    expect(encontrarFaixa(faixas, dias)?.diasDe).toBe(inicioDaFaixa)
  })

  it('não encontra faixa para data passada ou acima do limite', () => {
    expect(encontrarFaixa(faixas, -1)).toBeNull()
    expect(encontrarFaixa(faixas, 51)).toBeNull()
    expect(diasMaximos(faixas)).toBe(50)
  })

  it('calcula taxa fixa mais percentual sobre o valor', () => {
    expect(calcularTaxa(1000, encontrarFaixa(faixas, 0)!)).toBe(28)
    expect(calcularTaxa(1000, encontrarFaixa(faixas, 5)!)).toBe(12)
    expect(calcularTaxa(1000, encontrarFaixa(faixas, 15)!)).toBe(82)
  })

  it('arredonda meio centavo para o par, como o back-end', () => {
    const metade = { diasDe: 0, diasAte: 0, taxaFixa: 0, percentual: 50, rotulo: '' }
    expect(calcularTaxa(0.05, metade)).toBe(0.02)
    expect(calcularTaxa(0.07, metade)).toBe(0.04)
  })
})
