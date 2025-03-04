import { Box } from '@mui/material'
import { InfoBlock } from '@/components/Layout'
import SettingsImg from '@/assets/QA engineers-bro 1.svg'
import StatusComponent from './StatusComponent'
import FilialComponent from './FilialComponent'
import { PageLoader } from '@/components/Layout'
import { useRef, useState, useEffect } from 'react'

const SettingsPage = () => {
	const statusRef = useRef(null)
	const [statusHeight, setStatusHeight] = useState(0)

	useEffect(() => {
		const observer = new ResizeObserver(entries => {
			for (let entry of entries) {
				setStatusHeight(entry.contentRect.height) // Обновляем высоту динамически
			}
		})

		if (statusRef.current) {
			observer.observe(statusRef.current)
		}

		return () => {
			observer.disconnect()
		}
	}, [])

	return (
		<PageLoader>
			<Box
				sx={{
					width: '100%',
					padding: 2,
					height: '100vh',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<InfoBlock
					title='Параметри та налаштування'
					description='Налаштуйте свій досвід, керуйте дозволами та налаштуйте параметри системи.'
					image={SettingsImg}
					backgroundColor='#E0F7FA'
				/>
				<Box
					sx={theme => ({
						display: 'flex',
						gap: 3,
						flexDirection: 'row',
						[theme.breakpoints.down(1601)]: {
							flexDirection: 'column',
						},
					})}
				>
					{/* StatusComponent с ref */}
					<Box ref={statusRef} sx={{ flex: 1 }}>
						<StatusComponent />
					</Box>

					{/* FilialComponent с высотой, равной StatusComponent */}
					<Box sx={{ flex: 1, minHeight: statusHeight }}>
						<FilialComponent />
					</Box>
				</Box>
			</Box>
		</PageLoader>
	)
}

export default SettingsPage
