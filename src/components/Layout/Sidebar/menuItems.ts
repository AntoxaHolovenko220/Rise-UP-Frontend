import BarChartIcon from '@mui/icons-material/BarChart'
import DashboardIcon from '@mui/icons-material/Dashboard'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import React from 'react'

export type MenuItemType = {
	label: string
	path: string
	icon: React.ElementType
}

export type UserRoles = 'admin' | 'hr'

export const menuItems: Record<UserRoles, MenuItemType[]> = {
	admin: [
		{ label: 'Дашборд', path: '/dashboard', icon: DashboardIcon },
		{ label: 'Кандидати', path: '/candidates', icon: PeopleIcon },
		{ label: 'Рекрутери', path: '/recruiters', icon: HomeWorkIcon },
		{ label: 'Статистика', path: '/statistics', icon: BarChartIcon },
		{ label: 'Налаштування', path: '/settings', icon: SettingsIcon },
	],
	hr: [
		{ label: 'Дешборд', path: '/dashboard', icon: DashboardIcon },
		{ label: 'Кандидати', path: '/candidates', icon: PeopleIcon },
	],
} as const
