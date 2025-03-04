import axios from 'axios'

const API_URL = 'https://api.workriseup.website/api'
// const API_URL = 'http://localhost:8080/'

const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

axiosInstance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

axiosInstance.interceptors.response.use(
	response => response,
	error => {
		const isAuthError = error.response?.status === 401
		const hasToken = localStorage.getItem('token')

		if (isAuthError && hasToken) {
			localStorage.removeItem('token')
			window.location.href = '/'
		} else if (error.response?.status === 403) {
			alert('You do not have permission to access this resource.')
		}
		return Promise.reject(error)
	}
)

export default axiosInstance

// import axios from 'axios'

// // const API_URL = 'https://api.workriseup.website/'

// const axiosInstance = axios.create({
// 	baseURL: 'https://api.workriseup.website/',
// 	headers: {
// 		'Content-Type': 'application/json',
// 	},
// 	withCredentials: true, // ВАЖНО для CORS
// })

// // 🔥 Добавляем токен в каждый запрос
// axiosInstance.interceptors.request.use(
// 	config => {
// 		const token = localStorage.getItem('token')
// 		if (token) {
// 			config.headers['Authorization'] = `Bearer ${token}`
// 		}
// 		return config
// 	},
// 	error => Promise.reject(error)
// )

// // 🔥 Обработка ошибок авторизации
// axiosInstance.interceptors.response.use(
// 	response => response,
// 	error => {
// 		if (error.response?.status === 401) {
// 			localStorage.removeItem('token')
// 			window.location.href = '/'
// 		} else if (error.response?.status === 403) {
// 			alert('🚫 Нет доступа!')
// 		}
// 		return Promise.reject(error)
// 	}
// )

// export default axiosInstance
