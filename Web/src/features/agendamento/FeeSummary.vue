<script setup lang="ts">
import { computed } from 'vue'
import { descreverFaixa, type FaixaTaxa } from '@/shared/domain/faixasTaxa'
import { formatarMoeda, formatarPercentual } from '@/shared/utils/formatters'

const props = defineProps<{
  faixa: FaixaTaxa
  taxa: number
  total: number
}>()

const selo = computed(() => descreverFaixa(props.faixa))
</script>

<template>
  <section class="at-fee" aria-live="polite">
    <div class="at-fee__head">
      <h3 class="at-fee__title">Resumo da taxa</h3>
      <span class="at-fee__badge">{{ selo }}</span>
    </div>
    <div class="at-fee__row">
      <span>Taxa fixa</span><b>{{ formatarMoeda(faixa.taxaFixa) }}</b>
    </div>
    <div class="at-fee__row">
      <span>Percentual sobre o valor</span><b>{{ formatarPercentual(faixa.percentual) }}</b>
    </div>
    <div class="at-fee__row">
      <span>Taxa calculada</span><b>{{ formatarMoeda(taxa) }}</b>
    </div>
    <div class="at-fee__total">
      <span>Total a debitar</span><strong>{{ formatarMoeda(total) }}</strong>
    </div>
  </section>
</template>
