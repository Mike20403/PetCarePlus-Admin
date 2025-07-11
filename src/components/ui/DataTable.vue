<template>
  <div class="card custom-card">
    <div class="card-header">
      <h3 class="card-title">{{ title || 'Data Table' }}</h3>
      <div v-if="$slots.headerActions" class="card-actions">
        <slot name="headerActions"></slot>
      </div>
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-between mb-3">
        <div class="input-icon">
          <input type="text" class="form-control" placeholder="Search..." v-model="searchQuery" @input="onSearch" />
          <span class="input-icon-addon">
            <IconSearch />
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
        <table class="table table-vcenter card-table table-striped custom-table">
          <thead>
            <tr>
              <th v-for="header in headers" :key="header.key" @click="sortBy(header.key)"
                :class="{ 'cursor-pointer': header.sortable }">
                {{ header.title }}
                <span v-if="header.sortable">
                  <span v-if="sortKey === header.key">
                    <span v-if="sortDirection === 'asc'" class="text-primary">&uarr;</span>
                    <span v-else class="text-primary">&darr;</span>
                  </span>
                </span>
              </th>
              <th v-if="hasActions" class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="hasActions ? headers.length + 1 : headers.length" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span class="ms-2">Loading...</span>
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td :colspan="hasActions ? headers.length + 1 : headers.length" class="text-center">
                <div class="empty">
                  <div class="empty-icon">
                    <IconDatabaseOff />
                  </div>
                  <p class="empty-title">No data available</p>
                  <p class="empty-subtitle text-muted">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(item, index) in items" :key="index">
              <td v-for="header in headers" :key="header.key">
                <template v-if="header.formatter">
                  <span v-html="header.formatter(item[header.key], item)"></span>
                </template>
                <template v-else-if="header.type === 'status'">
                  <span
                    :class="'status-badge status-badge-' + (typeof item[header.key] === 'string' ? (item[header.key] as string).toLowerCase() : '')">
                    {{ item[header.key] }}
                  </span>
                </template>
                <template v-else-if="header.type === 'date'">
                  {{ formatDate(item[header.key] as string | Date) }}
                </template>
                <template v-else-if="header.type === 'currency'">
                  {{ formatCurrency(Number(item[header.key])) }}
                </template>
                <template v-else>
                  {{ item[header.key] }}
                </template>
              </td>
              <td v-if="hasActions" class="text-end">
                <slot name="rowActions" :item="item" :index="index"></slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer d-flex align-items-center">
        <div class="me-3">
          <select class="form-select form-select-sm w-auto" :value="itemsPerPage" @change="onItemsPerPageChange">
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <p class="m-0 text-muted">
          Showing <span>{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
          <span>{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span> of
          <span>{{ totalItems }}</span> entries
        </p>
        <ul class="pagination m-0 ms-auto">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" @click.prevent="prevPage">
              <IconChevronLeft class="icon" />
              prev
            </a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" @click.prevent="nextPage">
              next
              <IconChevronRight class="icon" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronRight, IconDatabaseOff, IconSearch } from '@tabler/icons-vue';
import { ref, computed, watch } from 'vue';


export interface DataTableHeader {
  key: string;
  title: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'currency' | 'status';
  formatter?: (value: unknown, item: Record<string, unknown>) => string;
}

const props = defineProps({
  headers: {
    type: Array as () => DataTableHeader[],
    required: true
  },
  items: {
    type: Array as () => Record<string, unknown>[],
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  totalItems: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ''
  },
  hasActions: {
    type: Boolean,
    default: false
  },
  itemsPerPageOptions: {
    type: Array as () => number[],
    default: () => [10, 25, 50, 100]
  },
  page: {
    type: Number,
    default: 1
  }
});

interface DataTableEmits {
  (event: 'update:sort', key: string, direction: 'asc' | 'desc'): void;
  (event: 'update:pagination', page: number, perPage: number): void;
  (event: 'update:search', query: string): void;
  (event: 'update:filter', column: string, value: string): void;
}

const emit = defineEmits<DataTableEmits>();

// Pagination (controlled)
const currentPage = ref(props.page);
const itemsPerPage = ref(props.itemsPerPageOptions[0]);

watch(() => props.page, (val) => {
  currentPage.value = val;
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / itemsPerPage.value));
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:pagination', page, itemsPerPage.value);
  }
}

function prevPage() {
  goToPage(currentPage.value - 1);
}

function nextPage() {
  goToPage(currentPage.value + 1);
}

function onItemsPerPageChange(e: Event) {
  const value = Number((e.target as HTMLSelectElement).value);
  emit('update:pagination', 1, value); // Reset to page 1 on size change
}

// Search
const searchQuery = ref('');
const debouncedSearch = ref();

function onSearch() {
  clearTimeout(debouncedSearch.value);
  debouncedSearch.value = setTimeout(() => {
    emit('update:search', searchQuery.value);
  }, 300);
}

// Filter
const filterColumn = ref('');
const filterValue = ref('');
const debouncedFilter = ref();

function onFilter() {
  clearTimeout(debouncedFilter.value);
  debouncedFilter.value = setTimeout(() => {
    emit('update:filter', filterColumn.value, filterValue.value);
  }, 300);
}

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

function formatDate(date: string | Date): string {
  if (!date) return '';
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCurrency(value: number): string {
  if (value === undefined || value === null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
  gap: var(--spacing-2);
}

.empty {
  text-align: center;
  padding: var(--spacing-6) 0;
}

.empty-icon {
  margin-bottom: var(--spacing-4);
  color: var(--color-neutral-400);
}

.empty-icon svg {
  width: 3rem;
  height: 3rem;
  stroke-width: 1;
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-2);
}

.empty-subtitle {
  max-width: 20rem;
  margin: 0 auto;
}

.table th {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.table th.cursor-pointer:hover {
  background-color: var(--color-neutral-100);
}

.pagination .page-item.active .page-link {
  background-color: var(--color-primary-500);
  border-color: var(--color-primary-500);
}

.pagination .page-link {
  color: var(--color-primary-500);
}

.pagination .page-link:hover {
  background-color: var(--color-neutral-100);
}

.pagination .page-item.disabled .page-link {
  color: var(--color-neutral-400);
}
</style>
