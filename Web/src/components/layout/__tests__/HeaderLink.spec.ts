import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HeaderLink from '../HeaderLink.vue'

describe('HeaderLink', () => {
  it('renderiza um botão com contorno por padrão', () => {
    const wrapper = mount(HeaderLink, { slots: { default: 'Sobre' } })
    const botao = wrapper.find('button')
    expect(botao.classes()).toEqual(['at-header__link'])
    expect(botao.attributes('type')).toBe('button')
  })

  it('aplica a variante', () => {
    const wrapper = mount(HeaderLink, { props: { variant: 'solid' } })
    expect(wrapper.find('button').classes()).toContain('at-header__link--solid')
  })

  it('abre link externo em nova aba com ícone', () => {
    const wrapper = mount(HeaderLink, { props: { href: 'https://github.com', externo: true } })
    const link = wrapper.find('a')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener')
    expect(link.find('svg').exists()).toBe(true)
  })

  it('não marca link interno como externo', () => {
    const wrapper = mount(HeaderLink, { props: { href: '/sobre' } })
    const link = wrapper.find('a')
    expect(link.attributes('target')).toBeUndefined()
    expect(link.find('svg').exists()).toBe(false)
  })
})
