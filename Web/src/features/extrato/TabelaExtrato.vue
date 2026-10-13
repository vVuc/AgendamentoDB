<script setup lang="ts">
import type { Transferencia } from '@/shared/types/transferencia'
import { formatarDataISO } from '@/shared/utils/datas'
import { formatarMoeda } from '@/shared/utils/formatters'

defineProps<{
  transferencias: Transferencia[]
}>()
</script>

<template>
  <div class="at-table-wrap">
    <table class="at-table">
      <thead>
        <tr>
          <th>Origem</th>
          <th>Destino</th>
          <th class="is-num">Valor</th>
          <th class="is-num">Taxa</th>
          <th>Transferência</th>
          <th>Agendado em</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!transferencias.length">
          <td class="at-table__empty" colspan="6">Nenhuma transferência agendada ainda.</td>
        </tr>
        <tr v-for="transferencia in transferencias" :key="transferencia.id">
          <td class="at-num">{{ transferencia.contaOrigem }}</td>
          <td class="at-num">{{ transferencia.contaDestino }}</td>
          <td class="is-num">{{ formatarMoeda(transferencia.valor) }}</td>
          <td class="is-num">{{ formatarMoeda(transferencia.taxa) }}</td>
          <td>{{ formatarDataISO(transferencia.dataTransferencia) }}</td>
          <td>{{ formatarDataISO(transferencia.dataAgendamento) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
