<script setup lang="ts">
defineProps<{
  variante: 'danger' | 'success' | 'info'
  titulo: string
}>()
</script>

<template>
  <div
    class="at-alert"
    :class="`at-alert--${variante}`"
    :role="variante === 'danger' ? 'alert' : 'status'"
  >
    <svg class="at-alert__icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5" />
      <template v-if="variante === 'danger'">
        <path d="M10 5.5v5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="10" cy="14" r="1.1" fill="currentColor" />
      </template>
      <path
        v-else-if="variante === 'success'"
        d="M6 10.2l2.6 2.6L14 7.5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <template v-else>
        <path d="M10 9v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="10" cy="6" r="1.1" fill="currentColor" />
      </template>
    </svg>
    <div>
      <p class="at-alert__title">{{ titulo }}</p>
      <p class="at-alert__text"><slot /></p>
    </div>
  </div>
</template>
