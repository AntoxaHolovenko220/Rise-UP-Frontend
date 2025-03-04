import { Doughnut } from 'react-chartjs-2'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../../api/axiosInstance'
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

const LeadsTop = () => {
	const [leadsData, setLeadsData] = useState([])

	useEffect(() => {
		const fetchLeads = async () => {
			try {
				const response = await axiosInstance.get('/leads')

				// Подсчет количества лидов в каждом городе
				const cityLeadCounts = response.data.reduce((acc, lead) => {
					const cityName = lead.city?.name?.split(' ')[0] // Берем только первое слово из названия
					if (cityName) {
						acc[cityName] = (acc[cityName] || 0) + 1
					}
					return acc
				}, {})

				// Преобразуем объект в массив, сортируем и берем топ-10
				const formattedLeadsData = Object.entries(cityLeadCounts)
					.map(([city, value]) => ({ city, value }))
					.sort((a, b) => b.value - a.value) // Сортировка по убыванию
					.slice(0, 10) // Берем только топ-10

				setLeadsData(formattedLeadsData)
			} catch (error) {
				console.error('Ошибка загрузки лидов:', error)
			}
		}
		fetchLeads()
	}, [])

	const chartData = {
		labels: leadsData.map(lead => lead.city),
		datasets: [
			{
				data: leadsData.map(lead => lead.value),
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
				Топ 10 міст по кандидатах
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

export default LeadsTop
