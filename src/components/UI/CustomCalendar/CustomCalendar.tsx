import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	startOfMonth,
	startOfWeek,
	subMonths,
} from 'date-fns'
import { useState } from 'react'

const CustomCalendar = () => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [selectedDate, setSelectedDate] = useState(null)
	const today = new Date()

	const startMonth = startOfMonth(currentDate)
	const endMonth = endOfMonth(currentDate)
	const startWeek = startOfWeek(startMonth, { weekStartsOn: 1 })
	const endWeek = endOfWeek(endMonth, { weekStartsOn: 1 })
	const days = eachDayOfInterval({ start: startWeek, end: endWeek })

	const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
	const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
	const handleSelectDate = day => setSelectedDate(day)

	return (
		<Box
			sx={{
				width: 380,
				backgroundColor: '#fff',
				borderRadius: '12px',
				boxShadow: 2,
				padding: 3,
			}}
		>
			{/* Header */}
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				mb={2}
			>
				<Typography
					variant='h6'
					sx={{
						fontWeight: 'bold',
						color: '#5F27CD',
					}}
				>
					{format(currentDate, 'MMMM yyyy')}
				</Typography>
				<Box>
					<IconButton onClick={handlePrevMonth} sx={{ color: '#5F27CD' }}>
						<ArrowBackIos fontSize='small' />
					</IconButton>
					<IconButton onClick={handleNextMonth} sx={{ color: '#5F27CD' }}>
						<ArrowForwardIos fontSize='small' />
					</IconButton>
				</Box>
			</Box>

			{/* Days of the week */}
			<Box
				display='grid'
				gridTemplateColumns='repeat(7, 1fr)'
				gap={1}
				textAlign='center'
				fontWeight='bold'
				color='#6c757d'
			>
				{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
					<Typography key={day} variant='body2'>
						{day}
					</Typography>
				))}
			</Box>

			{/* Calendar days */}
			<Box
				display='grid'
				gridTemplateColumns='repeat(7, 1fr)'
				gap={1}
				mt={1}
				textAlign='center'
			>
				{days.map((day, index) => (
					<Box
						key={index}
						sx={{
							padding: '8px',
							borderRadius: '50%',
							width: '38px',
							height: '38px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: isSameDay(day, selectedDate)
								? '#FF6B6B'
								: isSameDay(day, today)
								? '#5F27CD'
								: 'transparent',
							color:
								isSameDay(day, selectedDate) || isSameDay(day, today)
									? '#fff'
									: '#212121',
							opacity: day.getMonth() === currentDate.getMonth() ? 1 : 0.3,
							cursor: 'pointer',
							'&:hover': { backgroundColor: '#FF9F43' },
						}}
						onClick={() => handleSelectDate(day)}
					>
						{format(day, 'd')}
					</Box>
				))}
			</Box>
		</Box>
	)
}

export default CustomCalendar
