import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TabelaTaxas from '../TabelaTaxas.vue'
import { faixasDeExemplo } from '@/shared/domain/__tests__/fixtures'

function textoDasLinhas() {
  const wrapper = mount(TabelaTaxas, { props: { faixas: faixasDeExemplo } })
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

  it('mostra o limite de dias vindo da tabela', () => {
    const wrapper = mount(TabelaTaxas, { props: { faixas: faixasDeExemplo } })
    expect(wrapper.find('.tabela-taxas__nota').text()).toContain('Acima de 50 dias')
  })

  it('mostra o erro e pede para recarregar', async () => {
    const wrapper = mount(TabelaTaxas, { props: { faixas: [], erro: 'Erro: sem conexão' } })
    expect(wrapper.find('[role="alert"]').text()).toContain('Erro: sem conexão')
    expect(wrapper.find('table').exists()).toBe(false)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('recarregar')).toHaveLength(1)
  })
})
