import { Sidebar } from '@/components/Layout'
import { Box } from '@mui/material'
import { useSidebarStore } from '@store/sidebarStore'
import { Outlet } from 'react-router-dom'

const ProtectedLayout = () => {
	const { isOpen } = useSidebarStore()

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			<Sidebar />
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					height: '100vh', // Фиксированная высота для основного контента
					overflow: 'hidden', // Скрываем переполнение у основного контейнера
					transition: 'margin-left 0.3s ease-in-out',
					marginLeft: isOpen ? 4 : 4,
					marginRight: 4,
				}}
			>
				{/* Обертка с overflow: auto – именно она будет скроллиться */}
				<Box sx={{ height: '100%', overflow: 'auto' }}>
					<Outlet />
				</Box>
			</Box>
		</Box>
	)
}

export default ProtectedLayout
