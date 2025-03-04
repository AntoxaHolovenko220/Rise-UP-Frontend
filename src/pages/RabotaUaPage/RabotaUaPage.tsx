import { Box } from '@mui/material'
import ParserBlock from './ParserBlock'
import { useAuthStore } from '@/store/authStore'

const RabotaUaPage = () => {
	const { rabotaEmail, rabotaPassword } = useAuthStore()

	console.log(rabotaEmail)
	console.log(rabotaPassword)

	return (
		<Box
			sx={{
				width: '100%',
				padding: 2,
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}}
		>
			<ParserBlock />
		</Box>
	)
}

export default RabotaUaPage
