<script setup lang="ts">
import HeaderLink from './HeaderLink.vue'

defineProps<{
  linkedinUrl: string
  githubUrl: string
}>()

const emit = defineEmits<{
  sobre: []
  cv: []
}>()
</script>

<template>
  <header class="at-header">
    <h1 class="at-header__name">Agenda Transferências</h1>
    <nav class="at-header__nav" aria-label="Links do autor">
      <HeaderLink variant="plain" @click="emit('sobre')">Sobre</HeaderLink>
      <span class="at-header__sep" aria-hidden="true"></span>
      <HeaderLink :href="linkedinUrl" externo>LinkedIn</HeaderLink>
      <HeaderLink :href="githubUrl" externo>GitHub</HeaderLink>
      <HeaderLink variant="solid" @click="emit('cv')">Ver CV</HeaderLink>
    </nav>
  </header>
</template>

<style scoped>
@media (max-width: 640px) {
  .at-header {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-4);
  }
}
</style>
