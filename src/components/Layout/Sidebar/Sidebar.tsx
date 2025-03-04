import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import {
	Box,
	CircularProgress,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material'
import { useAuthStore } from '@store/authStore'
import { useSidebarStore } from '@store/sidebarStore'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { menuItems } from './menuItems'

const drawerWidth = 250
const collapsedWidth = 70

const Sidebar = () => {
	const { userRole, setUserRole, setToken } = useAuthStore()
	const { isOpen, toggleSidebar } = useSidebarStore()
	const navigate = useNavigate()
	const location = useLocation()
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	React.useEffect(() => {
		const storedRole = localStorage.getItem('userRole') as 'admin' | 'hr' | null
		if (!userRole && storedRole) {
			setUserRole(storedRole)
		}
	}, [userRole, setUserRole])

	const links = menuItems[userRole || 'hr'] || []

	const handleLogout = async () => {
		setIsLoggingOut(true)
		toast.info('Выход из аккаунта...')

		setTimeout(() => {
			localStorage.removeItem('token')
			localStorage.removeItem('userRole')
			setToken(null)
			setUserRole(null)
			setIsLoggingOut(false)
			toast.success('Вы успешно вышли!')
			navigate('/')
		}, 1500)
	}

	return (
		<Drawer
			variant='permanent'
			sx={{
				width: isOpen ? drawerWidth : collapsedWidth,
				flexShrink: 0,
				transition: 'width 0.3s ease-in-out',
				'& .MuiDrawer-paper': {
					width: isOpen ? drawerWidth : collapsedWidth,
					boxSizing: 'border-box',
					backgroundColor: '#f8f9fc',
					borderRight: '1px solid #e0e0e0',
					transition: 'width 0.3s ease-in-out',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					height: '100vh',
					overflow: 'hidden',
				},
			}}
		>
			{/* Верхняя часть меню */}
			<Box sx={{ width: '100%' }}>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: isOpen ? 'space-between' : 'center',
						p: 2,
					}}
				>
					<Typography
						variant='h6'
						sx={{
							fontWeight: 'bold',
							background: 'linear-gradient(to right, #FF6B6B, #5F27CD)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							display: isOpen ? 'block' : 'none',
						}}
					>
						Rise UP
					</Typography>
					<IconButton
						onClick={toggleSidebar}
						sx={{
							borderRadius: '50%',
							backgroundColor: '#e0e0e0',
							'&:hover': { backgroundColor: '#d6d6d6' },
						}}
					>
						<MenuOpenIcon />
					</IconButton>
				</Box>
			</Box>

			{/* Контейнер для списка (чтобы не появлялся скролл) */}
			<Box
				sx={{
					flexGrow: 1,
					width: '100%',
					overflowY: 'auto',
					scrollbarWidth: 'none',
					'&::-webkit-scrollbar': { display: 'none' },
				}}
			>
				<List sx={{ width: '100%' }}>
					{links.map(({ label, path, icon }) => (
						<ListItemButton
							key={label}
							onClick={() => navigate(path)}
							sx={{
								mb: 1,
								backgroundColor:
									location.pathname === path ? '#eef2ff' : 'transparent',
								'&:hover': { backgroundColor: '#eef2ff' },
								justifyContent: isOpen ? 'flex-start' : 'center',
							}}
						>
							<ListItemIcon
								sx={{
									color: location.pathname === path ? '#5F27CD' : '#6c757d',
									minWidth: 40,
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								{React.createElement(icon)}
							</ListItemIcon>

							<ListItemText
								primary={label}
								sx={{
									color: location.pathname === path ? '#5F27CD' : '#6c757d',
									fontWeight: location.pathname === path ? 'bold' : 'normal',
									display: isOpen ? 'block' : 'none',
								}}
							/>
						</ListItemButton>
					))}
				</List>
			</Box>

			{/* Кнопка выхода (закреплена внизу) */}
			<Box sx={{ width: '100%', pb: 2 }}>
				<ListItemButton
					onClick={handleLogout}
					sx={{
						width: '100%',
						mx: 'auto',
						backgroundColor: 'transparent',
						'&:hover': { backgroundColor: '#ffeded' },
						justifyContent: isOpen ? 'flex-start' : 'center',
					}}
				>
					<ListItemIcon
						sx={{
							color: '#d32f2f',
							minWidth: 40,
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{isLoggingOut ? (
							<CircularProgress size={20} sx={{ color: '#d32f2f' }} />
						) : (
							<ExitToAppIcon />
						)}
					</ListItemIcon>

					<ListItemText
						primary='Вийти'
						sx={{
							color: '#d32f2f',
							fontWeight: 'bold',
							display: isOpen ? 'block' : 'none',
						}}
					/>
				</ListItemButton>
			</Box>
		</Drawer>
	)
}

export default Sidebar
