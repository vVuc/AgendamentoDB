<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'

const emit = defineEmits<{
  agendar: []
  extrato: []
}>()
</script>

<template>
  <section class="at-hero">
    <div>
      <p class="at-hero__eyebrow">Teste técnico · Agendamento financeiro</p>
      <h2 class="at-hero__title">Agende transferências com a taxa calculada na hora.</h2>
      <p class="at-hero__lead">
        Informe as contas, o valor e a data. O sistema aplica a tabela de taxas pelos dias até a
        transferência e guarda tudo no extrato.
      </p>
      <div class="at-hero__actions">
        <AppButton @click="emit('agendar')">Agendar transferência</AppButton>
        <AppButton variant="secondary" @click="emit('extrato')">Ver extrato</AppButton>
      </div>
    </div>
    <slot />
  </section>
</template>
