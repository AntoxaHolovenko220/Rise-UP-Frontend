import { Box, Grid, useMediaQuery, useTheme } from '@mui/material'
import { InfoBlock } from '@/components/Layout'
import {
	Filials,
	ValidLeads,
	LeadsTop,
	HRsTop,
	HRsLeads5Days,
} from './components'
import DashboardImg from '@/assets/Dashboard-bro.svg'
import { PageLoader } from '@/components/Layout'

const DashboardPage = () => {
	const theme = useTheme()
	const isLargeScreen = useMediaQuery(theme.breakpoints.up(1601))

	return (
		<PageLoader delay={2200}>
			<Box
				sx={{
					pt: 2,
					width: '100%',
					height: '100vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 3,
				}}
			>
				<InfoBlock
					title='Огляд Дашборду'
					description='Отримуйте статистику, відстежуйте діяльність рекрутерів і відстежуйте ключові показники ефективності.'
					image={DashboardImg}
					backgroundColor='#F3E5F5'
				/>

				<Grid container spacing={2} sx={{ width: '100%' }}>
					{isLargeScreen ? (
						<>
							<Grid item xs={12} md={4}>
								<Box
									sx={{
										height: 540,
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<LeadsTop />
								</Box>
							</Grid>

							<Grid item xs={12} md={4}>
								<Box
									sx={{
										height: 540,
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<HRsTop />
								</Box>
							</Grid>

							<Grid item xs={12} md={4}>
								<Box
									sx={{
										height: 540,
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<HRsLeads5Days />
								</Box>
							</Grid>

							<Grid item xs={12} md={8}>
								<Box
									sx={{
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<Filials />
								</Box>
							</Grid>

							<Grid item xs={12} md={4}>
								<Box
									sx={{
										height: 714,
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<ValidLeads />
								</Box>
							</Grid>
						</>
					) : (
						<>
							<Grid item xs={12} md={6}>
								<Box
									sx={{
										height: 540,
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<LeadsTop />
								</Box>
							</Grid>

							<Grid item xs={12} md={6}>
								<Box
									sx={{
										height: 540,
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<HRsTop />
								</Box>
							</Grid>

							<Grid item xs={12} md={6}>
								<Box
									sx={{
										height: 540,
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<HRsLeads5Days />
								</Box>
							</Grid>

							<Grid item xs={12} md={6}>
								<Box
									sx={{
										height: 540,
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<ValidLeads />
								</Box>
							</Grid>

							<Grid item xs={12}>
								<Box
									sx={{
										p: 3,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: '#F8F9FC',
										borderRadius: 2,
									}}
								>
									<Filials />
								</Box>
							</Grid>
						</>
					)}
				</Grid>
			</Box>
		</PageLoader>
	)
}

export default DashboardPage
