<template>
  <DashboardLayout title="Terms & Policies" subtitle="Manage legal documents and policies">
    <template #actions>
      <button v-if="authStore.hasRole('ADMIN')" @click="openCreateTermModal" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        New Document
      </button>
    </template>

    <div class="row row-cards">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Terms & Policies Management</h3>
            <div class="card-actions">
              <div class="d-flex">
                <input type="search" class="form-control me-3" placeholder="Search documents..." aria-label="Search documents">
                <select class="form-select w-auto me-3">
                  <option value="">All Types</option>
                  <option value="USER_TERMS">Terms of Service</option>
                  <option value="PRIVACY_POLICY">Privacy Policy</option>
                  <option value="REFUND_POLICY">Refund Policy</option>
                  <option value="OTHER">Other</option>
                </select>
                <select class="form-select w-auto">
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-vcenter table-mobile-md card-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Language</th>
                  <th>Created</th>
                  <th class="w-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="term in terms" :key="term.id">
                  <td data-label="Document">
                    <div class="d-flex py-1 align-items-center">
                      <span class="avatar me-2" style="background-image: url(https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=40&h=40&fit=crop&crop=face)"></span>
                      <div class="flex-fill">
                        <div class="font-weight-medium">{{ term.title }}</div>
                        <div class="text-secondary">ID: {{ term.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Type">
                    <span class="badge bg-azure">{{ getTypeLabel(term.type) }}</span>
                  </td>
                  <td data-label="Version">
                    <div>{{ term.version }}</div>
                  </td>
                  <td data-label="Status">
                    <span class="badge" :class="{
                      'bg-green': term.isActive,
                      'bg-secondary': !term.isActive
                    }">{{ term.isActive ? 'Active' : 'Inactive' }}</span>
                  </td>
                  <td data-label="Language">
                    <div>{{ term.language }}</div>
                  </td>
                  <td data-label="Created">
                    <div>{{ term.createdAt }}</div>
                  </td>
                  <td>
                    <div class="btn-list flex-nowrap">
                      <a href="#" class="btn btn-sm" @click.prevent="openEditTermModal(term)">
                        Edit
                      </a>
                      <div class="dropdown">
                        <button class="btn btn-sm dropdown-toggle align-text-top" data-bs-toggle="dropdown">
                          Actions
                        </button>
                        <div class="dropdown-menu dropdown-menu-end">
                          <a class="dropdown-item" href="#" @click.prevent="openEditTermModal(term)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon dropdown-item-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                              <path d="M16 5l3 3" />
                            </svg>
                            Edit Document
                          </a>
                          <a class="dropdown-item" href="#" @click.prevent="deleteTerm()">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon dropdown-item-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M4 7l16 0" />
                              <path d="M10 11l0 6" />
                              <path d="M14 11l0 6" />
                              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                            Delete Document
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
            <p class="m-0 text-secondary">Showing <span>1</span> to <span>{{ terms.length }}</span> of <span>{{ terms.length }}</span> entries</p>
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
import { useAuthStore } from '@/stores/auth'
import { useTerms } from '@/hooks/useTerms'
import type { Term } from '@/types/term'

const authStore = useAuthStore()
const { terms, fetchTerms } = useTerms()
const showTermModal = ref(false)
const currentTerm = ref<Term | null>(null)

const openCreateTermModal = () => {
	currentTerm.value = null
	showTermModal.value = true
}

const openEditTermModal = (term: Term) => {
	currentTerm.value = term
	showTermModal.value = true
}

const deleteTerm = async () => {
	if (confirm('Are you sure you want to delete this document?')) {
		await fetchTerms()
	}
}

const getTypeLabel = (type: string) => {
	const typeMap: Record<string, string> = {
		'terms': 'Terms of Service',
		'privacy': 'Privacy Policy',
		'refund': 'Refund Policy',
		'other': 'Other'
	}
	return typeMap[type] || type
}

onMounted(() => {
	fetchTerms()
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