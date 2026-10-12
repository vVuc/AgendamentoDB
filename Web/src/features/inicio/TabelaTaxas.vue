<script setup lang="ts">
import { computed } from 'vue'
import { diasMaximos, type FaixaTaxa } from '@/shared/domain/faixasTaxa'
import { formatarMoeda, formatarPercentual } from '@/shared/utils/formatters'

const props = withDefaults(
  defineProps<{
    faixas: FaixaTaxa[]
    carregando?: boolean
    erro?: string
  }>(),
  { carregando: false, erro: '' },
)

defineEmits<{
  recarregar: []
}>()

const limite = computed(() => diasMaximos(props.faixas))

function descreverDias(faixa: FaixaTaxa): string {
  if (faixa.diasDe === 0 && faixa.diasAte === 0) return '0 (mesmo dia)'
  return `${faixa.diasDe} a ${faixa.diasAte}`
}
</script>

<template>
  <div class="tabela-taxas">
    <h3 class="tabela-taxas__titulo">Tabela de taxas</h3>
    <p v-if="erro" class="tabela-taxas__aviso" role="alert">
      {{ erro }}
      <button type="button" class="tabela-taxas__repetir" @click="$emit('recarregar')">
        Tentar de novo
      </button>
    </p>
    <p v-else-if="carregando" class="tabela-taxas__aviso" role="status">Carregando as taxas...</p>
    <div v-if="faixas.length" class="at-table-wrap">
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
    <p v-if="faixas.length" class="tabela-taxas__nota">
      Acima de {{ limite }} dias não há taxa aplicável e o agendamento é bloqueado.
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
.tabela-taxas__aviso {
  margin: 0;
  color: var(--ink-muted);
}

.tabela-taxas__aviso[role='alert'] {
  color: var(--danger);
}

.tabela-taxas__repetir {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-weight: 600;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
}
</style>
