import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import InicioView from '../InicioView.vue'

describe('InicioView', () => {
  it('mostra os três passos de como funciona', () => {
    const wrapper = mount(InicioView)
    const titulos = wrapper.findAll('.at-step__title').map((titulo) => titulo.text())
    expect(titulos).toEqual(['Preencha os dados', 'Confira a taxa', 'Acompanhe no extrato'])
  })

  it('emite "agendar" e "extrato" pelos botões do hero', async () => {
    const wrapper = mount(InicioView)
    const [agendar, extrato] = wrapper.findAll('.at-hero__actions button')
    await agendar!.trigger('click')
    await extrato!.trigger('click')
    expect(wrapper.emitted('agendar')).toHaveLength(1)
    expect(wrapper.emitted('extrato')).toHaveLength(1)
  })
})
