<template>
  <AppModal :isOpen="isOpen" title="Booking Detail" @close="close" size="lg" key="booking-detail-modal">
    <div v-if="isLoading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else-if="booking" class="booking-detail-form">
      <!-- Customer Information -->
      <div class="row">
        <div class="col-md-6">
          <FormInput disabled label="Customer Name" name="booking-detail-customerName" :modelValue="`${booking.user.name} ${booking.user.lastName}`" readonly />
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Customer Email" name="booking-detail-customerEmail" :modelValue="booking.user.email" readonly />
        </div>
      </div>
      
      <!-- Booking Information -->
      <div class="row">
        <div class="col-md-6">
          <FormInput disabled label="Provider Service" name="booking-detail-providerService" :modelValue="booking.providerService.serviceName" readonly />
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Booking Time" name="booking-detail-bookingTime" :modelValue="formatDate(booking.bookingTime)" readonly />
        </div>
      </div>
      
      <!-- Status Information -->
      <div class="row">
        <div class="col-md-4">
          <FormInput disabled label="Status" name="booking-detail-status" :modelValue="booking.status" readonly />
        </div>
        <div class="col-md-4">
          <FormInput disabled label="Payment Status" name="booking-detail-paymentStatus" :modelValue="booking.paymentStatus" readonly />
        </div>
        <div class="col-md-4">
          <FormInput disabled label="Total Price" name="booking-detail-totalPrice" :modelValue="formatCurrency(booking.totalPrice)" readonly />
        </div>
      </div>
      
      <!-- Pet List -->
      <div class="mb-3">
        <label class="form-label">Pet Services</label>
        <div class="border rounded p-3">
          <div v-for="pet in booking.petList" :key="pet.petId" class="mb-2 pb-2 border-bottom">
            <div class="row">
              <div class="col-md-4">
                <strong>Pet:</strong> {{ pet.petName }}
              </div>
              <div class="col-md-4">
                <strong>Service:</strong> {{ pet.serviceName }}
              </div>
              <div class="col-md-4">
                <strong>Price:</strong> {{ formatCurrency(pet.price) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Additional Information -->
      <FormTextarea disabled label="Notes" name="booking-detail-notes" :modelValue="booking.note || 'No notes'" readonly />
      
      <!-- System Information -->
      <div class="row">
        <div class="col-md-6">
          <FormInput disabled label="Created At" name="booking-detail-createdAt" :modelValue="formatDate(booking.createdAt)" readonly />
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Updated At" name="booking-detail-updatedAt" :modelValue="formatDate(booking.updatedAt)" readonly />
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-muted">Failed to load booking details.</p>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInput, FormTextarea } from '@/components/forms'
import AppModal from '@/components/AppModal.vue'
import type { Booking } from '@/types/booking'
import { useBookings } from '@/hooks/useBookings'
import { useToast } from '@/hooks/useToast'

const { getBooking } = useBookings()
const { toast } = useToast()

const isOpen = ref(false)
const isLoading = ref(false)
const booking = ref<Booking | null>(null)

async function loadBooking(id: string) {
  isLoading.value = true
  try {
    const found = await getBooking(id)
    if (found) {
      booking.value = { ...found }
    } else {
      toast({ type: 'error', message: 'Failed to load booking details' })
    }
  } catch (error) {
    console.error('Failed to load booking:', error)
    toast({ type: 'error', message: 'Failed to load booking details' })
  } finally {
    isLoading.value = false
  }
}

function open(id: string) {
  isOpen.value = true
  loadBooking(id)
}

function close() {
  isOpen.value = false
  booking.value = null
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.booking-detail-form {
  max-width: 100%;
}

.booking-detail-form .form-control[readonly] {
  background-color: var(--tblr-bg-surface-secondary);
  border-color: var(--tblr-border-color);
}

.booking-detail-form .form-control[disabled] {
  background-color: var(--tblr-bg-surface-secondary);
  border-color: var(--tblr-border-color);
  opacity: 1;
}

.border-bottom:last-child {
  border-bottom: none !important;
}
</style> 