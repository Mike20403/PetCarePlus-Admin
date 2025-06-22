<template>
	<div class="page-header d-print-none">
		<div class="container-xl">
			<div class="row g-2 align-items-center">
				<div class="col">
					<h2 class="page-title">Pets Management</h2>
					<div class="text-secondary mt-1">Manage pet profiles and medical records</div>
				</div>
				<div class="col-auto ms-auto d-print-none">
					<div class="btn-list">
						<button class="btn btn-primary d-none d-sm-inline-block">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
								viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
								stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="m0 0h24v24H0z" fill="none" />
								<path d="M12 5l0 14" />
								<path d="M5 12l14 0" />
							</svg>
							Add New Pet
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="page-body">
		<div class="container-xl">
			<div class="card">
				<div class="card-header">
					<h3 class="card-title">Pet Registry</h3>
					<div class="card-actions">
						<div class="input-group">
							<input type="text" class="form-control" placeholder="Search pets..." v-model="searchTerm">
							<button class="btn" type="button">
								<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
									viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
									stroke-linecap="round" stroke-linejoin="round">
									<path stroke="none" d="m0 0h24v24H0z" fill="none" />
									<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
									<path d="M21 21l-6 -6" />
								</svg>
							</button>
						</div>
					</div>
				</div>
				<div class="card-body">
					<div class="table-responsive">
						<table class="table table-vcenter card-table">
							<thead>
								<tr>
									<th>Pet</th>
									<th>Owner</th>
									<th>Species</th>
									<th>Breed</th>
									<th>Age</th>
									<th>Last Visit</th>
									<th>Status</th>
									<th class="w-1">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="pet in filteredPets" :key="pet.id">
									<td>
										<div class="d-flex py-1 align-items-center">
											<span class="avatar me-2" :style="{ backgroundImage: `url(${pet.photo})` }">
												{{ pet.name.substring(0, 2).toUpperCase() }}
											</span>
											<div class="flex-fill">
												<div class="font-weight-medium">{{ pet.name }}</div>
												<div class="text-secondary">{{ pet.microchipId }}</div>
											</div>
										</div>
									</td>
									<td>{{ pet.ownerName }}</td>
									<td>{{ pet.species }}</td>
									<td>{{ pet.breed }}</td>
									<td>{{ pet.age }}</td>
									<td>{{ pet.lastVisit }}</td>
									<td>
										<span class="badge" :class="{
											'bg-success': pet.status === 'Healthy',
											'bg-warning': pet.status === 'Under Treatment',
											'bg-danger': pet.status === 'Critical'
										}">
											{{ pet.status }}
										</span>
									</td>
									<td>
										<div class="btn-list flex-nowrap">
											<button class="btn btn-white btn-sm">View</button>
											<button class="btn btn-white btn-sm">Edit</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Pet {
	id: number
	name: string
	microchipId: string
	ownerName: string
	species: string
	breed: string
	age: string
	lastVisit: string
	status: 'Healthy' | 'Under Treatment' | 'Critical'
	photo: string
}

const searchTerm = ref('')

const pets = ref<Pet[]>([
	{
		id: 1,
		name: 'Buddy',
		microchipId: 'MC001234567',
		ownerName: 'John Smith',
		species: 'Dog',
		breed: 'Golden Retriever',
		age: '3 years',
		lastVisit: '2024-01-15',
		status: 'Healthy',
		photo: ''
	},
	{
		id: 2,
		name: 'Luna',
		microchipId: 'MC001234568',
		ownerName: 'Sarah Johnson',
		species: 'Cat',
		breed: 'Persian',
		age: '2 years',
		lastVisit: '2024-01-20',
		status: 'Under Treatment',
		photo: ''
	},
	{
		id: 3,
		name: 'Max',
		microchipId: 'MC001234569',
		ownerName: 'Mike Davis',
		species: 'Dog',
		breed: 'German Shepherd',
		age: '5 years',
		lastVisit: '2024-01-10',
		status: 'Healthy',
		photo: ''
	}
])

const filteredPets = computed(() => {
	if (!searchTerm.value) return pets.value

	return pets.value.filter(pet =>
		pet.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
		pet.ownerName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
		pet.breed.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
		pet.species.toLowerCase().includes(searchTerm.value.toLowerCase())
	)
})

onMounted(async () => {
	// TODO: Fetch pets data from API
	// const petsData = await fetchPets()
	// pets.value = petsData
})
</script>

<style scoped>
.avatar {
	background-color: var(--tblr-secondary);
	color: white;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	font-size: 0.75rem;
	font-weight: 600;
}

.font-weight-medium {
	font-weight: 500;
}

.btn-list {
	gap: 0.25rem;
}

.card-actions {
	margin-left: auto;
}
</style>