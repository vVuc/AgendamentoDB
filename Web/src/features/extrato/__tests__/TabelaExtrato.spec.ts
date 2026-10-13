import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TabelaExtrato from '../TabelaExtrato.vue'
import { transferenciasDeExemplo } from './fixtures'

describe('TabelaExtrato', () => {
  it('mostra contas, valores em reais e datas em dd/mm/aaaa', () => {
    const wrapper = mount(TabelaExtrato, {
      props: { transferencias: [transferenciasDeExemplo[1]!] },
    })
    const celulas = wrapper.findAll('tbody td').map((td) => td.text().replace(/\s/g, ' '))
    expect(celulas).toEqual([
      '0001234567',
      '9876543210',
      'R$ 1.000,00',
      'R$ 82,00',
      '27/10/2026',
      '12/10/2026',
    ])
  })

  it('avisa quando não há agendamentos', () => {
    const wrapper = mount(TabelaExtrato, { props: { transferencias: [] } })
    expect(wrapper.find('.at-table__empty').text()).toBe('Nenhuma transferência agendada ainda.')
  })
})
