import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TabelaTaxas from '../TabelaTaxas.vue'
import { faixasTaxa } from '../faixasTaxa'

function textoDasLinhas() {
  const wrapper = mount(TabelaTaxas, { props: { faixas: faixasTaxa } })
  return wrapper
    .findAll('tbody tr')
    .map((linha) => linha.findAll('td').map((celula) => celula.text().replace(/\s/g, ' ')))
}

describe('TabelaTaxas', () => {
  it('mostra uma linha por faixa de dias', () => {
    expect(textoDasLinhas()).toHaveLength(6)
  })

  it('formata dias, taxa fixa e percentual', () => {
    const linhas = textoDasLinhas()
    expect(linhas[0]).toEqual(['0 (mesmo dia)', 'R$ 3,00', '2,5%'])
    expect(linhas[1]).toEqual(['1 a 10', 'R$ 12,00', '0,0%'])
    expect(linhas[5]).toEqual(['41 a 50', 'R$ 0,00', '1,7%'])
  })
})
