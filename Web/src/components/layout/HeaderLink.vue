<script setup lang="ts">
import { computed } from 'vue'
import IconLinkExterno from '@/components/ui/icons/IconLinkExterno.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'plain' | 'outline' | 'solid'
    href?: string
    externo?: boolean
  }>(),
  {
    variant: 'outline',
    href: undefined,
    externo: false,
  },
)

const classes = computed(() => [
  'at-header__link',
  { [`at-header__link--${props.variant}`]: props.variant !== 'outline' },
])
</script>

<template>
  <a
    v-if="props.href"
    :class="classes"
    :href="props.href"
    :target="props.externo ? '_blank' : undefined"
    :rel="props.externo ? 'noopener' : undefined"
  >
    <slot />
    <IconLinkExterno v-if="props.externo" />
  </a>
  <button v-else type="button" :class="classes">
    <slot />
  </button>
</template>
