import {
	AssignmentTurnedIn,
	HowToReg,
	PersonAddAlt1,
	Timer,
} from '@mui/icons-material'
import SchoolIcon from '@mui/icons-material/School'
import GroupsIcon from '@mui/icons-material/Groups'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import axiosInstance from '@/api/axiosInstance'

const HRMetrics = ({ hrId }) => {
	const [loading, setLoading] = useState(true)
	const [leads, setLeads] = useState([])

	const fetchLeads = async () => {
		try {
			const response = await axiosInstance.get(`/leads/hr/${hrId}`)
			const data = Array.isArray(response.data) ? response.data : []
			setLeads(data)
		} catch (error) {
			console.error('Error loading recruiter:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchLeads()
	}, [hrId])

	const metricsData = {
		'Кількість кандидатів': leads.length,
		'Не дозвони': leads.filter(
			lead => lead.status && lead.status.name === 'Не дозвон'
		).length,
		Відмова: leads.filter(lead => lead.status && lead.status.name === 'Відмова')
			.length,
		'Співбесіда призначена': leads.filter(
			lead => lead.status && lead.status.name === 'Співбесіда призначена'
		).length,
		Навчаються: leads.filter(
			lead => lead.status && lead.status.name === 'Навчається'
		).length,
		Працюють: leads.filter(lead => lead.status && lead.status.name === 'Працює')
			.length,
	}

	const metrics = [
		{
			label: 'Кількість кандидатів',
			value: metricsData['Кількість кандидатів'] || 0,
			icon: <GroupsIcon fontSize='large' />,
			color: '#5F27CD',
			bgColor: '#EEF2FF',
		},
		{
			label: 'Не дозвони',
			value: metricsData['Не дозвони'] || 0,
			icon: <Timer fontSize='large' />,
			color: '#FF6B6B',
			bgColor: '#FFE5E5',
		},
		{
			label: 'Відмова',
			value: metricsData['Відмова'] || 0,
			icon: <DoDisturbIcon fontSize='large' />,
			color: '#FF6B6B',
			bgColor: '#FFE5E5',
		},
		{
			label: 'Співбесіда призначена',
			value: metricsData['Співбесіда призначена'] || 0,
			icon: <HowToReg fontSize='large' />,
			color: '#2196F3',
			bgColor: '#E3F2FD',
		},
		{
			label: 'Навчаються',
			value: metricsData['Навчаються'] || 0,
			icon: <SchoolIcon fontSize='large' />,
			color: '#5F27CD',
			bgColor: '#EEF2FF',
		},
		{
			label: 'Працюють',
			value: metricsData['Працюють'] || 0,
			icon: <AssignmentTurnedIn fontSize='large' />,
			color: '#4CAF50',
			bgColor: '#E8F5E9',
		},
	]

	return (
		<Box
			display='flex'
			flexWrap='wrap'
			justifyContent='center'
			gap={2}
			sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
		>
			{metrics.map((metric, index) => (
				<Card
					key={index}
					sx={{
						display: 'flex',
						alignItems: 'center',
						px: 2,
						my: 1,
						borderRadius: '16px',
						boxShadow: 3,
						backgroundColor: '#fff',
						flexBasis: 'calc(50% - 16px)',
						maxWidth: '280px',
						height: '100%',
					}}
				>
					<Box
						sx={{
							width: 55,
							height: 55,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: '12px',
							backgroundColor: metric.bgColor,
							color: metric.color,
						}}
					>
						{metric.icon}
					</Box>
					<CardContent sx={{ textAlign: 'left', pl: 2 }}>
						<Typography variant='body2' sx={{ fontSize: 14, color: '#6c757d' }}>
							{metric.label}
						</Typography>
						<Typography variant='h5' fontWeight='bold' sx={{ fontSize: 20 }}>
							{metric.value}
						</Typography>
					</CardContent>
				</Card>
			))}
		</Box>
	)
}

export default HRMetrics
