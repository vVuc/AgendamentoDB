import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppButton from '../AppButton.vue'

describe('AppButton', () => {
  it('renderiza um botão primário por padrão', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Agendar' } })
    const botao = wrapper.find('button')
    expect(botao.classes()).toEqual(['at-btn', 'at-btn--primary'])
    expect(botao.attributes('type')).toBe('button')
    expect(botao.text()).toBe('Agendar')
  })

  it('aplica a variante secundária e o estado desabilitado', () => {
    const wrapper = mount(AppButton, { props: { variant: 'secondary', disabled: true } })
    const botao = wrapper.find('button')
    expect(botao.classes()).toContain('at-btn--secondary')
    expect(botao.attributes('disabled')).toBeDefined()
  })

  it('vira um link quando recebe href', () => {
    const wrapper = mount(AppButton, { props: { href: '/extrato' } })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('a').attributes('href')).toBe('/extrato')
  })
})
