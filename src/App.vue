<template>
	<div class="page">
		<Header />
		<Sidebar />
		<div class="page-wrapper">
			<RouterView />
		</div>
	</div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>
