import { useAuthStore } from '@store/authStore'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
	const { token } = useAuthStore()

	return token ? <Outlet /> : <Navigate to='/' replace />
}

export default ProtectedRoute
