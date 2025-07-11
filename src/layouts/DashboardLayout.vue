<template>
  <div class="page">
    <AppHeader />
    <AppSidebar />
    <div class="page-wrapper" :style="{ marginLeft: sidebarStore.sidebarWidth + 'px' }">
      <div class="page-body">
        <div class="container-xl">
          <div class="page-header d-print-none">
            <div class="row align-items-center">
              <div class="col">
                <h2 class="page-title">{{ title }}</h2>
                <div class="text-muted mt-1" v-if="subtitle">{{ subtitle }}</div>
              </div>
              <div class="col-auto ms-auto d-print-none" v-if="$slots.actions">
                <div class="btn-list">
                  <slot name="actions"></slot>
                </div>
              </div>
            </div>
          </div>

          <div class="page-content mt-3">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useSidebarStore } from '@/stores/sidebar'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const sidebarStore = useSidebarStore()

onMounted(() => {
  // Initialize sidebar state when layout mounts
  sidebarStore.initializeSidebarState()
})
</script>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
}

.page-wrapper {
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  padding-top: 60px;
  /* Space for header */
}

.page-header {
  margin-bottom: 0;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0;
  color: var(--tblr-dark);
}

.btn-list {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-wrapper {
    margin-left: 0 !important;
    padding-top: 60px;
  }

  .container-xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .page-header .row {
    flex-direction: column;
    gap: 1rem;
  }

  .col-auto {
    align-self: stretch;
  }
}

@media (max-width: 576px) {
  .container-xl {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .page-title {
    font-size: 1.25rem;
  }
}
</style>
