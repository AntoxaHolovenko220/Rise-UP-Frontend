import { HRCard, HRMetrics } from '@components/Layout'
import { CustomCalendar, DynamicTable } from '@components/UI'
import { Box, Button, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { InfoBlock } from '@components/Layout'
import StatisticsImg from '@/assets/Business analytics-bro (1).svg'
import CallResults from './components/CallResults'

const StatisticsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleOpenModal = () => setIsModalOpen(true)
	const handleCloseModal = () => setIsModalOpen(false)

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
			<InfoBlock
				title='Сторінка статистики'
				description='Дивіться всю необхідну інформацію про HR зібрану до однієї таблиці.'
				image={StatisticsImg}
				backgroundColor='#FFF3E0' // Светло-оранжевый фон
			/>
			<CallResults />
		</Box>
	)
}

export default StatisticsPage
