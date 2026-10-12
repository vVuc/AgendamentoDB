<script setup lang="ts" generic="T extends string">
defineProps<{
  abas: { id: T; rotulo: string }[]
  hoje: string
}>()

const abaAtiva = defineModel<T>({ required: true })
</script>

<template>
  <nav class="at-tabs" role="tablist" aria-label="Seções">
    <button
      v-for="aba in abas"
      :key="aba.id"
      type="button"
      class="at-tab"
      role="tab"
      :aria-selected="abaAtiva === aba.id"
      @click="abaAtiva = aba.id"
    >
      {{ aba.rotulo }}
    </button>
    <span class="at-tabs__meta"
      >Hoje: <span class="at-num">{{ hoje }}</span></span
    >
  </nav>
</template>

<style scoped>
@media (max-width: 640px) {
  .at-tabs {
    flex-wrap: wrap;
    padding: 0 var(--space-4);
  }
}
</style>
