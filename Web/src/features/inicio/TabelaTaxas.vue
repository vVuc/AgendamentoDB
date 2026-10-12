<script setup lang="ts">
import type { FaixaTaxa } from '@/shared/domain/faixasTaxa'
import { formatarMoeda, formatarPercentual } from '@/shared/utils/formatters'

defineProps<{
  faixas: FaixaTaxa[]
}>()

function descreverDias(faixa: FaixaTaxa): string {
  if (faixa.diasDe === 0 && faixa.diasAte === 0) return '0 (mesmo dia)'
  return `${faixa.diasDe} a ${faixa.diasAte}`
}
</script>

<template>
  <div class="tabela-taxas">
    <h3 class="tabela-taxas__titulo">Tabela de taxas</h3>
    <div class="at-table-wrap">
      <table class="at-table">
        <thead>
          <tr>
            <th>Dias</th>
            <th class="is-num">Fixa</th>
            <th class="is-num">Taxa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="faixa in faixas" :key="faixa.diasDe">
            <td>{{ descreverDias(faixa) }}</td>
            <td class="is-num">{{ formatarMoeda(faixa.taxaFixa) }}</td>
            <td class="is-num">{{ formatarPercentual(faixa.percentual) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="tabela-taxas__nota">
      Acima de 50 dias não há taxa aplicável e o agendamento é bloqueado.
    </p>
  </div>
</template>

<style scoped>
.tabela-taxas {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.tabela-taxas__titulo {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}

.tabela-taxas__nota {
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--ink-muted);
}
</style>
