export interface AuthResponse {
	access_token: string
	role: 'admin' | 'hr'
	id: string
}

export interface DashboardData {
	users: number
	sales: number
}

export interface DecodedToken {
	id: string
	email: string
	role: 'admin' | 'hr'
	rabota_email: string
	rabota_password: string
	iat: number
	exp: number
}
