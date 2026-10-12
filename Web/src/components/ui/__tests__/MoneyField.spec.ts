import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MoneyField from '../MoneyField.vue'

describe('MoneyField', () => {
  it('lê o valor digitado e formata ao sair do campo', async () => {
    const wrapper = mount(MoneyField, {
      props: {
        label: 'Valor',
        ajuda: 'Maior que zero',
        modelValue: 0,
        'onUpdate:modelValue': (valor: number) => wrapper.setProps({ modelValue: valor }),
      },
    })
    const input = wrapper.find('input')
    await input.setValue('1500,5')
    expect(wrapper.props('modelValue')).toBe(1500.5)
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('1.500,50')
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('esvazia quando o valor é zerado por fora', async () => {
    const wrapper = mount(MoneyField, {
      props: { label: 'Valor', ajuda: 'Maior que zero', modelValue: 10 },
    })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('10,00')
    await wrapper.setProps({ modelValue: 0 })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })
})
