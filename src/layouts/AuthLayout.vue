<template>
  <div class="auth-page">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// This layout is specifically for authentication pages
</script>

<style scoped>
.auth-page {
  background-color: var(--tblr-bg-surface);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 