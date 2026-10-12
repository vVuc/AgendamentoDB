import { describe, it, expect } from 'vitest'

import { calcularTaxa, descreverFaixa, encontrarFaixa } from '../faixasTaxa'

describe('faixasTaxa', () => {
  it.each([
    [0, 0],
    [1, 1],
    [10, 1],
    [11, 11],
    [50, 41],
  ])('encontra a faixa de %i dias', (dias, inicioDaFaixa) => {
    expect(encontrarFaixa(dias)?.diasDe).toBe(inicioDaFaixa)
  })

  it('não encontra faixa para data passada ou acima de 50 dias', () => {
    expect(encontrarFaixa(-1)).toBeNull()
    expect(encontrarFaixa(51)).toBeNull()
  })

  it('calcula taxa fixa mais percentual sobre o valor', () => {
    expect(calcularTaxa(1000, encontrarFaixa(0)!)).toBe(28)
    expect(calcularTaxa(1000, encontrarFaixa(5)!)).toBe(12)
    expect(calcularTaxa(1000, encontrarFaixa(15)!)).toBe(82)
  })

  it('descreve a faixa para o selo do resumo', () => {
    expect(descreverFaixa(encontrarFaixa(0)!)).toBe('Mesmo dia')
    expect(descreverFaixa(encontrarFaixa(15)!)).toBe('11 a 20 dias')
  })
})
