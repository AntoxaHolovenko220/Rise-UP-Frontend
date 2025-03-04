export const handleApiError = (error: any) => {
	console.error('API Error:', error.response?.data || error.message)
	return error.response?.data?.message || 'Something went wrong'
}
