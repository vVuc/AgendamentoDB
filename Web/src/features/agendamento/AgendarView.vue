<script setup lang="ts">
import FeeSummary from './FeeSummary.vue'
import { apenasDigitosDaConta, useAgendamento } from './useAgendamento'
import AppAlert from '@/components/ui/AppAlert.vue'
import AppButton from '@/components/ui/AppButton.vue'
import DateField from '@/components/ui/DateField.vue'
import MoneyField from '@/components/ui/MoneyField.vue'
import TextField from '@/components/ui/TextField.vue'
import { formatarDataISO } from '@/shared/utils/datas'
import { formatarMoeda } from '@/shared/utils/formatters'

const {
  hoje,
  dataMaxima,
  formulario,
  erros,
  previa,
  erroPrevia,
  semTaxaAplicavel,
  consultandoTaxa,
  podeAgendar,
  enviando,
  erroServidor,
  agendada,
  tocar,
  aoEditar,
  agendar,
  limpar,
} = useAgendamento()
</script>

<template>
  <div class="agendar">
    <div>
      <h2 class="agendar__titulo">Agendar transferência</h2>
      <p class="agendar__apoio">
        A taxa é calculada pela quantidade de dias entre hoje e a data da transferência.
      </p>
    </div>

    <form class="at-card agendar__cartao" novalidate @submit.prevent="agendar">
      <div class="at-form-grid">
        <TextField
          v-model="formulario.contaOrigem"
          label="Conta de origem"
          ajuda="10 dígitos, só números"
          placeholder="0000000000"
          inputmode="numeric"
          :maxlength="10"
          :mascara="apenasDigitosDaConta"
          :erro="erros.contaOrigem"
          @update:model-value="aoEditar"
          @blur="tocar('contaOrigem')"
        />
        <TextField
          v-model="formulario.contaDestino"
          label="Conta de destino"
          ajuda="10 dígitos, só números"
          placeholder="0000000000"
          inputmode="numeric"
          :maxlength="10"
          :mascara="apenasDigitosDaConta"
          :erro="erros.contaDestino"
          @update:model-value="aoEditar"
          @blur="tocar('contaDestino')"
        />
        <MoneyField
          v-model="formulario.valor"
          label="Valor da transferência"
          ajuda="Valor maior que zero"
          :erro="erros.valor"
          @update:model-value="aoEditar"
          @blur="tocar('valor')"
        />
        <div class="agendar__vazio" aria-hidden="true"></div>
        <DateField
          v-model="formulario.dataTransferencia"
          label="Data da transferência"
          ajuda="Até 50 dias a partir de hoje"
          :erro="erros.dataTransferencia"
          :min="hoje"
          :max="dataMaxima"
          @update:model-value="aoEditar"
        />
        <DateField
          :model-value="hoje"
          label="Data de agendamento"
          ajuda="Hoje, preenchida automaticamente"
          somente-leitura
        />
      </div>

      <FeeSummary v-if="previa" :previa="previa" />
      <p v-else-if="consultandoTaxa" class="agendar__calculando" role="status">
        Calculando a taxa...
      </p>

      <AppAlert v-if="erroPrevia" variante="danger" :titulo="erroPrevia">
        <template v-if="semTaxaAplicavel">
          Transferências só podem ser agendadas para hoje ou até 50 dias a partir de hoje. Escolha
          outra data.
        </template>
        <template v-else>Confira o valor e a data e tente de novo.</template>
      </AppAlert>
      <AppAlert v-if="erroServidor" variante="danger" :titulo="erroServidor">
        Confira os dados e tente agendar de novo.
      </AppAlert>
      <AppAlert v-if="agendada" variante="success" titulo="Transferência agendada">
        {{ formatarMoeda(agendada.valor) }} para a conta {{ agendada.contaDestino }} em
        {{ formatarDataISO(agendada.dataTransferencia) }}. Taxa de
        {{ formatarMoeda(agendada.taxa) }}.
      </AppAlert>

      <div class="agendar__acoes">
        <AppButton variant="secondary" @click="limpar">Limpar</AppButton>
        <AppButton type="submit" :disabled="!podeAgendar">
          {{ enviando ? 'Agendando...' : 'Agendar transferência' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.agendar {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.agendar__titulo {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
}

.agendar__apoio {
  margin: 0;
  color: var(--ink-muted);
}

.agendar__cartao {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.agendar__calculando {
  margin: 0;
  color: var(--ink-muted);
}

.agendar__acoes {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-2);
}

@media (max-width: 640px) {
  .at-form-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .agendar__vazio {
    display: none;
  }
}
</style>
