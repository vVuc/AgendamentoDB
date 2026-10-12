import { describe, it, expect } from 'vitest'

import { formatarData, formatarMoeda, formatarPercentual } from '../formatters'

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
})
