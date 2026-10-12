<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    ajuda: string
    erro?: string
    placeholder?: string
    inputmode?: 'text' | 'numeric' | 'decimal'
    maxlength?: number
    mascara?: (valor: string) => string
  }>(),
  {
    erro: '',
    placeholder: undefined,
    inputmode: 'text',
    maxlength: undefined,
    mascara: (valor: string) => valor,
  },
)

const modelo = defineModel<string>({ required: true })

defineEmits<{
  blur: []
}>()

function aoDigitar(evento: Event) {
  const input = evento.target as HTMLInputElement
  const valor = props.mascara(input.value)
  // Reescreve o input para descartar na hora o que a máscara rejeitou.
  input.value = valor
  modelo.value = valor
}
</script>

<template>
  <label class="at-field" :class="{ 'at-field--invalid': erro }">
    <span class="at-field__label">{{ label }}</span>
    <span class="at-field__control">
      <input
        class="at-field__input"
        :value="modelo"
        :inputmode="inputmode"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :aria-invalid="erro ? 'true' : undefined"
        @input="aoDigitar"
        @blur="$emit('blur')"
      />
    </span>
    <span class="at-field__help">{{ erro || ajuda }}</span>
  </label>
</template>
