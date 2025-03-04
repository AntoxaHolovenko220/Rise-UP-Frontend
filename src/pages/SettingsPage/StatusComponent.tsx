import { Box, Typography, TextField, Popover } from '@mui/material'
import { InfoBlock } from '@/components/Layout'
import { CustomModal, DynamicTable, Input } from '@/components/UI'
import StatusesSearchBar from './StatusesSearchBar'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosInstance from '@/api/axiosInstance'
import { SketchPicker } from 'react-color'

const schema = yup.object().shape({
	name: yup.string().required("Поле обов'язкове до заповнення"),
	color: yup.string().required("Поле обов'язкове до заповнення"),
})

const StatusComponent = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [color, setColor] = useState('#FFFFFF')
	const [anchorEl, setAnchorEl] = useState(null)
	const [editId, setEditId] = useState('')
	const [status, setStatus] = useState<any>(null)
	const [tableKey, setTableKey] = useState(0)

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const handleChangeComplete = color => {
		setColor(color.hex)
	}
	const handleOpenModal = () => setIsModalOpen(true)
	const handleCloseModal = () => setIsModalOpen(false)
	const handleOpenEditModal = () => setIsEditModalOpen(true)
	const handleCloseEditModal = () => setIsEditModalOpen(false)

	// useForm с валидацией через yup
	const {
		control,
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
		defaultValues: useMemo(
			() => ({
				name: '',
				color: '',
			}),
			[]
		),
	})

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const response = await axiosInstance.get(`/statuses/status/${editId}`)

				setStatus(response.data)
			} catch (error) {
				console.error('Error loading recruiter:', error)
			}
		}
		fetchStatus()
	}, [editId])

	useEffect(() => {
		if (status) {
			setValue('name', status.name || '')
			setValue('color', status.color || '')
		}
	}, [status, setValue])

	const onSubmit = async (data: any) => {
		console.log('Form data:', data) // Логируем данные формы
		const formData = new FormData()
		// Добавляем поля
		Object.entries(data).forEach(([key, value]) => {
			if (value) formData.append(key, String(value))
		})

		console.log('FormData:', formData)

		try {
			const response = await axiosInstance.post('/statuses/create', formData)
			toast.success('Статус створений успішно!')
			setIsModalOpen(false)
			setTableKey(prev => prev + 1) // Триггерим обновление таблицы
		} catch (error) {
			console.error('Error:', error)
			toast.error(error?.response?.data?.message || 'Помилка створення статусу')
		}
	}

	const onSubmitEdit = async (data: any) => {
		console.log('Form data:', data) // Логируем данные формы
		const formData = new FormData()
		// Добавляем поля
		Object.entries(data).forEach(([key, value]) => {
			if (value) formData.append(key, String(value))
		})

		console.log('FormData:', formData)

		try {
			const response = await axiosInstance.patch(
				`/statuses/${editId}`,
				formData
			)
			toast.success('Статус редагований успішно!')
			setIsEditModalOpen(false)
			setTableKey(prev => prev + 1) // Триггерим обновление таблицы
		} catch (error) {
			console.error('Error:', error)
			toast.error(
				error?.response?.data?.message || 'Статус редагований успішно'
			)
		}
	}

	return (
		<Box
			sx={{
				width: '100%',
				padding: 2,
				display: 'flex',
				flexDirection: 'column',
				p: 0,
			}}
		>
			<Box sx={{ display: 'flex', gap: 2 }}>
				<StatusesSearchBar
					onSearch={setSearchTerm}
					onAddStatus={handleOpenModal}
				/>
			</Box>
			<Box sx={{ display: 'flex', gap: 2 }}>
				{/* Таблица городов */}
				<DynamicTable
					key={tableKey}
					url='/statuses'
					excludeColumns={['_id', '__v']}
					searchQuery={searchTerm}
					onEdit={status => {
						setEditId(status._id)
						handleOpenEditModal()
					}}
				/>
			</Box>

			{/* Модалка для создания */}
			<CustomModal
				open={isModalOpen}
				onClose={handleCloseModal}
				title='Створити статус'
				onConfirm={handleSubmit(onSubmit)}
				confirmLabel='Створити'
				width={700}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					{/* Поля формы */}
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Box sx={{ width: '100%' }}>
							<Typography sx={{ mb: -2 }}>Назва статусу</Typography>
							<Input
								placeholder='Введіть назву статусу'
								{...register('name')}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Box>
						<Box sx={{ width: '100%' }}>
							<Typography>Колір</Typography>
							<TextField
								value={color}
								onClick={handleClick}
								sx={{ width: '100%' }}
								{...register('color')}
								error={!!errors.color}
								helperText={errors.color?.message}
								InputProps={{
									readOnly: true,
									style: {
										cursor: 'pointer',
										backgroundColor: color,
									},
								}}
							/>
							<Popover
								open={Boolean(anchorEl)}
								anchorEl={anchorEl}
								onClose={handleClose}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							>
								<SketchPicker
									color={color}
									onChangeComplete={handleChangeComplete}
								/>
							</Popover>
						</Box>
					</Box>
				</Box>
			</CustomModal>

			{/* Модалка для редактирования */}
			<CustomModal
				open={isEditModalOpen}
				onClose={handleCloseEditModal}
				title='Редагувати статус'
				onConfirm={handleSubmit(onSubmitEdit)}
				confirmLabel='Редагувати'
				width={700}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					{/* Поля формы */}
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Box sx={{ width: '100%' }}>
							<Typography sx={{ mb: -2 }}>Назва статусу</Typography>
							<Input
								placeholder='Введіть назву статусу'
								{...register('name')}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Box>
						<Box sx={{ width: '100%' }}>
							<Typography>Колір</Typography>
							<TextField
								value={color}
								onClick={handleClick}
								sx={{ width: '100%' }}
								{...register('color')}
								error={!!errors.color}
								helperText={errors.color?.message}
								InputProps={{
									readOnly: true,
									style: {
										cursor: 'pointer',
										backgroundColor: color,
									},
								}}
							/>
							<Popover
								open={Boolean(anchorEl)}
								anchorEl={anchorEl}
								onClose={handleClose}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							>
								<SketchPicker
									color={color}
									onChangeComplete={handleChangeComplete}
								/>
							</Popover>
						</Box>
					</Box>
				</Box>
			</CustomModal>
		</Box>
	)
}

export default StatusComponent
