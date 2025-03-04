import { Box, Typography } from '@mui/material'

interface InfoBlockProps {
	title: string
	description: string
	image: string
	backgroundColor?: string
}

const InfoBlock: React.FC<InfoBlockProps> = ({
	title,
	description,
	image,
	backgroundColor = '#F8F9FA', // Дефолтный фон
}) => {
	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'space-between',
				mb: 2,
				padding: 4,
				backgroundColor,
				borderRadius: 2,
			}}
		>
			{/* Текстовая часть */}
			<Box sx={{ maxWidth: '50%' }}>
				<Typography variant='h5' fontWeight='bold' gutterBottom>
					{title}
				</Typography>
				<Typography variant='body1' color='textSecondary'>
					{description}
				</Typography>
			</Box>

			{/* Изображение */}
			<Box sx={{ maxWidth: '40%' }}>
				<img
					src={image}
					alt='Illustration'
					style={{ width: 'auto', height: '150px', maxHeight: 200 }}
				/>
			</Box>
		</Box>
	)
}

export default InfoBlock
