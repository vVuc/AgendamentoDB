import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppHeader from '../AppHeader.vue'

const props = {
  linkedinUrl: 'https://www.linkedin.com/in/fulano',
  githubUrl: 'https://github.com/fulano',
}

describe('AppHeader', () => {
  it('mostra o nome do sistema', () => {
    const wrapper = mount(AppHeader, { props })
    expect(wrapper.find('.at-header__name').text()).toBe('Agenda Transferências')
  })

  it('abre LinkedIn e GitHub em nova aba', () => {
    const wrapper = mount(AppHeader, { props })
    const links = wrapper.findAll('a[target="_blank"]')
    expect(links.map((link) => link.attributes('href'))).toEqual([
      props.linkedinUrl,
      props.githubUrl,
    ])
    links.forEach((link) => expect(link.attributes('rel')).toBe('noopener'))
  })

  it('mostra só LinkedIn, GitHub e Ver CV', () => {
    const wrapper = mount(AppHeader, { props })
    const textos = wrapper.findAll('.at-header__nav > *').map((item) => item.text())
    expect(textos).toEqual(['LinkedIn', 'GitHub', 'Ver CV'])
  })

  it('emite "cv" ao clicar em Ver CV', async () => {
    const wrapper = mount(AppHeader, { props })
    const botao = wrapper.find('button.at-header__link--solid')
    expect(botao.text()).toBe('Ver CV')
    await botao.trigger('click')
    expect(wrapper.emitted('cv')).toHaveLength(1)
  })
})
