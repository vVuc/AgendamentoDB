<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import CvPanel from '@/features/curriculo/CvPanel.vue'
import { autor } from '@/shared/config/autor'
import { curriculo } from '@/features/curriculo/curriculo'

const cvAberto = ref(false)
</script>

<template>
  <div class="at-root">
    <AppHeader
      :linkedin-url="autor.linkedinUrl"
      :github-url="autor.githubUrl"
      @cv="cvAberto = true"
    />
    <CvPanel v-if="cvAberto" :curriculo="curriculo" @fechar="cvAberto = false" />
  </div>
</template>
