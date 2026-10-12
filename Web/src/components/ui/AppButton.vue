<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    href?: string
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    href: undefined,
    type: 'button',
    disabled: false,
  },
)

const elemento = ref<HTMLElement | null>(null)

defineExpose({
  focus: () => elemento.value?.focus(),
})
</script>

<template>
  <a
    v-if="props.href"
    ref="elemento"
    :class="['at-btn', `at-btn--${props.variant}`]"
    :href="props.href"
  >
    <slot />
  </a>
  <button
    v-else
    ref="elemento"
    :class="['at-btn', `at-btn--${props.variant}`]"
    :type="props.type"
    :disabled="props.disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
a.at-btn {
  text-decoration: none;
}
</style>
