import { Email, MoreHoriz } from '@mui/icons-material'
import FacebookIcon from '@mui/icons-material/Facebook'
import ViberIcon from '@mui/icons-material/Phone'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Chip,
	IconButton,
	Typography,
	Button,
	Menu,
	MenuItem,
} from '@mui/material'
import { useState } from 'react'

interface HRCardProps {
	name: string
	position: string
	tags: { label: string; color: string }[]
	imageUrl?: string
	handleEdit: any
	handleDelete: any
	facebookLink: string
	tgUsername: string
	viberPhone: string
	whatsappPhone: string
	email: string
}

const HRCard: React.FC<HRCardProps> = ({
	name,
	position,
	tags,
	imageUrl,
	handleEdit,
	handleDelete,
	facebookLink,
	tgUsername,
	viberPhone,
	whatsappPhone,
	email,
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
	}

	const handleClickTg = () => {
		// Убираем @ из никнейма, если он передан
		const cleanUsername = tgUsername.startsWith('@')
			? tgUsername.slice(1)
			: tgUsername
		window.open(`https://t.me/${cleanUsername}`, '_blank')
	}

	// const handleClickViber = () => {
	// 	// Убираем +, так как Viber требует номер без него
	// 	const cleanNumber = viberPhone.replace('+', '')
	// 	window.open(`viber://chat?number=${cleanNumber}`, '_blank')
	// }

	const handleClickWhatsApp = () => {
		// Убираем +, так как WhatsApp требует номер без него
		const cleanNumber = whatsappPhone.replace('+', '')
		window.open(`https://wa.me/${cleanNumber}`, '_blank')
	}

	const handleClickEmail = () => {
		window.open(
			`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
				email
			)}`,
			'_blank'
		)
	}

	return (
		<Card
			sx={{
				display: 'flex',
				borderRadius: '12px',
				boxShadow: 3,
				p: 3,
				pb: 0,
				maxHeight: 400,
				maxWidth: 800,
				backgroundColor: '#fff',
			}}
		>
			{/* Блок с изображением */}
			<Box
				sx={{
					width: 300,
					height: 300,
					borderRadius: '6px',
					overflow: 'hidden',
					display: 'flex',
					justifyContent: 'center',
					alignContent: 'center',
					mr: 3,
				}}
			>
				<Avatar
					src={imageUrl || ''}
					alt={name}
					sx={{ width: '100%', height: '100%', borderRadius: '12px' }}
				/>
			</Box>

			{/* Основной контент */}
			<CardContent sx={{ flex: 1, p: 0 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 1,
					}}
				>
					<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
						{name}
					</Typography>
					<IconButton onClick={handleMenuOpen}>
						<MoreHoriz />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleMenuClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						sx={{ marginLeft: 6 }}
					>
						<MenuItem onClick={handleEdit}>Редагувати</MenuItem>
						<MenuItem onClick={handleDelete}>Видалити</MenuItem>
					</Menu>
				</Box>

				<Typography variant='body2' color='textSecondary' sx={{ my: 2 }}>
					{position}
				</Typography>

				{/* Теги */}
				<Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
					{tags.map((tag, index) => (
						<Chip
							key={index}
							label={tag.label}
							sx={{
								backgroundColor: tag.color,
								color: '#fff',
								fontWeight: 'bold',
							}}
						/>
					))}
				</Box>

				{/* <Typography variant='body2' color='textSecondary' sx={{ mb: 2 }}>
					{description}
				</Typography> */}

				{/* Иконки мессенджеров с цветами из меню */}
				<Box sx={{ display: 'flex', gap: 1, mt: 17 }}>
					<IconButton sx={{ color: '#FF6B6B' }} onClick={handleClickEmail}>
						<Email />
					</IconButton>
					<IconButton sx={{ color: '#0088cc' }} onClick={handleClickTg}>
						<TelegramIcon />
					</IconButton>
					<IconButton sx={{ color: '#25D366' }} onClick={handleClickWhatsApp}>
						<WhatsAppIcon />
					</IconButton>
					{/* <IconButton
						sx={{ color: '#7360F2' }}
						onClick={() =>
							window.open(`viber://chat?number=${viberPhone}`, '_blank')
						}
					>
						<ViberIcon />
					</IconButton> */}
					<IconButton
						sx={{ color: '#1877F2' }}
						onClick={() => window.open(facebookLink, '_blank')}
					>
						<FacebookIcon />
					</IconButton>
				</Box>
			</CardContent>
		</Card>
	)
}

export default HRCard
