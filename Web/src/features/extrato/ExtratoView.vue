<script setup lang="ts">
import { onMounted } from 'vue'
import TabelaExtrato from './TabelaExtrato.vue'
import { useExtrato } from './useExtrato'
import AppAlert from '@/components/ui/AppAlert.vue'
import AppButton from '@/components/ui/AppButton.vue'

const { transferencias, carregando, erro, quantidade, carregar } = useExtrato()

// A aba é montada de novo a cada visita, então o extrato sempre mostra os últimos agendamentos.
onMounted(carregar)
</script>

<template>
  <div class="extrato">
    <div class="extrato__cabecalho">
      <h2 class="extrato__titulo">Extrato de agendamentos</h2>
      <span v-if="!carregando && !erro" class="extrato__quantidade">{{ quantidade }}</span>
    </div>

    <AppAlert v-if="erro" variante="danger" :titulo="erro">
      Não foi possível mostrar os agendamentos.
    </AppAlert>
    <div v-if="erro">
      <AppButton variant="secondary" @click="carregar">Tentar de novo</AppButton>
    </div>
    <p v-else-if="carregando" class="extrato__carregando" role="status">Carregando o extrato...</p>
    <TabelaExtrato v-else :transferencias="transferencias" />
  </div>
</template>

<style scoped>
.extrato {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.extrato__cabecalho {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-4);
}

.extrato__titulo {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
}

.extrato__quantidade,
.extrato__carregando {
  margin: 0;
  font-size: 13px;
  color: var(--ink-muted);
}
</style>
