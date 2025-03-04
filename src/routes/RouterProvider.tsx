import AppRoutes from '@routes/AppRoutes'
import { BrowserRouter as Router } from 'react-router-dom'

const RouterProvider = () => {
	return (
		<Router>
			<AppRoutes />
		</Router>
	)
}

export default RouterProvider
