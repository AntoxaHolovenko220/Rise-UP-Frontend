import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
} from 'chart.js'
import { Box, Typography } from '@mui/material'
import axiosInstance from '../../../../api/axiosInstance'
import dayjs from 'dayjs'

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const ValidLeads = () => {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: 'Дійсні кандидати',
				data: [],
				backgroundColor: '#5F27CD',
				borderColor: '#5F27CD',
				borderWidth: 1,
			},
		],
	})

	useEffect(() => {
		const fetchLeads = async () => {
			try {
				const response = await axiosInstance.get('/leads')

				// 🔹 Список валидных статусов
				const validStatuses = [
					'Співбесіда призначена',
					'Схвалені на навчання',
					'Навчається',
					'Працює',
				]

				// 🔹 Определяем последние 5 дней
				const now = dayjs()
				const leadsCount = {}

				for (let i = 9; i >= 0; i--) {
					const date = now.subtract(i, 'day').format('YYYY-MM-DD')
					leadsCount[date] = 0
				}

				// 🔹 Фильтруем лидов по статусу и считаем их по дням
				response.data.forEach(lead => {
					const statusName = lead.status?.name || '' // 🔥 Если статус null → заменяем на пустую строку
					if (lead.updatedAt && validStatuses.includes(statusName)) {
						const leadDate = dayjs(lead.updatedAt).format('YYYY-MM-DD')
						if (leadsCount.hasOwnProperty(leadDate)) {
							leadsCount[leadDate]++
						}
					}
				})

				// 🔹 Формируем данные для графика
				setChartData({
					labels: Object.keys(leadsCount),
					datasets: [
						{
							label: 'Дійсні кандидати',
							data: Object.values(leadsCount),
							backgroundColor: '#5F27CD',
							borderColor: '#5F27CD',
							borderWidth: 1,
						},
					],
				})
			} catch (error) {
				console.error('Ошибка загрузки лидов:', error)
			}
		}

		fetchLeads()
	}, [])

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: 'Дні',
				},
			},
			y: {
				title: {
					display: true,
					text: 'Кількість кандидатів',
				},
				beginAtZero: true,
			},
		},
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				width: '100%',
				height: '100%',
			}}
		>
			<Typography variant='h4' align='center' sx={{ mt: 3, mb: 5 }}>
				Дійсні кандидати за останні 10 днів
			</Typography>
			<Box
				sx={{
					p: 0,
					width: '100%',
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						width: '80%',
						maxWidth: '800px',
						height: '300px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Bar data={chartData} options={chartOptions} />
				</Box>
			</Box>
		</Box>
	)
}

export default ValidLeads
