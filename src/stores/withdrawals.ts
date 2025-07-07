import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Withdrawal } from '@/types/api'
import { WithdrawalsService } from '@/api'
import { useToast } from '@/composables/useToast'

export const useWithdrawalsStore = defineStore('withdrawals', () => {
  const withdrawals = ref<Withdrawal[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedWithdrawal = ref<Withdrawal | null>(null)
  const { showToast } = useToast()

  const totalWithdrawals = computed(() => withdrawals.value.length)
  
  const pendingWithdrawals = computed(() => 
    withdrawals.value.filter(withdrawal => withdrawal.status === 'pending')
  )
  
  const approvedWithdrawals = computed(() => 
    withdrawals.value.filter(withdrawal => withdrawal.status === 'approved')
  )
  
  const rejectedWithdrawals = computed(() => 
    withdrawals.value.filter(withdrawal => withdrawal.status === 'rejected')
  )
  
  const totalPendingAmount = computed(() => 
    pendingWithdrawals.value.reduce((sum, withdrawal) => sum + withdrawal.amount, 0)
  )
  
  const totalApprovedAmount = computed(() => 
    approvedWithdrawals.value.reduce((sum, withdrawal) => sum + withdrawal.amount, 0)
  )

  async function fetchWithdrawals() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await WithdrawalsService.getWithdrawals()
      withdrawals.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch withdrawals'
      showToast('Failed to fetch withdrawals', 'error')
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWithdrawalById(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await WithdrawalsService.getWithdrawal(parseInt(id))
      selectedWithdrawal.value = response
      return response
    } catch (err) {
      error.value = 'Failed to fetch withdrawal details'
      showToast('Failed to fetch withdrawal details', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function approveWithdrawal(id: string, notes?: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await WithdrawalsService.approveWithdrawal(
        parseInt(id),
        notes
      )
      
      // Update the withdrawal in the local state
      const index = withdrawals.value.findIndex(withdrawal => withdrawal.id === parseInt(id))
      if (index !== -1) {
        withdrawals.value[index] = response
      }
      
      showToast('Withdrawal approved successfully', 'success')
      return response
    } catch (err) {
      error.value = 'Failed to approve withdrawal'
      showToast('Failed to approve withdrawal', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function rejectWithdrawal(id: string, notes?: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await WithdrawalsService.rejectWithdrawal(
        parseInt(id),
        notes || 'Rejected by admin'
      )
      
      // Update the withdrawal in the local state
      const index = withdrawals.value.findIndex(withdrawal => withdrawal.id === parseInt(id))
      if (index !== -1) {
        withdrawals.value[index] = response
      }
      
      showToast('Withdrawal rejected successfully', 'success')
      return response
    } catch (err) {
      error.value = 'Failed to reject withdrawal'
      showToast('Failed to reject withdrawal', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWithdrawalsByUser(userId: number) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await WithdrawalsService.getWithdrawalsByUser(userId)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch user withdrawals'
      showToast('Failed to fetch user withdrawals', 'error')
      console.error(err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWithdrawalsByStatus(status: Withdrawal['status']) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await WithdrawalsService.getWithdrawalsByStatus(status)
      return response.data
    } catch (err) {
      error.value = `Failed to fetch ${status} withdrawals`
      showToast(`Failed to fetch ${status} withdrawals`, 'error')
      console.error(err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    withdrawals,
    isLoading,
    error,
    selectedWithdrawal,
    totalWithdrawals,
    pendingWithdrawals,
    approvedWithdrawals,
    rejectedWithdrawals,
    totalPendingAmount,
    totalApprovedAmount,
    fetchWithdrawals,
    fetchWithdrawalById,
    approveWithdrawal,
    rejectWithdrawal,
    fetchWithdrawalsByUser,
    fetchWithdrawalsByStatus
  }
})