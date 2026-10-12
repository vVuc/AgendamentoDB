import { describe, it, expect } from 'vitest'

import {
  formatarData,
  formatarMoeda,
  formatarPercentual,
  formatarValorCampo,
  lerValor,
} from '../formatters'

describe('formatters', () => {
  it('formata data como dd/mm/aaaa', () => {
    expect(formatarData(new Date(2026, 9, 2))).toBe('02/10/2026')
  })

  it('formata dinheiro em reais', () => {
    // Intl usa espaço não separável entre o símbolo e o valor.
    expect(formatarMoeda(1000).replace(/\s/g, ' ')).toBe('R$ 1.000,00')
  })

  it('formata percentual com uma casa decimal', () => {
    expect(formatarPercentual(2.5)).toBe('2,5%')
    expect(formatarPercentual(0)).toBe('0,0%')
  })

  it('formata o valor do campo sem o símbolo', () => {
    expect(formatarValorCampo(1000.5)).toBe('1.000,50')
  })

  it('lê o valor digitado no padrão brasileiro', () => {
    expect(lerValor('1.000,50')).toBe(1000.5)
    expect(lerValor('80')).toBe(80)
    expect(lerValor('')).toBe(0)
    expect(lerValor('abc')).toBe(0)
  })
})
