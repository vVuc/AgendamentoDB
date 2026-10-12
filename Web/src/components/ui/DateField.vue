<script setup lang="ts">
import { computed } from 'vue'
import { formatarDataISO } from '@/shared/utils/datas'

withDefaults(
  defineProps<{
    label: string
    ajuda: string
    erro?: string
    min?: string
    max?: string
    somenteLeitura?: boolean
  }>(),
  {
    erro: '',
    min: undefined,
    max: undefined,
    somenteLeitura: false,
  },
)

const modelo = defineModel<string>({ required: true })

// O campo somente leitura mostra a data já formatada; o editável usa o seletor nativo.
const exibicao = computed(() => (modelo.value ? formatarDataISO(modelo.value) : ''))
</script>

<template>
  <label
    class="at-field"
    :class="{ 'at-field--readonly': somenteLeitura, 'at-field--invalid': erro }"
  >
    <span class="at-field__label">{{ label }}</span>
    <span class="at-field__control">
      <input v-if="somenteLeitura" class="at-field__input" type="text" :value="exibicao" readonly />
      <input
        v-else
        v-model="modelo"
        class="at-field__input"
        type="date"
        :min="min"
        :max="max"
        :aria-invalid="erro ? 'true' : undefined"
      />
    </span>
    <span class="at-field__help">{{ erro || ajuda }}</span>
  </label>
</template>
