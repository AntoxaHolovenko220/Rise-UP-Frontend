import { CssBaseline } from '@mui/material'
import RouterProvider from '@routes/RouterProvider'
import { useAuthStore } from '@store/authStore'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
	const { token } = useAuthStore()

	return (
		<>
			<CssBaseline />
			<ToastContainer position='top-right' autoClose={3000} />
			<RouterProvider />
			{/* {token && <p>User is logged in</p>} */}
		</>
	)
}

export default App
