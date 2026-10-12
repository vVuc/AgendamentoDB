<script setup lang="ts">
import AppHero from './AppHero.vue'
import TabelaTaxas from './TabelaTaxas.vue'
import { faixasTaxa } from './faixasTaxa'

const emit = defineEmits<{
  agendar: []
  extrato: []
}>()

const passos = [
  {
    titulo: 'Preencha os dados',
    texto:
      'Conta de origem, conta de destino, valor e a data em que a transferência deve acontecer.',
  },
  {
    titulo: 'Confira a taxa',
    texto: 'O resumo mostra a faixa, a taxa e o total a debitar enquanto você digita.',
  },
  {
    titulo: 'Acompanhe no extrato',
    texto: 'Cada agendamento fica salvo e aparece na aba Extrato com a taxa aplicada.',
  },
]

const stack = ['Java', 'Spring Boot', 'H2', 'Vue 3']
</script>

<template>
  <div class="inicio">
    <AppHero @agendar="emit('agendar')" @extrato="emit('extrato')">
      <TabelaTaxas :faixas="faixasTaxa" />
    </AppHero>

    <section class="inicio__secao">
      <h3 class="inicio__titulo">Como funciona</h3>
      <ol class="at-steps">
        <li v-for="(passo, indice) in passos" :key="passo.titulo" class="at-step">
          <div class="at-step__num" aria-hidden="true">{{ indice + 1 }}</div>
          <p class="at-step__title">{{ passo.titulo }}</p>
          <p class="at-step__text">{{ passo.texto }}</p>
        </li>
      </ol>
    </section>

    <div class="at-chips">
      <span class="inicio__rotulo">Feito com</span>
      <span v-for="tecnologia in stack" :key="tecnologia" class="at-chip">{{ tecnologia }}</span>
    </div>
  </div>
</template>

<style scoped>
.inicio {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.inicio .at-hero {
  padding: var(--space-4) 0 var(--space-2);
}

.inicio__secao {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.inicio__titulo {
  margin: var(--space-4) 0 0;
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}

.at-steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.inicio__rotulo {
  margin-right: var(--space-1);
  font-size: 13px;
  color: var(--ink-muted);
}
</style>
