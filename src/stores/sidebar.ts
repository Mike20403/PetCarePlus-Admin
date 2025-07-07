import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  // State
  const isCollapsed = ref(false)
  
  // Computed
  const sidebarWidth = computed(() => isCollapsed.value ? 70 : 250)
  const sidebarClass = computed(() => isCollapsed.value ? 'sidebar-collapsed' : '')
  
  // Actions
  function toggleSidebar() {
    isCollapsed.value = !isCollapsed.value
    // Persist state to localStorage
    localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString())
  }
  
  function setSidebarCollapsed(collapsed: boolean) {
    isCollapsed.value = collapsed
    localStorage.setItem('sidebarCollapsed', collapsed.toString())
  }
  
  function initializeSidebarState() {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      isCollapsed.value = savedState === 'true'
    }
  }
  
  return {
    // State
    isCollapsed,
    
    // Computed
    sidebarWidth,
    sidebarClass,
    
    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    initializeSidebarState
  }
}) 