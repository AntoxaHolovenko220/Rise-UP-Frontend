import axiosInstance from './axiosInstance'

interface DashboardData {
	users: number
	sales: number
}

export const getDashboardData = async (): Promise<DashboardData> => {
	const response = await axiosInstance.get<DashboardData>('/dashboard')
	return response.data
}
