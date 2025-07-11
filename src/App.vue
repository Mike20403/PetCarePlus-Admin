<template>
  <RouterView />
  <ToastMessage />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastMessage from './components/ui/ToastMessage.vue'
</script>

<style>
/* Global styles */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: var(--tblr-font-sans-serif);
}

#app {
  height: 100%;
}

/* Auth page specific styles */
.auth-page {
  background-color: var(--tblr-bg-surface);
  min-height: 100vh;
}
</style>
