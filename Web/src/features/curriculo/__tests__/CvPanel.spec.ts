import { describe, it, expect } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import CvPanel from '../CvPanel.vue'
import { curriculo } from '../curriculo'

const props = { curriculo }

describe('CvPanel', () => {
  it('mostra o nome e uma entrada por experiência', () => {
    const wrapper = mount(CvPanel, { props })
    expect(wrapper.find('#cv-nome').text()).toBe(curriculo.nome)
    const titulos = wrapper.findAll('.cv__item-titulo').map((titulo) => titulo.text())
    curriculo.experiencias.forEach((experiencia) =>
      expect(titulos).toContain(`${experiencia.cargo} · ${experiencia.empresa}`),
    )
  })

  it('emite "fechar" pelo botão e pela tecla Esc', async () => {
    const wrapper = mount(CvPanel, { props, attachTo: document.body })
    await wrapper.find('button').trigger('click')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('fechar')).toHaveLength(2)
    wrapper.unmount()
  })

  it('coloca o foco no botão Fechar ao abrir', async () => {
    const wrapper = mount(CvPanel, { props, attachTo: document.body })
    await flushPromises()
    expect(document.activeElement?.textContent?.trim()).toBe('Fechar')
    wrapper.unmount()
  })
})
