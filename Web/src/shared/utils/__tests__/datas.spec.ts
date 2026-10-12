import { describe, it, expect } from 'vitest'

import { diasEntre, formatarDataISO, paraISO, somarDias } from '../datas'

describe('datas', () => {
  it('converte Date para aaaa-mm-dd', () => {
    expect(paraISO(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('soma dias atravessando o mês', () => {
    expect(somarDias('2026-10-12', 50)).toBe('2026-12-01')
  })

  it('conta os dias entre duas datas', () => {
    expect(diasEntre('2026-10-12', '2026-10-12')).toBe(0)
    expect(diasEntre('2026-10-12', '2026-10-22')).toBe(10)
    expect(diasEntre('2026-10-12', '2026-10-11')).toBe(-1)
  })

  it('formata aaaa-mm-dd como dd/mm/aaaa', () => {
    expect(formatarDataISO('2026-10-12')).toBe('12/10/2026')
  })
})
