import axios from './axios'

export const getDashboardStats = async () => {
	try {
		const response = await axios.get('/api/dashboard/stats')
		return response.data
	} catch (error) {
		console.error('Error fetching dashboard stats:', error)
		// Return mock data in case of error
		return {
			totalPets: 1247,
			totalAppointments: 89,
			totalCustomers: 523,
			monthlyRevenue: 45678
		}
	}
}

export const getMonthlyAppointments = async () => {
	try {
		const response = await axios.get('/api/dashboard/monthly-appointments')
		return response.data
	} catch (error) {
		console.error('Error fetching monthly appointments:', error)
		// Return mock data in case of error
		return [
			{ month: 'Jan', count: 65 },
			{ month: 'Feb', count: 59 },
			{ month: 'Mar', count: 80 },
			{ month: 'Apr', count: 81 },
			{ month: 'May', count: 56 },
			{ month: 'Jun', count: 55 },
			{ month: 'Jul', count: 40 }
		]
	}
}

export const getMonthlyRevenue = async () => {
	try {
		const response = await axios.get('/api/dashboard/monthly-revenue')
		return response.data
	} catch (error) {
		console.error('Error fetching monthly revenue:', error)
		// Return mock data in case of error
		return [
			{ month: 'Jan', revenue: 10000 },
			{ month: 'Feb', revenue: 12000 },
			{ month: 'Mar', revenue: 15000 },
			{ month: 'Apr', revenue: 13000 },
			{ month: 'May', revenue: 16000 },
			{ month: 'Jun', revenue: 14000 },
			{ month: 'Jul', revenue: 18000 }
		]
	}
}