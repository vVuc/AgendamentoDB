import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TextField from '../TextField.vue'

describe('TextField', () => {
  it('aplica a máscara ao digitar', async () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Conta',
        ajuda: 'Só números',
        modelValue: '',
        mascara: (valor: string) => valor.replace(/\D/g, ''),
      },
    })
    await wrapper.find('input').setValue('12ab3')
    expect(wrapper.emitted('update:modelValue')!.slice(-1)[0]).toEqual(['123'])
  })

  it('troca a ajuda pelo erro e marca o campo como inválido', () => {
    const wrapper = mount(TextField, {
      props: { label: 'Conta', ajuda: 'Só números', erro: 'Erro: inválida', modelValue: '' },
    })
    expect(wrapper.classes()).toContain('at-field--invalid')
    expect(wrapper.find('.at-field__help').text()).toBe('Erro: inválida')
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })
})
