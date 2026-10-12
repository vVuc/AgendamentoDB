<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppTabs from '@/components/layout/AppTabs.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
import AgendarView from '@/features/agendamento/AgendarView.vue'
import CvPanel from '@/features/curriculo/CvPanel.vue'
import { curriculo } from '@/features/curriculo/curriculo'
import InicioView from '@/features/inicio/InicioView.vue'
import { autor } from '@/shared/config/autor'
import { formatarData } from '@/shared/utils/formatters'

type Aba = 'inicio' | 'agendar'

const abas: { id: Aba; rotulo: string }[] = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'agendar', rotulo: 'Agendar' },
]

const abaAtiva = ref<Aba>('inicio')
const hoje = formatarData(new Date())
const cvAberto = ref(false)

function irPara(aba: Aba) {
  abaAtiva.value = aba
  window.scrollTo(0, 0)
}
</script>

<template>
  <div class="at-root">
    <AppHeader
      :linkedin-url="autor.linkedinUrl"
      :github-url="autor.githubUrl"
      @cv="cvAberto = true"
    />
    <AppTabs v-model="abaAtiva" :abas="abas" :hoje="hoje" />
    <PageContainer>
      <InicioView v-if="abaAtiva === 'inicio'" @agendar="irPara('agendar')" />
      <AgendarView v-else-if="abaAtiva === 'agendar'" />
    </PageContainer>
    <CvPanel v-if="cvAberto" :curriculo="curriculo" @fechar="cvAberto = false" />
  </div>
</template>
