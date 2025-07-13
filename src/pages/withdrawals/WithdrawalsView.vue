<template>
  <DashboardLayout title="Withdrawals" subtitle="Manage user withdrawal requests">
    <DataTable
      :headers="withdrawalTableHeaders"
      :items="mappedWithdrawals"
      :loading="fetchLoading"
      :page="currentPage"
      :totalItems="total"
      :itemsPerPageOptions="[10, 25, 50]"
      :hasActions="true"
      @update:search="searchQuery = $event"
      @update:pagination="handlePagination"
      @update:sort="() => {}"
      title="Withdrawals management"
    >
      <template #rowActions="{ item }">
        <button 
          v-if="item.status === 'PENDING'" 
          class="btn btn-sm btn-primary" 
          @click.prevent="openActionModal(item.id as string, 'approve')"
        >
          Approve
        </button>
        <button 
          v-if="item.status === 'APPROVED'" 
          class="btn btn-sm btn-success" 
          @click.prevent="openActionModal(item.id as string, 'complete')"
        >
          Complete
        </button>
        <button 
          v-if="item.status === 'PENDING'" 
          class="btn btn-sm btn-danger" 
          @click.prevent="openActionModal(item.id as string, 'reject')"
        >
          Reject
        </button>
      </template>
    </DataTable>
    <WithdrawalActionModal ref="actionWithdrawalModal" @success="handleActionSuccess" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import DataTable, { type DataTableHeader } from '@/components/ui/DataTable.vue'
import { useWithdrawals } from '@/hooks/useWithdrawals'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import WithdrawalActionModal from '@/components/withdrawal/WithdrawalActionModal.vue'

const { withdrawals, fetchWithdrawals, loading, total, currentPage, pageSize } = useWithdrawals()
const searchQuery = ref('')
const fetchLoading = loading

const withdrawalTableHeaders: DataTableHeader[] = [
  { key: 'amount', title: 'Amount', sortable: true, type: 'currency' },
  { key: 'netAmount', title: 'Net Amount', sortable: true, type: 'currency' },
  { key: 'status', title: 'Status', sortable: true, type: 'status' },
  { key: 'bankName', title: 'Bank', sortable: false },
  { key: 'accountNumber', title: 'Account', sortable: false },
  { key: 'accountHolderName', title: 'Account Holder', sortable: false },
  { key: 'createdAt', title: 'Created', sortable: true, type: 'date' }
]

const mappedWithdrawals = computed(() => withdrawals.value.map(withdrawal => ({
  ...withdrawal,
  // format fields if needed
})))

async function fetchAndSetWithdrawals() {
  await fetchWithdrawals(searchQuery.value ? { query: searchQuery.value } : undefined, currentPage.value, pageSize.value)
}

const handlePagination = (p: number, s: number) => {
  currentPage.value = p
  pageSize.value = s
  fetchAndSetWithdrawals()
}

onMounted(fetchAndSetWithdrawals)
watch([searchQuery, currentPage, pageSize], fetchAndSetWithdrawals)

const actionWithdrawalModal = ref<InstanceType<typeof WithdrawalActionModal> | null>(null)

const openActionModal = (withdrawalId: string, action: 'approve' | 'reject' | 'complete') => {
  actionWithdrawalModal.value?.open(withdrawalId, action)
}

const handleActionSuccess = async () => {
  console.log('WithdrawalsView: handleActionSuccess called')
  try {
    await fetchAndSetWithdrawals()
    console.log('WithdrawalsView: fetchAndSetWithdrawals completed successfully')
  } catch (error) {
    console.error('WithdrawalsView: Error in fetchAndSetWithdrawals:', error)
  }
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

.dropdown-item-icon {
	margin-right: 0.5rem;
}

.table td:nth-child(4), .table th:nth-child(4) {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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