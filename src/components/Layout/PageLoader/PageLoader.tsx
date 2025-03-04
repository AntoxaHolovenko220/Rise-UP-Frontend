import { useState, useEffect, ReactNode } from 'react'
import { Box, LinearProgress } from '@mui/material'
import SettingsImg from '@/assets/obrez owl 2.svg' // Можно передавать через пропсы, если нужно менять

interface PageLoaderProps {
	children: ReactNode
	delay?: number // Время загрузки в миллисекундах (по умолчанию 2000)
}

const PageLoader = ({ children, delay = 2000 }: PageLoaderProps) => {
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), delay)
		return () => clearTimeout(timer)
	}, [delay])

	return (
		<Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
			{/* Контент страницы */}
			{children}

			{/* Экран загрузки */}
			{loading && (
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: '#FFFFFF',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 1000,
					}}
				>
					<img src={SettingsImg} alt='Loading' width={200} />
					<Box sx={{ width: '20%', mt: 2 }}>
						<LinearProgress
							sx={{
								backgroundColor: '#D3B8FF', // Светлый вариант #5F27CD (можно сделать через `lighten()`)
								'& .MuiLinearProgress-bar': {
									backgroundColor: '#5F27CD', // Основной цвет бегущей полоски
								},
							}}
						/>
					</Box>
				</Box>
			)}
		</Box>
	)
}

export default PageLoader
