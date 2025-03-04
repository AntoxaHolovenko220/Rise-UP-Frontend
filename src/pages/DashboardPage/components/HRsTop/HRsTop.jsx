import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
} from 'chart.js'
import { Box, Typography } from '@mui/material'
import axiosInstance from '../../../../api/axiosInstance'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

const HRsTop = () => {
	const [hrData, setHrData] = useState([])

	useEffect(() => {
		const fetchLeads = async () => {
			try {
				const response = await axiosInstance.get('/leads')

				// Подсчет количества лидов у каждого HR
				const hrLeadCounts = response.data.reduce((acc, lead) => {
					const hrName = lead.hr?.nickname // Предполагаем, что у лида есть объект hr с полем name
					if (hrName) {
						acc[hrName] = (acc[hrName] || 0) + 1
					}
					return acc
				}, {})

				// Преобразуем в массив, сортируем и берем топ-10
				const formattedHrData = Object.entries(hrLeadCounts)
					.map(([hr, value]) => ({ hr, value }))
					.sort((a, b) => b.value - a.value) // Сортировка по убыванию
					.slice(0, 10) // Берем топ-10

				setHrData(formattedHrData)
			} catch (error) {
				console.error('Ошибка загрузки лидов:', error)
			}
		}
		fetchLeads()
	}, [])

	const chartData = {
		labels: hrData.map(hr => hr.hr),
		datasets: [
			{
				data: hrData.map(hr => hr.value),
				backgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#4BC0C0',
					'#FF9F40',
					'#9966FF',
					'#66FF66',
					'#FF6600',
					'#3366FF',
					'#FF0066',
				],
				borderColor: '#fff',
				borderWidth: 1,
			},
		],
	}

	const chartOptions = {
		cutout: '70%',
		responsive: true,
		plugins: {
			legend: {
				display: false,
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
			}}
		>
			<Typography variant='h4' sx={{ mt: 3, mb: 2 }}>
				Tоп 10 HR по кандидатах
			</Typography>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: 350,
					width: '100%',
					maxWidth: '600px',
				}}
			>
				<Box
					sx={{
						flex: 1,
						width: '100%',
						height: 300,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Doughnut data={chartData} options={chartOptions} />
				</Box>
			</Box>
		</Box>
	)
}

export default HRsTop
