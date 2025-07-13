<template>
  <AppModal :isOpen="isOpen" title="Withdrawal Detail" @close="close" key="withdrawal-detail-modal">
    <div v-if="isLoading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else class="withdrawal-detail-form">
      <div class="row">
        <div class="col-md-6">
          <FormInput disabled label="Amount" name="withdrawal-detail-amount" :modelValue="formatCurrency(withdrawal?.amount)" readonly />
          <FormInput disabled label="Fee" name="withdrawal-detail-fee" :modelValue="formatCurrency(withdrawal?.fee)" readonly />
          <FormInput disabled label="Net Amount" name="withdrawal-detail-netAmount" :modelValue="formatCurrency(withdrawal?.netAmount)" readonly />
          <FormInput disabled label="Status" name="withdrawal-detail-status" :modelValue="withdrawal?.status" readonly />
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Bank Name" name="withdrawal-detail-bankName" :modelValue="withdrawal?.bankName" readonly />
          <FormInput disabled label="Account Number" name="withdrawal-detail-accountNumber" :modelValue="withdrawal?.accountNumber" readonly />
          <FormInput disabled label="Account Holder" name="withdrawal-detail-accountHolderName" :modelValue="withdrawal?.accountHolderName" readonly />
          <FormInput disabled label="Transaction Ref" name="withdrawal-detail-transactionRef" :modelValue="withdrawal?.transactionRef" readonly />
        </div>
      </div>
      <FormTextarea disabled label="Admin Note" name="withdrawal-detail-adminNote" :modelValue="withdrawal?.adminNote" readonly />
      <FormTextarea disabled label="Rejection Reason" name="withdrawal-detail-rejectionReason" :modelValue="withdrawal?.rejectionReason" readonly />
      <div class="row">
        <div class="col-md-6">
          <FormInput disabled label="Created At" name="withdrawal-detail-createdAt" :modelValue="formatDate(withdrawal?.createdAt)" readonly />
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Processed At" name="withdrawal-detail-processedAt" :modelValue="formatDate(withdrawal?.processedAt)" readonly />
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInput, FormTextarea } from '@/components/forms'
import AppModal from '@/components/AppModal.vue'
import type { Withdrawal } from '@/types/withdrawal'
import { useWithdrawals } from '@/hooks/useWithdrawals'

const { getWithdrawal } = useWithdrawals()

const isOpen = ref(false)
const isLoading = ref(false)
const withdrawal = ref<Withdrawal | null>(null)

async function loadWithdrawal(id: string) {
  isLoading.value = true
  try {
    const found = await getWithdrawal(id)
    if (found) withdrawal.value = { ...found }
  } catch (error) {
    console.error('Failed to load withdrawal:', error)
  } finally {
    isLoading.value = false
  }
}

function open(id: string) {
  isOpen.value = true
  loadWithdrawal(id)
}

function close() {
  isOpen.value = false
}

function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function formatDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.withdrawal-detail-form {
  max-width: 100%;
}

.withdrawal-detail-form .form-control[readonly] {
  background-color: var(--tblr-bg-surface-secondary);
  border-color: var(--tblr-border-color);
}

.withdrawal-detail-form .form-control[disabled] {
  background-color: var(--tblr-bg-surface-secondary);
  border-color: var(--tblr-border-color);
  opacity: 1;
}
</style> 