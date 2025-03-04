import { create } from 'zustand'

interface SidebarState {
	isOpen: boolean
	toggleSidebar: () => void
	setSidebar: (isOpen: boolean) => void
}

export const useSidebarStore = create<SidebarState>(set => ({
	isOpen: JSON.parse(localStorage.getItem('sidebarOpen') || 'true'),
	toggleSidebar: () => {
		set(state => {
			const newState = !state.isOpen
			localStorage.setItem('sidebarOpen', JSON.stringify(newState))
			return { isOpen: newState }
		})
	},
	setSidebar: (isOpen: boolean) => {
		localStorage.setItem('sidebarOpen', JSON.stringify(isOpen))
		set({ isOpen })
	},
}))
