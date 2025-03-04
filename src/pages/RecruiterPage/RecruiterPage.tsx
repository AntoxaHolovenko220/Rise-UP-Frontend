import { HRCard, HRMetrics, PageLoader } from '@components/Layout'
import {
	CustomModal,
	CustomCalendar,
	DynamicTable,
	Input,
} from '@components/UI'
import { useEffect, useState, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import {
	Autocomplete,
	Box,
	Typography,
	CircularProgress,
	Button,
	FormControl,
	MenuItem,
	Select,
	TextField,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
} from '@mui/material'
import { toast } from 'react-toastify'

import axiosInstance from '@/api/axiosInstance'
import RecruiterSearchBar from './RecruiterSearchBar'

const RecruiterPage = () => {
	const navigate = useNavigate()
	const { id } = useParams() // Получаем ID из URL
	const [recruiter, setRecruiter] = useState<any>(null)
	const [cities, setCities] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [showSocials, setShowSocials] = useState(false)
	const [openDialog, setOpenDialog] = useState(false)
	const [showRabota, setShowRabota] = useState(false)

	// useForm с валидацией через yup
	const {
		control,
		register,
		handleSubmit,
		setValue,
		watch,
		trigger,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		defaultValues: useMemo(
			() => ({
				nickname: '',
				email: '',
				password: '',
				phone: '',
				firstname: '',
				lastname: '',
				role: 'hr',
				status: 'active',
				city: '',
				telegram: '',
				viber: '',
				whatsapp: '',
				mailto: '',
				facebook: '',
				rabota_email: '',
				rabota_password: '',
			}),
			[]
		),
	})

	const handleOpenModal = () => setIsModalOpen(true)
	const handleCloseModal = () => setIsModalOpen(false)

	// Загружаем список городов
	useEffect(() => {
		const fetchCities = async () => {
			try {
				const response = await axiosInstance.get('/cities')
				setCities(response.data)
			} catch (error) {
				console.error('Ошибка загрузки городов:', error)
			}
		}
		fetchCities()
	}, [])

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.length) {
			setFile(event.target.files[0])
		}
	}

	useEffect(() => {
		if (recruiter) {
			setValue('nickname', recruiter.nickname || '')
			setValue('email', recruiter.email || '')
			setValue('firstname', recruiter.firstname || '')
			setValue('lastname', recruiter.lastname || '')
			setValue('phone', recruiter.phone || '')
			setValue('role', recruiter.role || 'hr')
			setValue('status', recruiter.status || 'active')
			setValue('city', recruiter.city?._id || '')
			setValue('telegram', recruiter.telegram || '')
			setValue('viber', recruiter.viber || '')
			setValue('whatsapp', recruiter.whatsapp || '')
			setValue('facebook', recruiter.facebook || '')
			setValue('mailto', recruiter.mailto || '')
			setValue('rabota_email', recruiter.rabota_email || '')
			setValue('rabota_password', recruiter.rabota_password || '')
		}
	}, [recruiter, setValue])

	const handleAddSocials = () => {
		setShowSocials(true)
	}

	const handleAddRabota = () => {
		setShowRabota(true)
	}

	const onSubmit = async (data: any) => {
		console.log('Form data:', data) // Логируем данные формы

		if (data.whatsapp === '+') {
			data.whatsapp = '' // Если только +, отправляем как пустое поле
		}

		const formData = new FormData()
		// Добавляем поля
		Object.entries(data).forEach(([key, value]) => {
			if (value) formData.append(key, String(value))
		})
		// Добавляем файл
		if (file) formData.append('img', file)

		console.log('FormData:', formData)

		try {
			const response = await axiosInstance.patch(`/users/${id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			fetchRecruiter()
			toast.success('Recruiter edited successfully!')
			setIsModalOpen(false)
		} catch (error) {
			console.error('Error:', error)
			toast.error(error?.response?.data?.message || 'Failed to edit recruiter')
		}
	}

	console.log(errors)

	const fetchRecruiter = async () => {
		try {
			const response = await axiosInstance.get(`/users/user/${id}`)

			setRecruiter(response.data)
		} catch (error) {
			console.error('Error loading recruiter:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchRecruiter()
	}, [id])

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`/users/${recruiter._id}`)
			navigate(`/recruiters`)
			toast.success('Deleted successfully')
			setOpenDialog(false)
		} catch (err: any) {
			toast.error('Error deleting recruiter:', err)
		}
	}

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	if (loading)
		return (
			<PageLoader>
				<CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
			</PageLoader>
		)
	if (!recruiter)
		return <Typography textAlign='center'>Recruiter not found</Typography>

	const name = `${recruiter.firstname} ${recruiter.lastname} (${recruiter.nickname})`
	const img = `http://localhost:8080${recruiter.img}`
	console.log(recruiter._id)

	// const API_URL = 'https://api.workriseup.website'
	// const img = recruiter.img.startsWith('/uploads/')
	// 	? `${API_URL}${recruiter.img}`
	// 	: `${API_URL}/uploads/${recruiter.img}`

	const handleInputChange =
		(name, prefix = '', maxLength, inputType = 'digits') =>
		e => {
			let value = e.target.value

			// Фильтрация ввода в зависимости от типа
			if (inputType === 'digits') {
				value = value.replace(/[^\d]/g, '') // Оставляем только цифры
			} else if (inputType === 'letters') {
				value = value.replace(/[^a-zA-Zа-яА-Я]/g, '') // Оставляем только буквы
			}

			// Если есть префикс, добавляем его, но убираем дублирование
			if (prefix) {
				value = prefix + value.replace(new RegExp(`^\\${prefix}`), '')
			}

			// Ограничение по длине
			if (value.length > maxLength + 1) {
				value = value.slice(0, maxLength + 1)
			}

			setValue(name, value, { shouldValidate: true }) // Обновляем поле
			trigger(name) // Триггерим валидацию
		}

	const inputStyles = {
		'& .MuiOutlinedInput-root': {
			'&:hover fieldset': {
				borderColor: '#5F27CD',
			},
			'&.Mui-focused fieldset': {
				borderColor: '#5F27CD', //
			},
		},
	}

	return (
		<PageLoader>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
				{/* Верхний блок - HR карточка + Календарь + Метрики */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}
				>
					{/* Левая часть - HR карточка */}
					<Box sx={{ flex: 1, maxWidth: 800 }}>
						<HRCard
							name={name}
							position={recruiter.role?.toUpperCase()}
							imageUrl={img}
							handleEdit={handleOpenModal}
							handleDelete={handleOpenDialog}
							facebookLink={recruiter.facebook}
							tgUsername={recruiter.telegram}
							viberPhone={recruiter.viber}
							whatsappPhone={recruiter.whatsapp}
							email={recruiter.mail}
							tags={[
								{
									label: recruiter.city?.name,
									color: '#6ec6ff',
								},
							]}
						/>
					</Box>

					{/* Центральная часть - Метрики */}
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							maxWidth: 640,
						}}
					>
						<HRMetrics hrId={id} />
					</Box>

					{/* Правая часть - Календарь */}
					<Box
						sx={{
							flex: 1,
							maxWidth: '380px',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<CustomCalendar />
					</Box>
				</Box>
				<RecruiterSearchBar onSearch={setSearchTerm} />

				{/* Таблица лидов */}
				<DynamicTable
					url={`/leads/hr/${id}`}
					excludeColumns={[
						'_id',
						'__v',
						'file',
						'img',
						'languages',
						'education',
						'experience',
						'skills',
						'resumeId',
						'notebookId',
					]}
					searchQuery={searchTerm}
				/>

				{/* Модальное окно */}
				<CustomModal
					open={isModalOpen}
					onClose={handleCloseModal}
					title='Edit Recruiter'
					onConfirm={handleSubmit(onSubmit)}
					confirmLabel='Edit'
					width={700}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						{/* Поля формы */}
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Box sx={{ width: '50%' }}>
								<Typography sx={{ mb: -2 }}>Нікнейм</Typography>
								<Input
									placeholder='Введіть нікнейм'
									{...register('nickname', {
										required: "Поле обов'язкове до заповнення",
									})}
									value={watch('nickname', '')}
									onChange={handleInputChange('nickname', '', 1000, 'all')}
									error={!!errors.nickname}
									helperText={errors.nickname?.message}
									sx={inputStyles}
								/>
							</Box>
							<Box sx={{ width: '50%' }}>
								<Typography sx={{ mb: -2 }}>Email</Typography>
								<Input
									placeholder='Введіть email'
									{...register('email', {
										required: "Поле обов'язкове до заповнення",
										pattern: {
											value:
												/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
											message: 'Некоректний email',
										},
									})}
									error={!!errors.email}
									helperText={errors.email?.message}
									sx={inputStyles}
								/>
							</Box>
						</Box>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Box sx={{ width: '50%' }}>
								<Typography sx={{ mb: -2 }}>Пароль</Typography>
								<Input
									placeholder='Введіть пароль'
									type='password'
									{...register('password')}
									value={watch('password', '')}
									onChange={e => {
										const value = e.target.value

										if (value.trim() === '') {
											setValue('password', '')
										} else {
											setValue('password', value)
										}
									}}
									error={!!errors.password}
									helperText={errors.password?.message}
									sx={inputStyles}
								/>
							</Box>
							<Box sx={{ width: '50%' }}>
								<Typography sx={{ mb: -2 }}>Телефон</Typography>
								<Input
									placeholder='Введіть телефон (+380123456789)'
									{...register('phone', {
										required: "Поле обов'язкове до заповнення",
										validate: value =>
											value.length === 13 ||
											'Номер телефону має містити рівно 12 символів',
									})}
									value={watch('phone', '+')}
									onChange={handleInputChange('phone', '+', 12, 'digits')}
									error={!!errors.phone}
									helperText={errors.phone?.message}
									sx={inputStyles}
								/>
							</Box>
						</Box>
						{/* First name & Last name */}
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Box sx={{ width: '50%' }}>
								<Typography sx={{ mb: -2 }}>Ім'я</Typography>
								<Input
									placeholder="Введіть ім'я"
									{...register('firstname', {
										required: "Поле обов'язкове до заповнення",
									})}
									value={watch('firstname', '')}
									onChange={handleInputChange('firstname', '', 1000, 'letters')}
									error={!!errors.firstname}
									helperText={errors.firstname?.message}
									sx={inputStyles}
								/>
							</Box>
							<Box sx={{ width: '50%' }}>
								<Typography sx={{ mb: -2 }}>Прізвище</Typography>
								<Input
									placeholder='Введіть прізвище'
									{...register('lastname', {
										required: "Поле обов'язкове до заповнення",
									})}
									value={watch('lastname', '')}
									onChange={handleInputChange('lastname', '', 1000, 'letters')}
									error={!!errors.lastname}
									helperText={errors.lastname?.message}
									sx={inputStyles}
								/>
							</Box>
						</Box>
						{/* Role & Status */}
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Box sx={{ width: '50%' }}>
								<Typography>Роль</Typography>
								<FormControl fullWidth sx={inputStyles}>
									<Select {...register('role')} defaultValue='hr'>
										<MenuItem value='admin'>Admin</MenuItem>
										<MenuItem value='hr'>HR</MenuItem>
									</Select>
								</FormControl>
							</Box>
							<Box sx={{ width: '50%' }}>
								<Typography>Статус</Typography>
								<FormControl fullWidth sx={inputStyles}>
									<Select {...register('status')} defaultValue='active'>
										<MenuItem value='active'>Active</MenuItem>
										<MenuItem value='inactive'>Inactive</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</Box>
						{/* Город */}
						<Box sx={{ width: '100%' }}>
							<Typography>Місто</Typography>
							<Controller
								name='city'
								control={control}
								rules={{ required: "Поле обов'язкове до заповнення" }}
								render={({ field }) => (
									<Autocomplete
										sx={inputStyles}
										options={cities}
										getOptionLabel={option =>
											`${option.name} (${option.region})`
										}
										value={
											cities.find(city => city._id === field.value) || null
										} // Set the current city object
										onChange={(_, newValue) =>
											field.onChange(newValue?._id || '')
										} // Update the form value with the city _id
										renderInput={params => (
											<TextField
												{...params}
												placeholder='Оберіть місто'
												variant='outlined'
											/>
										)}
									/>
								)}
							/>
						</Box>
						{/* Фото */}
						<Box sx={{ width: '100%' }}>
							<Typography>Аватар</Typography>
							<Button
								variant='outlined'
								component='label'
								sx={{
									width: '100%',
									height: '56px',
									borderColor: '#5F27CD',
									color: '#5F27CD',
									textTransform: 'none',
								}}
							>
								Обрати файл
								<input
									type='file'
									hidden
									accept='image/*'
									onChange={handleFileChange}
								/>
							</Button>
							{file && (
								<Typography sx={{ mt: 1, color: 'gray' }}>
									{file.name}
								</Typography>
							)}
						</Box>

						{!showSocials && (
							<>
								<Button
									variant='outlined'
									onClick={handleAddSocials}
									sx={{
										height: '56px',
										borderColor: '#5F27CD',
										color: '#5F27CD',
										textTransform: 'none',
									}}
								>
									+ Додати Соціальні мережі
								</Button>
							</>
						)}
						{showSocials && (
							<>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Box sx={{ width: '50%' }}>
										<Typography sx={{ mb: -2 }}>Пошта</Typography>
										<Input
											placeholder='Введіть пошту'
											{...register('mailto', {
												pattern: {
													value:
														/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
													message: 'Некоректна пошта',
												},
											})}
											error={!!errors.mailto}
											helperText={errors.mailto?.message}
											sx={inputStyles}
										/>
									</Box>

									<Box sx={{ width: '50%' }}>
										<Typography sx={{ mb: -2 }}>Facebook</Typography>
										<Input
											placeholder='Введіть посилання на сторінку'
											{...register('facebook')}
											value={watch('facebook', '')}
											onChange={handleInputChange('facebook', '', 10000, 'all')}
											error={!!errors.facebook}
											helperText={errors.facebook?.message}
											sx={inputStyles}
										/>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', gap: 2 }}>
									<Box sx={{ width: '50%' }}>
										<Typography sx={{ mb: -2 }}>WhatsApp</Typography>
										<Input
											placeholder='Введіть номер (+380123456789)'
											{...register('whatsapp', {
												validate: value =>
													value.length === 13 ||
													'Номер телефону має містити рівно 12 символів',
											})}
											value={watch('whatsapp', '+')}
											onChange={handleInputChange(
												'whatsapp',
												'+',
												12,
												'digits'
											)}
											error={!!errors.whatsapp}
											helperText={errors.whatsapp?.message}
											sx={inputStyles}
										/>
									</Box>

									<Box sx={{ width: '50%' }}>
										<Typography sx={{ mb: -2 }}>Viber</Typography>
										<Input
											placeholder='Введіть номер (+380123456789)'
											{...register('viber', {
												validate: value =>
													value.length === 13 ||
													'Номер телефону має містити рівно 12 символів',
											})}
											value={watch('viber', '+')}
											onChange={handleInputChange('viber', '+', 12, 'digits')}
											error={!!errors.viber}
											helperText={errors.viber?.message}
											sx={inputStyles}
										/>
									</Box>
								</Box>

								<Box sx={{ width: '100%' }}>
									<Typography sx={{ mb: -2 }}>Telegram</Typography>
									<Input
										placeholder='Введіть нікнейм (@username)'
										{...register('telegram')}
										value={watch('telegram', '@')}
										onChange={handleInputChange('telegram', '@', 1000, 'all')}
										error={!!errors.telegram}
										helperText={errors.telegram?.message}
										sx={inputStyles}
									/>
								</Box>
							</>
						)}
						{!showRabota && (
							<>
								<Button
									variant='outlined'
									onClick={handleAddRabota}
									sx={{
										height: '56px',
										borderColor: '#5F27CD',
										color: '#5F27CD',
										textTransform: 'none',
									}}
								>
									+ Додати аккаунт Robota.ua
								</Button>
							</>
						)}
						{showRabota && (
							<>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Box sx={{ width: '50%' }}>
										<Typography sx={{ mb: -2 }}>Пошта</Typography>
										<Input
											placeholder='Введіть пошту'
											{...register('rabota_email', {
												pattern: {
													value:
														/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
													message: 'Некоректна пошта',
												},
											})}
											error={!!errors.rabota_email}
											helperText={errors.rabota_email?.message}
											sx={inputStyles}
										/>
									</Box>

									<Box sx={{ width: '50%' }}>
										<Typography sx={{ mb: -2 }}>Пароль</Typography>
										<Input
											placeholder='Введіть пароль'
											type='rabota_password'
											{...register('rabota_password')}
											value={watch('rabota_password', '')}
											onChange={handleInputChange(
												'rabota_password',
												'',
												1000,
												'all'
											)}
											error={!!errors.rabota_password}
											helperText={errors.rabota_password?.message}
											sx={inputStyles}
										/>
									</Box>
								</Box>
							</>
						)}
					</Box>
				</CustomModal>

				{/* Диалог для удаления */}
				<Dialog open={openDialog} onClose={handleCloseDialog}>
					<DialogTitle>Підтвердити видалення</DialogTitle>
					<DialogContent>
						<Typography sx={{ mt: 3, mb: 1 }}>
							Ви впевнені, що хочете видалити цього рекрутера?
						</Typography>
					</DialogContent>
					<DialogActions sx={{ pb: 3, pr: 3, pl: 3 }}>
						<Button
							variant='outlined'
							onClick={handleCloseDialog}
							color='primary'
						>
							Скасувати
						</Button>
						<Button variant='contained' onClick={handleDelete} color='error'>
							Видалити
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</PageLoader>
	)
}

export default RecruiterPage
