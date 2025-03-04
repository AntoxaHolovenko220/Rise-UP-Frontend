import { create } from 'zustand'

interface AuthState {
	token: string | null
	setToken: (token: string | null) => void
	userRole: 'admin' | 'hr' | null
	setUserRole: (userRole: 'admin' | 'hr' | null) => void
	userId: string | null
	setUserId: (userId: string | null) => void
	rabotaEmail: string | null
	setRabotaEmail: (rabotaEmail: string | null) => void
	rabotaPassword: string | null
	setRabotaPassword: (rabotaPassword: string | null) => void
}

export const useAuthStore = create<AuthState>(set => ({
	token: localStorage.getItem('token') || null,
	userRole: (localStorage.getItem('userRole') as 'admin' | 'hr') || null,
	userId: localStorage.getItem('userId') || null,
	rabotaEmail: localStorage.getItem('rabotaEmail') || null,
	rabotaPassword: localStorage.getItem('rabotaPassword') || null,

	setToken: token => {
		if (token) {
			localStorage.setItem('token', token)
		} else {
			localStorage.removeItem('token')
		}
		set({ token })
	},

	setUserRole: userRole => {
		console.log('🛠 Сохранение роли в Zustand:', userRole)

		if (userRole !== 'admin' && userRole !== 'hr') {
			console.warn("⚠️ Некорректная роль! Устанавливаю 'hr' по умолчанию.")
			userRole = 'hr'
		}

		localStorage.setItem('userRole', userRole)
		set({ userRole })

		console.log('✅ Итоговая роль в Zustand:', userRole)
	},

	setUserId: userId => {
		if (userId) {
			localStorage.setItem('userId', userId)
		} else {
			localStorage.removeItem('userId')
		}
		set({ userId })
	},

	setRabotaEmail: rabotaEmail => {
		if (rabotaEmail) {
			localStorage.setItem('rabotaEmail', rabotaEmail)
		} else {
			localStorage.removeItem('rabotaEmail')
		}
		set({ rabotaEmail })
	},

	setRabotaPassword: rabotaPassword => {
		if (rabotaPassword) {
			localStorage.setItem('rabotaPassword', rabotaPassword)
		} else {
			localStorage.removeItem('rabotaPassword')
		}
		set({ rabotaPassword })
	},
}))
