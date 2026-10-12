import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTabs from '../AppTabs.vue'

describe('AppTabs', () => {
  it('marca a aba ativa e troca ao clicar', async () => {
    const wrapper = mount(AppTabs, {
      props: {
        abas: [
          { id: 'inicio', rotulo: 'Início' },
          { id: 'agendar', rotulo: 'Agendar' },
        ],
        hoje: '12/10/2026',
        modelValue: 'inicio',
      },
    })
    const [inicio, agendar] = wrapper.findAll('[role="tab"]')
    expect(inicio!.attributes('aria-selected')).toBe('true')
    await agendar!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['agendar']])
    expect(wrapper.find('.at-tabs__meta').text()).toBe('Hoje: 12/10/2026')
  })
})
