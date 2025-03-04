import axiosInstance from '@/api/axiosInstance'
import { CustomModal, DynamicTable, Input } from '@/components/UI'
import { InfoBlock, PageLoader } from '@components/Layout'
import {
	Autocomplete,
	Box,
	FormControl,
	MenuItem,
	Select,
	TextField,
	Typography,
	Button,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import RecruitersSearchBar from './RecruitersSearchBar'
import RecruitersImg from '@/assets/Group 1744991.svg'

const RecruitersPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [cities, setCities] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [showSocials, setShowSocials] = useState(false)
	const [showRabota, setShowRabota] = useState(false)
	const [tableKey, setTableKey] = useState(0)

	const navigate = useNavigate()

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

	const handleOpenModal = () => setIsModalOpen(true)
	const handleCloseModal = () => setIsModalOpen(false)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.length) {
			const selectedFile = event.target.files[0]
			setFile(selectedFile)
			console.log('Выбран файл:', selectedFile) // Логируем файл
		}
	}

	const handleAddSocials = () => {
		setShowSocials(true)
	}

	const handleAddRabota = () => {
		setShowRabota(true)
	}

	const onSubmit = async (data: any) => {
		const formData = new FormData()

		Object.entries(data).forEach(([key, value]) => {
			if (value !== null && value !== '') {
				formData.append(key, String(value))
			}
		})

		if (file) {
			formData.append('img', file)
		}

		try {
			await axiosInstance.post('/users/create', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})

			toast.success('Рекрутер успішно створений!')
			setIsModalOpen(false)
			setTableKey(prev => prev + 1)
		} catch (error) {
			console.error('Error:', error)
			toast.error(
				error?.response?.data?.message || 'Не вдалося створити рекрутера'
			)
		}
	}

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
			if (value.length >= maxLength + 1) {
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
			<Box
				sx={{
					width: '100%',
					padding: 2,
					height: '100vh',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{/* Информационный блок */}
				<InfoBlock
					title='Управління Рекрутерами'
					description='Керуйте рекрутерами, переглядайте їхні дані та створюйте нових.'
					image={RecruitersImg}
					backgroundColor='#E3F2FD'
				/>

				{/* Панель поиска */}
				<RecruitersSearchBar
					onSearch={setSearchTerm}
					onAddRecruiter={handleOpenModal}
				/>

				{/* Таблица рекрутеров */}
				<DynamicTable
					key={tableKey}
					url='/users'
					excludeColumns={[
						'_id',
						'password',
						'__v',
						'img',
						'rabota_email',
						'rabota_password',
					]}
					searchQuery={searchTerm}
					onEdit={recruiter => navigate(`/recruiter/${recruiter._id}`)}
				/>

				{/* Модальное окно */}
				<CustomModal
					open={isModalOpen}
					onClose={handleCloseModal}
					title='Створити рекрутера'
					onConfirm={handleSubmit(onSubmit)}
					confirmLabel='Створити'
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
									{...register('password', {
										required: "Поле обов'язкове до заповнення",
									})}
									value={watch('password', '')}
									onChange={handleInputChange('password', '', 1000, 'all')}
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
								defaultValue=''
								render={({ field }) => (
									<Autocomplete
										options={cities}
										getOptionLabel={option =>
											`${option.name} (${option.region})`
										}
										onChange={(_, newValue) =>
											setValue('city', newValue?._id || '')
										}
										sx={inputStyles}
										renderInput={params => (
											<TextField
												{...params}
												placeholder='Оберіть місто'
												variant='outlined'
												error={!!errors.city}
												helperText={errors.city?.message}
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
										// value={watch('telegram', '@')}
										// onChange={handleInputChange('telegram', '@', 1000, 'all')}
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
			</Box>
		</PageLoader>
	)
}

export default RecruitersPage
