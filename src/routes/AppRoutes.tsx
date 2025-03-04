import ProtectedLayout from '@components/Layout/ProtectedLayout'
import { Loader } from '@components/UI'
import ProtectedRoute from '@routes/ProtectedRoute'
import routes from '@routes/routes'
import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

const AppRoutes = () => {
	const location = useLocation()

	useEffect(() => {
		const currentRoute = routes.find(route => route.path === location.pathname)
		if (currentRoute) {
			document.title = currentRoute.title
		}
	}, [location])

	return (
		<Suspense fallback={<Loader />}>
			<Routes>
				{routes.map(({ path, element: Element, protected: isProtected }) =>
					isProtected ? (
						<Route key={path} element={<ProtectedRoute />}>
							<Route element={<ProtectedLayout />}>
								<Route path={path} element={<Element />} />
							</Route>
						</Route>
					) : (
						<Route key={path} path={path} element={<Element />} />
					)
				)}
			</Routes>
		</Suspense>
	)
}

export default AppRoutes
