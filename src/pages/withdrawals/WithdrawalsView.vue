<template>
  <DashboardLayout title="Withdrawals" subtitle="Manage user withdrawal requests">
    <div class="row row-cards">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Withdrawal Requests</h3>
            <div class="card-actions">
              <div class="d-flex">
                <input type="search" class="form-control me-3" placeholder="Search withdrawals..." aria-label="Search withdrawals">
                <select class="form-select w-auto me-3">
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select class="form-select w-auto">
                  <option value="">All Methods</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-vcenter table-mobile-md card-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th class="w-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="withdrawal in withdrawals" :key="withdrawal.id">
                  <td data-label="User">
                    <div class="d-flex py-1 align-items-center">
                      <span class="avatar me-2" :style="`background-image: url(https://ui-avatars.com/api/?name=${encodeURIComponent(withdrawal.userName)})`"></span>
                      <div class="flex-fill">
                        <div class="font-weight-medium">{{ withdrawal.userName }}</div>
                        <div class="text-secondary">ID: {{ withdrawal.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Amount">
                    <div class="font-weight-bold">{{ formatCurrency(withdrawal.amount) }}</div>
                  </td>
                  <td data-label="Payment Method">
                    <div>{{ withdrawal.paymentMethod }}</div>
                    <div class="text-secondary">{{ withdrawal.accountNumber }}</div>
                  </td>
                  <td data-label="Request Date">
                    <div>{{ withdrawal.requestDate }}</div>
                  </td>
                  <td data-label="Status">
                    <span class="badge" :class="{
                      'bg-yellow': withdrawal.status === 'Pending',
                      'bg-green': withdrawal.status === 'Approved',
                      'bg-red': withdrawal.status === 'Rejected'
                    }">{{ withdrawal.status }}</span>
                  </td>
                  <td data-label="Notes">
                    <div class="text-truncate" style="max-width: 150px;">{{ withdrawal.notes }}</div>
                  </td>
                  <td>
                    <div class="btn-list flex-nowrap">
                      <a href="#" class="btn btn-sm" @click.prevent="openWithdrawalDetails(withdrawal)">
                        View
                      </a>
                      <div class="dropdown" v-if="withdrawal.status === 'Pending'">
                        <button class="btn btn-sm dropdown-toggle align-text-top" data-bs-toggle="dropdown">
                          Actions
                        </button>
                        <div class="dropdown-menu dropdown-menu-end">
                          <a class="dropdown-item text-success" href="#" @click.prevent="approveWithdrawal(withdrawal.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon dropdown-item-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M5 12l5 5l10 -10" />
                            </svg>
                            Approve Request
                          </a>
                          <a class="dropdown-item text-danger" href="#" @click.prevent="rejectWithdrawal(withdrawal.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon dropdown-item-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M18 6l-12 12" />
                              <path d="M6 6l12 12" />
                            </svg>
                            Reject Request
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer d-flex align-items-center">
            <p class="m-0 text-secondary">Showing <span>1</span> to <span>{{ withdrawals.length }}</span> of <span>{{ withdrawals.length }}</span> entries</p>
            <ul class="pagination m-0 ms-auto">
              <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1" aria-disabled="true">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M15 6l-6 6l6 6" />
                  </svg>
                  prev
                </a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item disabled">
                <a class="page-link" href="#">
                  next
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 6l6 6l-6 6" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

interface Withdrawal {
	id: number;
	userName: string;
	amount: number;
	status: 'Pending' | 'Approved' | 'Rejected';
	requestDate: string;
	paymentMethod: string;
	accountNumber: string;
	notes: string;
}


const withdrawals = ref<Withdrawal[]>([
	{
		id: 1,
		userName: 'John Doe',
		amount: 250.00,
		status: 'Pending',
		requestDate: '2024-01-15',
		paymentMethod: 'Bank Transfer',
		accountNumber: '**** **** **** 1234',
		notes: 'Regular withdrawal request'
	},
	{
		id: 2,
		userName: 'Jane Smith',
		amount: 180.50,
		status: 'Approved',
		requestDate: '2024-01-14',
		paymentMethod: 'PayPal',
		accountNumber: 'jane@example.com',
		notes: 'Service commission withdrawal'
	},
	{
		id: 3,
		userName: 'Mike Johnson',
		amount: 95.75,
		status: 'Rejected',
		requestDate: '2024-01-13',
		paymentMethod: 'Bank Transfer',
		accountNumber: '**** **** **** 5678',
		notes: 'Insufficient service history'
	}
])

const showWithdrawalModal = ref(false)
const currentWithdrawal = ref<Withdrawal | null>(null)

const openWithdrawalDetails = (withdrawal: Withdrawal) => {
	currentWithdrawal.value = withdrawal
	showWithdrawalModal.value = true
}

const approveWithdrawal = (withdrawalId: number) => {
	if (confirm('Are you sure you want to approve this withdrawal request?')) {
		const withdrawal = withdrawals.value.find(w => w.id === withdrawalId)
		if (withdrawal) {
			withdrawal.status = 'Approved'
		}
	}
}

const rejectWithdrawal = (withdrawalId: number) => {
	const reason = prompt('Please provide a reason for rejection:')
	if (reason) {
		const withdrawal = withdrawals.value.find(w => w.id === withdrawalId)
		if (withdrawal) {
			withdrawal.status = 'Rejected'
			withdrawal.notes = reason
		}
	}
}

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(amount)
}

onMounted(() => {
	// Initialize withdrawals data
	console.log('Withdrawals view mounted')
})
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