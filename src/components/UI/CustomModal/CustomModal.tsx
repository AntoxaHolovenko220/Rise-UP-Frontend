import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import { motion } from 'framer-motion'

interface CustomModalProps {
	open: boolean
	onClose: () => void
	title: string
	children: React.ReactNode
	confirmLabel?: string
	onConfirm?: () => void
	width: number
}

const CustomModal: React.FC<CustomModalProps> = ({
	open,
	onClose,
	title,
	children,
	confirmLabel = 'OK',
	onConfirm,
	width,
}) => {
	return (
		<Modal
			open={open}
			onClose={onClose}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.2 }}
			>
				<Box
					sx={{
						width: { width },
						maxHeight: '92vh',
						bgcolor: '#fff',
						// borderRadius: '12px',
						boxShadow: 4,
						p: 3,
						position: 'relative',
						overflowY: 'auto',
					}}
				>
					{/* Закрывающая кнопка */}
					<IconButton
						onClick={onClose}
						sx={{
							position: 'absolute',
							top: 12,
							right: 12,
							color: '#6c757d',
							'&:hover': { color: '#FF6B6B' },
						}}
					>
						<CloseIcon />
					</IconButton>

					{/* Заголовок */}
					<Typography
						variant='h6'
						sx={{ fontWeight: 'bold', color: '#5F27CD', mb: 2 }}
					>
						{title}
					</Typography>

					{/* Контент */}
					<Box sx={{ mb: 3 }}>{children}</Box>

					{/* Кнопки */}
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
						<Button
							onClick={onClose}
							sx={{ color: '#6c757d', textTransform: 'none' }}
						>
							Скасувати
						</Button>
						{onConfirm && (
							<Button
								onClick={onConfirm}
								variant='contained'
								sx={{
									bgcolor: '#5F27CD',
									textTransform: 'none',
								}}
							>
								{confirmLabel}
							</Button>
						)}
					</Box>
				</Box>
			</motion.div>
		</Modal>
	)
}

export default CustomModal
