<template>
  <DashboardLayout title="Notifications" subtitle="Manage system notifications">
    <DataTable
      :headers="notificationTableHeaders"
      :items="mappedNotifications"
      :loading="fetchLoading"
      :hasActions="true"
      :hideSearch="false"
      title="Notifications Management"
      :page="page"
      :perPage="size"
      :totalItems="total"
      :itemsPerPageOptions="[10, 25, 50]"
      @update:search="(val: string) => searchQuery = val"
      @update:pagination="handlePagination"
      @update:sort="() => {}"
    >
      <template #customFilters>
        <div class="d-flex gap-2">
          <select class="form-select w-auto" v-model="selectedType" @change="handleTypeFilter">
            <option value="">All Types</option>
            <option value="BOOKING">Booking</option>
            <option value="PAYMENT">Payment</option>
            <option value="SERVICE">Service</option>
            <option value="SYSTEM">System</option>
            <option value="PROMOTION">Promotion</option>
          </select>
          <select class="form-select w-auto" v-model="selectedStatus" @change="handleStatusFilter">
            <option value="">All Status</option>
            <option value="true">Read</option>
            <option value="false">Unread</option>
          </select>
          
          <!-- Reset Button -->
          <button class="btn btn-outline-secondary btn-sm" @click="resetFilters" title="Reset all filters">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"/>
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>
            </svg>
            Reset
          </button>
        </div>
      </template>
      
      <template #rowActions="{ item }">
        <button class="btn btn-sm btn-outline-primary" @click.prevent="openNotificationDetail(item as unknown as Notification)">
          View
        </button>
      </template>
    </DataTable>

    <NotificationDetailModal ref="detailNotificationModal" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import DataTable, { type DataTableHeader } from '@/components/ui/DataTable.vue'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import type { Notification, NotificationCriteria } from '@/types/notification'
import { NotificationDetailModal } from '@/components/notification'

const { notifications, fetchNotifications, loading } = useNotifications()
const { toast } = useToast()

const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const page = ref(1)
const size = ref(10)
const total = ref(0)
const pages = ref(1)
const fetchLoading = loading

const notificationTableHeaders: DataTableHeader[] = [
  { key: 'title', title: 'Title', sortable: true },
  { key: 'typeLabel', title: 'Type', sortable: true },
  { key: 'message', title: 'Message', sortable: false },
  { key: 'statusLabel', title: 'Status', sortable: true, type: 'status' },
  { key: 'senderInfo', title: 'Sender', sortable: false },
  { key: 'createdAt', title: 'Created', sortable: true, type: 'date' }
]

const mappedNotifications = computed(() => {
  let filtered = notifications.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(notification => 
      notification.title.toLowerCase().includes(query) ||
      notification.message.toLowerCase().includes(query) ||
      notification.type.toLowerCase().includes(query)
    )
  }

  return filtered.map(notification => ({
    ...notification,
    typeLabel: getTypeLabel(notification.type),
    statusLabel: notification.isRead ? 'Read' : 'Unread',
    senderInfo: notification.userIdSend.substring(0, 8) + '...',
    message: notification.message.length > 50 ? notification.message.substring(0, 50) + '...' : notification.message
  }))
})

function getTypeLabel(type: string): string {
  const labels = {
    BOOKING: 'Booking',
    PAYMENT: 'Payment', 
    SERVICE: 'Service',
    SYSTEM: 'System',
    PROMOTION: 'Promotion'
  }
  return labels[type as keyof typeof labels] || type
}

async function fetchAndSetNotifications() {
  try {
    const criteria: NotificationCriteria = {}
    
    if (selectedType.value) {
      criteria.type = selectedType.value as any
    }
    
    if (selectedStatus.value) {
      criteria.isRead = selectedStatus.value === 'true'
    }

    const res = await fetchNotifications(criteria, page.value, size.value, 'createdAt', 'desc')
    
    if (res) {
      total.value = res.total || 0
      pages.value = res.pages || 1
      page.value = res.page || 1
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    toast({ type: 'error', message: 'Failed to fetch notifications' })
  }
}

const handlePagination = (p: number, s: number) => {
  page.value = p
  size.value = s
  fetchAndSetNotifications()
}

const handleTypeFilter = () => {
  page.value = 1
  fetchAndSetNotifications()
}

const handleStatusFilter = () => {
  page.value = 1
  fetchAndSetNotifications()
}

const resetFilters = () => {
  selectedType.value = ''
  selectedStatus.value = ''
  searchQuery.value = ''
  page.value = 1
  fetchAndSetNotifications()
}

onMounted(fetchAndSetNotifications)
watch([searchQuery], () => {
  page.value = 1
  fetchAndSetNotifications()
})

const detailNotificationModal = ref<InstanceType<typeof NotificationDetailModal> | null>(null)

const openNotificationDetail = (notificationData: Notification) => {
  detailNotificationModal.value?.open(notificationData.id)
}
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.btn-list {
  display: flex;
  gap: 0.25rem;
}

@media (max-width: 768px) {
  .table-mobile-md {
    display: block;
  }

  .table-mobile-md thead {
    display: none;
  }

  .table-mobile-md tr {
    display: block;
    border: 1px solid var(--tblr-border-color);
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    padding: 1rem;
  }

  .table-mobile-md td {
    display: block;
    text-align: right;
    padding: 0.5rem 0;
    border: none;
    border-bottom: 1px solid var(--tblr-border-color-light);
  }

  .table-mobile-md td:last-child {
    border-bottom: none;
  }

  .table-mobile-md td[data-label]:before {
    content: attr(data-label);
    float: left;
    font-weight: 600;
    color: var(--tblr-secondary);
  }
}
</style> 