<template>
	<div class="card">
		<div class="card-header">
			<h3 class="card-title">Data Table</h3>
		</div>
		<div class="card-body">
			<div class="d-flex justify-content-between mb-3">
				<div class="input-icon">
					<input type="text" class="form-control" placeholder="Search..." v-model="searchQuery"
						@input="onSearch" />
					<span class="input-icon-addon">
						<!-- Download SVG icon from http://tabler-icons.io/i/search -->
						<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
							stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
							stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
							<path d="M21 21l-6 -6"></path>
						</svg>
					</span>
				</div>
				<div class="ms-auto d-flex">
					<select class="form-select w-auto" v-model="filterColumn">
						<option value="">Filter by column</option>
						<option v-for="header in headers" :key="header.key" :value="header.key">
							{{ header.title }}
						</option>
					</select>
					<input type="text" class="form-control ms-2" placeholder="Filter value..." v-model="filterValue"
						@input="onFilter" :disabled="!filterColumn" />
				</div>
			</div>

			<div class="table-responsive">
				<table class="table table-vcenter card-table table-striped">
					<thead>
						<tr>
							<th v-for="header in headers" :key="header.key" @click="sortBy(header.key)"
								:class="{ 'cursor-pointer': header.sortable }">
								{{ header.title }}
								<span v-if="header.sortable">
									<span v-if="sortKey === header.key">
										<span v-if="sortDirection === 'asc'">&uarr;</span>
										<span v-else>&darr;</span>
									</span>
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="loading">
							<td :colspan="headers.length" class="text-center">Loading...</td>
						</tr>
						<tr v-else-if="paginatedItems.length === 0">
							<td :colspan="headers.length" class="text-center">No data available</td>
						</tr>
						<tr v-else v-for="(item, index) in paginatedItems" :key="index">
							<td v-for="header in headers" :key="header.key">
								{{ item[header.key] }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="card-footer d-flex align-items-center">
				<p class="m-0 text-muted">
					Showing <span>{{ startIndex + 1 }}</span> to <span>{{ endIndex }}</span> of
					<span>{{ filteredItems.length }}</span> entries
				</p>
				<ul class="pagination m-0 ms-auto">
					<li class="page-item" :class="{ disabled: currentPage === 1 }">
						<a class="page-link" href="#" @click.prevent="prevPage">
							<!-- Download SVG icon from http://tabler-icons.io/i/chevron-left -->
							<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
								viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
								stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M15 6l-6 6l6 6"></path>
							</svg>
							prev
						</a>
					</li>
					<li class="page-item" v-for="page in totalPages" :key="page"
						:class="{ active: currentPage === page }">
						<a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
					</li>
					<li class="page-item" :class="{ disabled: currentPage === totalPages }">
						<a class="page-link" href="#" @click.prevent="nextPage">
							next
							<!-- Download SVG icon from http://tabler-icons.io/i/chevron-right -->
							<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
								viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
								stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M9 6l6 6l-6 6"></path>
							</svg>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface DataTableHeader {
	key: string;
	title: string;
	sortable?: boolean;
}

const props = defineProps<{
	headers: DataTableHeader[];
	items: any[];
	loading: boolean;
	totalItems?: number; // Optional, for server-side pagination if needed later
}>();

interface DataTableEmits {
	(event: 'update:sort', key: string, direction: 'asc' | 'desc'): void;
	(event: 'update:pagination', page: number, perPage: number): void;
	(event: 'update:search', query: string): void;
	(event: 'update:filter', column: string, value: string): void;
}

const emit = defineEmits<DataTableEmits>();

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10); // Default items per page

const totalPages = computed(() => {
	return Math.ceil(filteredItems.value.length / itemsPerPage.value);
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() =>
	Math.min(startIndex.value + itemsPerPage.value, filteredItems.value.length)
);

const paginatedItems = computed(() => {
	return filteredItems.value.slice(startIndex.value, endIndex.value);
});

function goToPage(page: number) {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page;
		emit('update:pagination', currentPage.value, itemsPerPage.value);
	}
}

function prevPage() {
	goToPage(currentPage.value - 1);
}

function nextPage() {
	goToPage(currentPage.value + 1);
}

// Search
const searchQuery = ref('');
const debouncedSearch = ref();

function onSearch() {
	clearTimeout(debouncedSearch.value);
	debouncedSearch.value = setTimeout(() => {
		emit('update:search', searchQuery.value);
		currentPage.value = 1; // Reset pagination on search
	}, 300); // Debounce for 300ms
}

// Filter
const filterColumn = ref('');
const filterValue = ref('');
const debouncedFilter = ref();

function onFilter() {
	clearTimeout(debouncedFilter.value);
	debouncedFilter.value = setTimeout(() => {
		emit('update:filter', filterColumn.value, filterValue.value);
		currentPage.value = 1; // Reset pagination on filter
	}, 300); // Debounce for 300ms
}

// Combined Search and Filter Logic
const filteredItems = computed(() => {
	let currentItems = props.items;

	// Apply search
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		currentItems = currentItems.filter((item) =>
			Object.values(item).some((value) =>
				String(value).toLowerCase().includes(query)
			)
		);
	}

	// Apply filter
	if (filterColumn.value && filterValue.value) {
		const column = filterColumn.value;
		const value = filterValue.value.toLowerCase();
		currentItems = currentItems.filter((item) =>
			String(item[column]).toLowerCase().includes(value)
		);
	}

	return currentItems;
});

// Sorting
const sortKey = ref('');
const sortDirection = ref<'asc' | 'desc'>('asc');

function sortBy(key: string) {
	const header = props.headers.find(h => h.key === key);
	if (!header?.sortable) return;

	if (sortKey.value === key) {
		sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
	} else {
		sortKey.value = key;
		sortDirection.value = 'asc';
	}
	emit('update:sort', sortKey.value, sortDirection.value);
}

watch(
	() => props.items,
	() => {
		// Reset pagination to 1 when items change (e.g., new data fetched)
		currentPage.value = 1;
	},
	{ deep: true }
);

// Apply sorting to filtered items
watch([sortKey, sortDirection], () => {
	if (sortKey.value) {
		filteredItems.value.sort((a, b) => {
			const aValue = a[sortKey.value];
			const bValue = b[sortKey.value];

			if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
			return 0;
		});
	}
});
</script>

<style scoped>
.cursor-pointer {
	cursor: pointer;
}
</style>