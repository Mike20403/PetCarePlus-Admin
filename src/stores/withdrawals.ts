import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { WithdrawalsService, type Withdrawal } from '@/api'
import { WithdrawalStatus } from '@/types'
import { useToast } from '@/hooks/useToast'

export const useWithdrawalsStore = defineStore('withdrawals', () => {
  const withdrawals = ref<Withdrawal[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedWithdrawal = ref<Withdrawal | null>(null)
  const { toast } = useToast()

  const totalWithdrawals = computed(() => withdrawals.value.length)

  const pendingWithdrawals = computed(() =>
    withdrawals.value.filter(withdrawal => withdrawal.status === WithdrawalStatus.PENDING)
  )

  const approvedWithdrawals = computed(() =>
    withdrawals.value.filter(withdrawal => withdrawal.status === WithdrawalStatus.APPROVED)
  )

  const rejectedWithdrawals = computed(() =>
    withdrawals.value.filter(withdrawal => withdrawal.status === WithdrawalStatus.REJECTED)
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
      withdrawals.value = response
    } catch (err) {
      error.value = 'Failed to fetch withdrawals'
      toast({
        type: 'error',
        message: 'Failed to fetch withdrawals'
      })
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWithdrawalById(id: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await WithdrawalsService.getWithdrawalById(id)
      selectedWithdrawal.value = response
      return response
    } catch (err) {
      error.value = 'Failed to fetch withdrawal details'
      toast({
        type: 'error',
        message: 'Failed to fetch withdrawal details'
      })
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
        id,
        notes
      )

      // Update the withdrawal in the local state
      const index = withdrawals.value.findIndex(withdrawal => withdrawal.id === id)
      if (index !== -1) {
        withdrawals.value[index] = response
      }

      toast({
        type: 'success',
        message: 'Withdrawal approved successfully'
      })
      return response
    } catch (err) {
      error.value = 'Failed to approve withdrawal'
      toast({
        type: 'error',
        message: 'Failed to approve withdrawal'
      })
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
        id,
        notes || 'Rejected by admin'
      )

      // Update the withdrawal in the local state
      const index = withdrawals.value.findIndex(withdrawal => withdrawal.id === id)
      if (index !== -1) {
        withdrawals.value[index] = response
      }

      toast({
        type: 'success',
        message: 'Withdrawal rejected successfully'
      })
      return response
    } catch (err) {
      error.value = 'Failed to reject withdrawal'
      toast({
        type: 'error',
        message: 'Failed to reject withdrawal'
      })
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWithdrawalsByUser(userId: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await WithdrawalsService.getWithdrawalsByUser(userId)
      return response
    } catch (err) {
      error.value = 'Failed to fetch user withdrawals'
      toast({
        type: 'error',
        message: 'Failed to fetch user withdrawals'
      })
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
      return response
    } catch (err) {
      error.value = `Failed to fetch ${status} withdrawals`
      toast({
        type: 'error',
        message: `Failed to fetch ${status} withdrawals`
      })
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
