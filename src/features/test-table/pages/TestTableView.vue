<template>
	<div class="container-xl">
		<div class="page-header text-white">
			<div class="row align-items-center">
				<div class="col">
					<h2 class="page-title">Test Data Table</h2>
				</div>
			</div>
		</div>
		<div class="page-body">
			<DataTable :headers="headers" :items="mockData" :loading="loading" @update:sort="handleSort"
				@update:pagination="handlePagination" @update:search="handleSearch" @update:filter="handleFilter" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from '../components/DataTable.vue';

interface MockDataItem {
	id: number;
	name: string;
	age: number;
	city: string;
}

const headers = ref([
	{ key: 'id', title: 'ID', sortable: true },
	{ key: 'name', title: 'Name', sortable: true },
	{ key: 'age', title: 'Age', sortable: true },
	{ key: 'city', title: 'City', sortable: false },
]);

const mockData = ref<MockDataItem[]>([]);
const loading = ref(true);

onMounted(() => {
	// Simulate fetching data
	setTimeout(() => {
		mockData.value = [
			{ id: 1, name: 'Alice', age: 30, city: 'New York' },
			{ id: 2, name: 'Bob', age: 24, city: 'Los Angeles' },
			{ id: 3, name: 'Charlie', age: 35, city: 'Chicago' },
			{ id: 4, name: 'David', age: 28, city: 'Houston' },
			{ id: 5, name: 'Eve', age: 22, city: 'Phoenix' },
			{ id: 6, name: 'Frank', age: 40, city: 'Philadelphia' },
			{ id: 7, name: 'Grace', age: 29, city: 'San Antonio' },
			{ id: 8, name: 'Heidi', age: 31, city: 'San Diego' },
			{ id: 9, name: 'Ivan', age: 26, city: 'Dallas' },
			{ id: 10, name: 'Judy', age: 33, city: 'San Jose' },
			{ id: 11, name: 'Kyle', age: 27, city: 'Austin' },
			{ id: 12, name: 'Liam', age: 38, city: 'Jacksonville' },
			{ id: 13, name: 'Mia', age: 25, city: 'Fort Worth' },
			{ id: 14, name: 'Noah', age: 32, city: 'Columbus' },
			{ id: 15, name: 'Olivia', age: 23, city: 'Charlotte' },
		];
		loading.value = false;
	}, 1000);
});

const handleSort = (key: string, direction: 'asc' | 'desc') => {
	console.log(`Sorting by: ${key}, Direction: ${direction}`);
	// In a real application, you would re-fetch data from the server with sort parameters
};

const handlePagination = (page: number, perPage: number) => {
	console.log(`Page: ${page}, Items per page: ${perPage}`);
	// In a real application, you would re-fetch data from the server with pagination parameters
};

const handleSearch = (query: string) => {
	console.log(`Search query: ${query}`);
	// In a real application, you would re-fetch data from the server with search parameters
};

const handleFilter = (column: string, value: string) => {
	console.log(`Filter column: ${column}, Filter value: ${value}`);
	// In a real application, you would re-fetch data from the server with filter parameters
};
</script>