<script setup lang="ts">
import { ref, watch } from 'vue'
import { formatarValorCampo, lerValor } from '@/shared/utils/formatters'

withDefaults(
  defineProps<{
    label: string
    ajuda: string
    erro?: string
  }>(),
  { erro: '' },
)

const modelo = defineModel<number>({ required: true })

const emit = defineEmits<{
  blur: []
}>()

const texto = ref(modelo.value > 0 ? formatarValorCampo(modelo.value) : '')

// Quando o formulário é limpo por fora, o campo acompanha.
watch(modelo, (valor) => {
  if (lerValor(texto.value) !== valor) texto.value = valor > 0 ? formatarValorCampo(valor) : ''
})

function aoDigitar(evento: Event) {
  const input = evento.target as HTMLInputElement
  input.value = input.value.replace(/[^\d.,]/g, '')
  texto.value = input.value
  modelo.value = lerValor(input.value)
}

function aoSair() {
  texto.value = modelo.value > 0 ? formatarValorCampo(modelo.value) : ''
  emit('blur')
}
</script>

<template>
  <label class="at-field" :class="{ 'at-field--invalid': erro }">
    <span class="at-field__label">{{ label }}</span>
    <span class="at-field__control">
      <span class="at-field__prefix">R$</span>
      <input
        class="at-field__input"
        :value="texto"
        inputmode="decimal"
        placeholder="0,00"
        :aria-invalid="erro ? 'true' : undefined"
        @input="aoDigitar"
        @blur="aoSair"
      />
    </span>
    <span class="at-field__help">{{ erro || ajuda }}</span>
  </label>
</template>
