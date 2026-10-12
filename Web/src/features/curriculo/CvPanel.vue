<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import type { Curriculo } from './curriculo'

defineProps<{
  curriculo: Curriculo
}>()

const emit = defineEmits<{
  fechar: []
}>()

const botaoFechar = ref<InstanceType<typeof AppButton> | null>(null)

function aoTeclar(evento: KeyboardEvent) {
  if (evento.key === 'Escape') emit('fechar')
}

onMounted(async () => {
  document.addEventListener('keydown', aoTeclar)
  await nextTick()
  botaoFechar.value?.focus()
})

onBeforeUnmount(() => document.removeEventListener('keydown', aoTeclar))
</script>

<template>
  <aside class="cv" role="dialog" aria-labelledby="cv-nome">
    <div class="cv__topo">
      <div>
        <h2 id="cv-nome" class="cv__nome">{{ curriculo.nome }}</h2>
        <p class="cv__apoio">{{ curriculo.titulo }} · {{ curriculo.local }}</p>
      </div>
      <AppButton ref="botaoFechar" variant="secondary" @click="emit('fechar')">Fechar</AppButton>
    </div>

    <div class="cv__corpo">
      <section class="cv__secao">
        <h3 class="cv__titulo">Resumo</h3>
        <p v-for="paragrafo in curriculo.resumo" :key="paragrafo" class="cv__texto">
          {{ paragrafo }}
        </p>
      </section>

      <section class="cv__secao">
        <h3 class="cv__titulo">Experiência</h3>
        <article
          v-for="experiencia in curriculo.experiencias"
          :key="experiencia.empresa"
          class="cv__item"
        >
          <h4 class="cv__item-titulo">{{ experiencia.cargo }} · {{ experiencia.empresa }}</h4>
          <p class="cv__apoio">
            {{ experiencia.periodo
            }}<template v-if="experiencia.local"> · {{ experiencia.local }}</template>
          </p>
          <ul class="cv__lista">
            <li v-for="atividade in experiencia.atividades" :key="atividade">{{ atividade }}</li>
          </ul>
        </article>
      </section>

      <section class="cv__secao">
        <h3 class="cv__titulo">Formação</h3>
        <article v-for="formacao in curriculo.formacoes" :key="formacao.curso" class="cv__item">
          <h4 class="cv__item-titulo">{{ formacao.curso }}</h4>
          <p class="cv__apoio">{{ formacao.instituicao }} · {{ formacao.periodo }}</p>
        </article>
      </section>

      <section class="cv__secao">
        <h3 class="cv__titulo">Tecnologias</h3>
        <div class="at-chips">
          <span v-for="tecnologia in curriculo.tecnologias" :key="tecnologia" class="at-chip">
            {{ tecnologia }}
          </span>
        </div>
      </section>

      <section class="cv__secao">
        <h3 class="cv__titulo">Idiomas</h3>
        <ul class="cv__lista">
          <li v-for="idioma in curriculo.idiomas" :key="idioma">{{ idioma }}</li>
        </ul>
      </section>

      <section class="cv__secao">
        <h3 class="cv__titulo">Certificações</h3>
        <ul class="cv__lista">
          <li v-for="certificacao in curriculo.certificacoes" :key="certificacao">
            {{ certificacao }}
          </li>
        </ul>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.cv {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: min(480px, 100vw);
  background: var(--surface);
  border-left: 1px solid var(--line);
  box-shadow: var(--shadow-card);
}

.cv__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-6);
  border-bottom: 1px solid var(--line);
}

.cv__nome {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
}

.cv__corpo {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.cv__titulo {
  margin: 0 0 var(--space-3);
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}

.cv__item + .cv__item {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.cv__item-titulo {
  margin: 0;
  font-size: 15px;
  line-height: 22px;
  font-weight: 600;
}

.cv__apoio {
  margin: 0;
  font-size: 13px;
  line-height: 18px;
  color: var(--ink-muted);
}

.cv__texto {
  margin: 0 0 var(--space-2);
}

.cv__lista {
  margin: var(--space-2) 0 0;
  padding-left: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
</style>
