<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
import CvPanel from '@/features/curriculo/CvPanel.vue'
import { curriculo } from '@/features/curriculo/curriculo'
import InicioView from '@/features/inicio/InicioView.vue'
import { autor } from '@/shared/config/autor'

const cvAberto = ref(false)
</script>

<template>
  <div class="at-root">
    <AppHeader
      :linkedin-url="autor.linkedinUrl"
      :github-url="autor.githubUrl"
      @cv="cvAberto = true"
    />
    <PageContainer>
      <InicioView />
    </PageContainer>
    <CvPanel v-if="cvAberto" :curriculo="curriculo" @fechar="cvAberto = false" />
  </div>
</template>
