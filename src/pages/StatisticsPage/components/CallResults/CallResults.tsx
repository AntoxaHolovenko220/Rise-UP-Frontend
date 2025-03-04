import {
	Box,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'
import { useState, useEffect } from 'react'
import axiosInstance from '@/api/axiosInstance'

const CallResults = () => {
	const [loading, setLoading] = useState(true)
	const [hr, setHr] = useState([])
	const [leads, setLeads] = useState([])
	const [data, setData] = useState([])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axiosInstance.get('/users')
				setHr(response.data)
			} catch (error) {
				console.error('Ошибка загрузки пользователей:', error)
			}
		}

		const fetchLeads = async () => {
			try {
				const response = await axiosInstance.get('/leads')
				setLeads(response.data)
			} catch (error) {
				console.error('Ошибка загрузки лидов:', error)
			}
		}

		Promise.all([fetchUsers(), fetchLeads()]).finally(() => setLoading(false))
	}, [])

	useEffect(() => {
		if (hr.length > 0 && leads.length > 0) {
			const hrStats = hr.map(hrUser => {
				const userLeads = leads.filter(lead => lead.hr?._id === hrUser._id)
				return {
					hr: hrUser.nickname,
					calls: userLeads.length,
					missed: userLeads.filter(lead => lead.status?.name === 'Не дозвон')
						.length,
					rejected: userLeads.filter(lead => lead.status?.name === 'Відхилили')
						.length,
					declined: userLeads.filter(lead => lead.status?.name === 'Відмова')
						.length,
					interviewScheduled: userLeads.filter(
						lead => lead.status?.name === 'Співбесіда призначена'
					).length,
					approved: userLeads.filter(
						lead => lead.status?.name === 'Схвалені на навчання'
					).length,
					training: userLeads.filter(lead => lead.status?.name === 'Навчається')
						.length,
					working: userLeads.filter(lead => lead.status?.name === 'Працює')
						.length,
				}
			})
			setData(hrStats)
		}
	}, [hr, leads])

	const columns = [
		'#',
		'HR',
		'Кількість дзвінків',
		'Не дозвонились',
		'Відхилили',
		'Відмовились',
		'Співбесіда призначена',
		'Схвалені на навчання',
		'Навчяються',
		'Працюють',
	]

	if (loading)
		return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />

	return (
		<Box sx={{ width: '100%', height: '100%' }}>
			<TableContainer
				component={Paper}
				sx={{
					width: '100%',
					boxShadow: 3,
					borderRadius: '12px',
					height: '100%',
				}}
			>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell key={index}>{column}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((row, index) => (
							<TableRow key={index}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{row.hr}</TableCell>
								<TableCell>{row.calls}</TableCell>
								<TableCell>{row.missed}</TableCell>
								<TableCell>{row.rejected}</TableCell>
								<TableCell>{row.declined}</TableCell>
								<TableCell>{row.interviewScheduled}</TableCell>
								<TableCell>{row.approved}</TableCell>
								<TableCell>{row.training}</TableCell>
								<TableCell>{row.working}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	)
}

export default CallResults
