import { useAuthStore } from '@/store/authStore'
import type { AuthResponse, DecodedToken } from '@/types'
import { jwtDecode } from 'jwt-decode'
import axiosInstance from './axiosInstance'

export const login = async (
	email: string,
	password: string
): Promise<AuthResponse> => {
	const response = await axiosInstance.post<AuthResponse>('/auth/login', {
		email,
		password,
	})

	console.log('🔍 Ответ сервера:', response.data)

	const { access_token } = response.data
	const {
		setToken,
		setUserRole,
		setUserId,
		setRabotaEmail,
		setRabotaPassword,
	} = useAuthStore.getState()

	setToken(access_token)

	try {
		const decoded: DecodedToken = jwtDecode(access_token)
		const decodedRole = decoded.role?.toLowerCase()
		const decodedId = decoded.id
		const role: 'admin' | 'hr' =
			decodedRole === 'admin' || decodedRole === 'hr' ? decodedRole : 'hr'
		const rabota_email = decoded.rabota_email
		const rabota_password = decoded.rabota_password

		setUserRole(role)
		setUserId(decodedId)
		setRabotaEmail(rabota_email)
		setRabotaPassword(rabota_password)

		localStorage.setItem('userRole', role)
	} catch (error) {
		console.error('❌ Ошибка при декодировании токена:', error)
	}

	return response.data
}
