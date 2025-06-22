<template>
	<Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { defineProps, computed } from 'vue'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

const props = defineProps<{
	labels: string[]
	data: number[]
	label: string
	title: string
}>()

const chartData = computed(() => ({
	labels: props.labels,
	datasets: [
		{
			label: props.label,
			backgroundColor: '#4299e1',
			borderColor: '#4299e1',
			data: props.data,
			tension: 0.3
		}
	]
}))

const chartOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		title: {
			display: true,
			text: props.title
		}
	},
	scales: {
		y: {
			beginAtZero: true
		}
	}
}))
</script>