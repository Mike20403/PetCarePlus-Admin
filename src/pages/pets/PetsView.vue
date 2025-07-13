<template>
  <DashboardLayout title="Pets" subtitle="Manage pets in the system">
    <template #actions>
      <button v-if="authStore.hasRole('ADMIN')" @click="openEditPetModal(null)" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        New Pet
      </button>
    </template>
    <DataTable
      :headers="petTableHeaders"
      :items="mappedPets"
      :loading="fetchLoading"
      :page="currentPage"
      :totalItems="total"
      :itemsPerPageOptions="[10, 25, 50]"
      :hasActions="true"
      @update:search="searchQuery = $event"
      @update:pagination="handlePagination"
      @update:sort="() => {}"
    >
      <template #rowActions="{ item }">
        <button class="btn btn-sm" @click.prevent="openPetDetail(item as unknown as Pet)">View</button>
        <button class="btn btn-sm" @click.prevent="openEditPetModal(item as unknown as Pet)">Edit</button>
        <button class="btn btn-sm btn-danger" @click.prevent="deletePetHandler(item.id as string)">Delete</button>
      </template>
    </DataTable>
    <PetDetailModal ref="detailPetModal" />
    <PetEditModal ref="editPetModal" @save="handleEditSave" />
    <ConfirmationDialog ref="confirmationDialog" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import DataTable, { type DataTableHeader } from '@/components/ui/DataTable.vue'
import { usePets } from '@/hooks/usePets'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/hooks/useToast'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import type { Pet } from '@/types/pet'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import PetEditModal from '@/components/pet/PetEditModal.vue'
import PetDetailModal from '@/components/pet/PetDetailModal.vue'

const authStore = useAuthStore()
const { pets, fetchPets, deletePet, loading, total, currentPage, pageSize } = usePets()
const { toast } = useToast()
const searchQuery = ref('')
const fetchLoading = loading

const petTableHeaders: DataTableHeader[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'species', title: 'Species', sortable: true },
  { key: 'breed', title: 'Breed', sortable: false },
  { key: 'age', title: 'Age', sortable: true },
  { key: 'gender', title: 'Gender', sortable: false },
  { key: 'size', title: 'Size', sortable: false },
  { key: 'createdAt', title: 'Created', sortable: true, type: 'date' }
]

const mappedPets = computed(() => pets.value.map(pet => ({
  ...pet,
  // format fields if needed
})))

async function fetchAndSetPets() {
  await fetchPets(searchQuery.value ? { query: searchQuery.value } : undefined, currentPage.value, pageSize.value)
}

const handlePagination = (p: number, s: number) => {
  currentPage.value = p
  pageSize.value = s
  fetchAndSetPets()
}

onMounted(fetchAndSetPets)
watch([searchQuery, currentPage, pageSize], fetchAndSetPets)

const editPetModal = ref<InstanceType<typeof PetEditModal> | null>(null)
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(null)
const detailPetModal = ref<InstanceType<typeof PetDetailModal> | null>(null)

const openEditPetModal = (pet: Pet | null) => {
  // Close other modals first
  detailPetModal.value?.close()
  confirmationDialog.value?.close()
  
  editPetModal.value?.open(pet ? pet.id : null)
}

const openPetDetail = (pet: Pet) => {
  // Close other modals first
  editPetModal.value?.close()
  confirmationDialog.value?.close()
  
  detailPetModal.value?.open(pet.id)
}

const deletePetHandler = (petId: string) => {
  console.log('deletePetHandler called with id:', petId)
  confirmationDialog.value?.open(
    'Are you sure you want to delete this pet?',
    'Delete Pet',
    async () => {
      try {
        console.log('Starting delete pet:', petId)
        await deletePet(petId)
        console.log('Delete pet completed, fetching data...')
        await fetchAndSetPets()
        console.log('Fetch completed, showing success toast')
        toast({ type: 'success', message: 'Pet deleted successfully' })
      } catch (error) {
        console.error('Error deleting pet:', error)
        toast({ type: 'error', message: 'Failed to delete pet' })
      }
    }
  )
}

const handleEditSave = async () => {
  console.log('handleEditSave called')
  await fetchAndSetPets()
  console.log('fetchAndSetPets completed')
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

.table td:nth-child(3), .table th:nth-child(3) {
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