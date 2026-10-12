<script setup lang="ts">
import type { PreviaTaxa } from '@/shared/types/transferencia'
import { formatarMoeda, formatarPercentual } from '@/shared/utils/formatters'

defineProps<{
  previa: PreviaTaxa
}>()
</script>

<template>
  <section class="at-fee" aria-live="polite">
    <div class="at-fee__head">
      <h3 class="at-fee__title">Resumo da taxa</h3>
      <span class="at-fee__badge">{{ previa.rotulo }}</span>
    </div>
    <div class="at-fee__row">
      <span>Taxa fixa</span><b>{{ formatarMoeda(previa.taxaFixa) }}</b>
    </div>
    <div class="at-fee__row">
      <span>Percentual sobre o valor</span><b>{{ formatarPercentual(previa.percentual) }}</b>
    </div>
    <div class="at-fee__row">
      <span>Taxa calculada</span><b>{{ formatarMoeda(previa.taxa) }}</b>
    </div>
    <div class="at-fee__total">
      <span>Total a debitar</span><strong>{{ formatarMoeda(previa.total) }}</strong>
    </div>
  </section>
</template>
