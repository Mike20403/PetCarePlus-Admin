<template>
  <AppModal :isOpen="isOpen" :title="modalTitle" @close="close" :key="`withdrawal-action-modal-${actionType}`">
    <div v-if="loading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <form v-else @submit.prevent="onSubmit" class="withdrawal-action-form">
      <div class="alert" :class="alertClass">
        <h4>{{ actionTitle }}</h4>
        <p>{{ actionDescription }}</p>
      </div>

      <div class="withdrawal-summary mb-3">
        <div class="row">
          <div class="col-12">
            <strong>Withdrawal ID:</strong> {{ withdrawalId }}
          </div>
        </div>
      </div>

      <FormTextarea 
        v-if="actionType === 'approve'"
        label="Admin Note" 
        name="withdrawal-action-adminNote" 
        v-model="form.adminNote" 
        placeholder="Optional note for approval"
      />
      
      <FormTextarea 
        v-if="actionType === 'reject'"
        label="Rejection Reason" 
        name="withdrawal-action-rejectionReason" 
        v-model="form.rejectionReason" 
        placeholder="Please provide reason for rejection"
        required
      />
      
      <FormTextarea 
        v-if="actionType === 'complete'"
        label="Transaction Note" 
        name="withdrawal-action-transactionNote" 
        v-model="form.transactionNote" 
        placeholder="Bank transfer reference or notes"
      />

      <div class="form-actions d-flex gap-2 mt-3">
        <button type="submit" class="btn" :class="buttonClass" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ actionButton }}
        </button>
        <button type="button" class="btn btn-secondary" @click="close" :disabled="loading">Cancel</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FormTextarea } from '@/components/forms'
import { useWithdrawals } from '@/hooks/useWithdrawals'
import { useToast } from '@/hooks/useToast'
import AppModal from '@/components/AppModal.vue'

type ActionType = 'approve' | 'reject' | 'complete'

const emit = defineEmits(['success'])
const { approveWithdrawal, rejectWithdrawal, completeWithdrawal } = useWithdrawals()
const { toast } = useToast()

const loading = ref(false)
const isOpen = ref(false)
const actionType = ref<ActionType>('approve')
const withdrawalId = ref('')

const form = ref({
  adminNote: '',
  rejectionReason: '',
  transactionNote: ''
})

const modalTitle = computed(() => {
  switch (actionType.value) {
    case 'approve': return 'Approve Withdrawal'
    case 'reject': return 'Reject Withdrawal'
    case 'complete': return 'Complete Withdrawal'
    default: return 'Withdrawal Action'
  }
})

const actionTitle = computed(() => {
  switch (actionType.value) {
    case 'approve': return 'Approve this withdrawal request?'
    case 'reject': return 'Reject this withdrawal request?'
    case 'complete': return 'Mark withdrawal as completed?'
    default: return 'Confirm action'
  }
})

const actionDescription = computed(() => {
  switch (actionType.value) {
    case 'approve': return 'This will approve the withdrawal request and allow it to be processed.'
    case 'reject': return 'This will reject the withdrawal request. Please provide a reason.'
    case 'complete': return 'This will mark the withdrawal as completed after bank transfer.'
    default: return ''
  }
})

const alertClass = computed(() => {
  switch (actionType.value) {
    case 'approve': return 'alert-info'
    case 'reject': return 'alert-warning'
    case 'complete': return 'alert-success'
    default: return 'alert-info'
  }
})

const buttonClass = computed(() => {
  switch (actionType.value) {
    case 'approve': return 'btn-primary'
    case 'reject': return 'btn-danger'
    case 'complete': return 'btn-success'
    default: return 'btn-primary'
  }
})

const actionButton = computed(() => {
  switch (actionType.value) {
    case 'approve': return 'Approve'
    case 'reject': return 'Reject'
    case 'complete': return 'Complete'
    default: return 'Confirm'
  }
})

function open(id: string, action: ActionType) {
  isOpen.value = true
  actionType.value = action
  withdrawalId.value = id
  form.value = {
    adminNote: '',
    rejectionReason: '',
    transactionNote: ''
  }
}

function close() {
  isOpen.value = false
}



async function onSubmit() {
  if (!withdrawalId.value) {
    console.log('No withdrawal ID available')
    return
  }

  console.log(`Starting ${actionType.value} withdrawal:`, withdrawalId.value)
  loading.value = true
  
  try {
    let result
    switch (actionType.value) {
      case 'approve':
        console.log('Calling approveWithdrawal with data:', {
          adminNote: form.value.adminNote || undefined
        })
        result = await approveWithdrawal(withdrawalId.value, {
          adminNote: form.value.adminNote || undefined
        })
        console.log('Approve result:', result)
        break
      case 'reject':
        if (!form.value.rejectionReason) {
          console.log('Rejection reason is missing')
          toast({ type: 'error', message: 'Rejection reason is required' })
          loading.value = false
          return
        }
        console.log('Calling rejectWithdrawal with data:', {
          rejectionReason: form.value.rejectionReason
        })
        result = await rejectWithdrawal(withdrawalId.value, {
          rejectionReason: form.value.rejectionReason
        })
        console.log('Reject result:', result)
        break
      case 'complete':
        console.log('Calling completeWithdrawal with data:', {
          transactionNote: form.value.transactionNote || undefined
        })
        result = await completeWithdrawal(withdrawalId.value, {
          transactionNote: form.value.transactionNote || undefined
        })
        console.log('Complete result:', result)
        break
    }

    console.log(`${actionType.value} successful, showing toast`)
    toast({ 
      type: 'success', 
      message: `Withdrawal ${actionType.value}d successfully` 
    })
    
    console.log('Emitting success event')
    emit('success')
    
    console.log('Closing modal')
    close()
  } catch (error) {
    console.error(`Error ${actionType.value}ing withdrawal:`, error)
    toast({ 
      type: 'error', 
      message: (error as Error).message || `Failed to ${actionType.value} withdrawal` 
    })
  } finally {
    loading.value = false
    console.log('Loading set to false')
  }
}



defineExpose({
  open,
  close,
})
</script>

<style scoped>
.withdrawal-action-form {
  max-width: 100%;
}

.withdrawal-summary {
  background-color: var(--tblr-bg-surface-secondary);
  padding: 1rem;
  border-radius: 0.375rem;
  border: 1px solid var(--tblr-border-color);
}

.form-actions {
  border-top: 1px solid var(--tblr-border-color);
  padding-top: 1rem;
  margin-top: 1.5rem;
}

.form-actions .btn {
  min-width: 80px;
}

.form-actions .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style> 