<template>
  <main class="pagina">
    <slot />
  </main>
</template>

<style scoped>
.pagina {
  box-sizing: border-box;
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}
</style>
