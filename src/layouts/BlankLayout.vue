<template>
  <div class="blank-page">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// This layout is for pages that need minimal structure
</script>

<style scoped>
.blank-page {
  min-height: 100vh;
  background-color: var(--tblr-bg-surface);
}
</style> 