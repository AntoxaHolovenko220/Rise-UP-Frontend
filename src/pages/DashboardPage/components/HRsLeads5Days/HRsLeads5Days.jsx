import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Bar } from 'react-chartjs-2'

import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
} from 'chart.js'
import { Box, Typography } from '@mui/material'
import axiosInstance from '../../../../api/axiosInstance'
import dayjs from 'dayjs'

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement
)

const HRsLeads5Days = () => {
	const [leadsData, setLeadsData] = useState({
		labels: [],
		datasets: [
			{
				label: 'Кандидати',
				data: [],
				borderColor: '#5F27CD',
				backgroundColor: '#5F27CD',
				borderWidth: 2,
				pointRadius: 5,
				pointBackgroundColor: '#5F27CD',
				tension: 0.4,
			},
		],
	})

	useEffect(() => {
		const fetchLeads = async () => {
			try {
				const response = await axiosInstance.get('/leads')

				// Получаем текущую дату
				const now = dayjs()

				// Создаём объект для подсчёта количества лидов за последние 5 дней
				const leadsCount = {}

				// Заполняем объект нулями на 5 дней назад
				for (let i = 9; i >= 0; i--) {
					const date = now.subtract(i, 'day').format('YYYY-MM-DD')
					leadsCount[date] = 0
				}

				// Фильтруем лиды и считаем количество по дням
				response.data.forEach(lead => {
					if (lead.createdAt) {
						const leadDate = dayjs(lead.createdAt).format('YYYY-MM-DD')
						if (leadsCount.hasOwnProperty(leadDate)) {
							leadsCount[leadDate]++
						}
					}
				})

				// Формируем данные для графика
				const formattedData = {
					labels: Object.keys(leadsCount),
					datasets: [
						{
							label: 'Кандидати',
							data: Object.values(leadsCount),
							borderColor: '#5F27CD',
							backgroundColor: '#5F27CD',
							borderWidth: 2,
							pointRadius: 5,
							pointBackgroundColor: '#5F27CD',
							tension: 0.4,
						},
					],
				}

				setLeadsData(formattedData)
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
				ticks: {
					stepSize: 5, // Устанавливаем шаг 5
				},
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
				Кількість кандидатів за останні 10 днів
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
					<Bar data={leadsData} options={chartOptions} />
				</Box>
			</Box>
		</Box>
	)
}

export default HRsLeads5Days
