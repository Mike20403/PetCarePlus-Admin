import { WithdrawalsService, type WithdrawalCriteria } from '@/api/withdrawals.service'
import type { Withdrawal, WithdrawalActionRequest } from '@/types/withdrawal'
import { ref } from 'vue'

export function useWithdrawals() {
  const withdrawals = ref<Withdrawal[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const pages = ref(1)
  const currentPage = ref(1)
  const pageSize = ref(10)

  async function fetchWithdrawals(criteria?: WithdrawalCriteria, page = 1, size = 10, sortBy = 'createdAt', sort: 'asc' | 'desc' = 'desc') {
    loading.value = true
    error.value = null
    try {
      const res = await WithdrawalsService.getWithdrawals(criteria, page, size, sortBy, sort)
      withdrawals.value = res.items
      total.value = res.total
      pages.value = res.pages
      pageSize.value = res.size
      return res
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch withdrawals'
    } finally {
      loading.value = false
    }
  }

  async function getWithdrawal(id: string) {
    return WithdrawalsService.getWithdrawalById(id)
  }

  async function approveWithdrawal(id: string, data?: WithdrawalActionRequest) {
    return WithdrawalsService.approveWithdrawal(id, data)
  }

  async function rejectWithdrawal(id: string, data: WithdrawalActionRequest) {
    return WithdrawalsService.rejectWithdrawal(id, data)
  }

  async function completeWithdrawal(id: string, data?: WithdrawalActionRequest) {
    return WithdrawalsService.completeWithdrawal(id, data)
  }

  return {
    withdrawals, loading, error, total, pages, currentPage, pageSize,
    fetchWithdrawals, getWithdrawal, approveWithdrawal, rejectWithdrawal, completeWithdrawal
  }
} 