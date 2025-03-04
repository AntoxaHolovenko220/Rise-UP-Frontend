import axiosInstance from '@api/axiosInstance'
import { handleApiError } from '@utils/apiError'
import { useCallback } from 'react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const useRequest = () => {
	const request = useCallback(
		async <T>(method: HttpMethod, url: string, data?: object): Promise<T> => {
			try {
				const response = await axiosInstance.request<T>({
					method,
					url,
					data,
					validateStatus: status => status >= 200 && status < 300,
				})
				return response.data
			} catch (error) {
				throw handleApiError(error)
			}
		},
		[]
	)
	return { request }
}
