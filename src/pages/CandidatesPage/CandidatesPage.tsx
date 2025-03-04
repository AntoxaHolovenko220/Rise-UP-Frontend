import {
	Box,
	Button,
	Typography,
	Autocomplete,
	TextField,
	IconButton,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { DynamicTable, CustomModal, Input } from '@/components/UI'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/api/axiosInstance'
import { InfoBlock } from '@/components/Layout'
import DeleteIcon from '@mui/icons-material/Delete'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import CandidatesSearchBar from './CandidatesSearchBar'
import CandidatesImg from '@/assets/Business deal-bro.svg'
import ParserBlock from './ParserBlock'
import { PageLoader } from '@components/Layout'

const CandidatesPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [page, setPage] = useState(1) // Текущая страница
	const [cities, setCities] = useState([])
	const [statuses, setStatuses] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [showResume, setShowResume] = useState(false)
	const [tableKey, setTableKey] = useState(0)
	const navigate = useNavigate()

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
				firstname: '',
				surname: '',
				lastname: '',
				email: '',
				phone: '',
				city: '',
				status: '',
				statusDate: '',
				comments: '',
				profession: '',
				about: '',
				languages: [],
				skills: [],
				education: [],
				experience: [],
			}),
			[]
		),
	})

	useEffect(() => {
		const fetchCities = async (search = '') => {
			try {
				const response = await axiosInstance.get(`/cities?search=${search}`)
				setCities(response.data)
			} catch (error) {
				console.error('Error loading cities:', error)
			}
		}

		const fetchStatuses = async (search = '') => {
			try {
				const response = await axiosInstance.get(`/statuses?search=${search}`)
				setStatuses(response.data)
			} catch (error) {
				console.error('Error loading statuses:', error)
			}
		}

		fetchCities()
		fetchStatuses()
	}, [page])

	const handleOpenModal = () => setIsModalOpen(true)
	const handleCloseModal = () => setIsModalOpen(false)

	const handleAddResume = () => {
		setShowResume(true)
	}

	const experience = watch('experience')
	const addExperience = () => {
		setValue('experience', [...experience, ''])
	}
	const removeExperience = index => {
		const newExperience = experience.filter((_, i) => i !== index)
		setValue('experience', newExperience)
	}

	const education = watch('education')
	const addEducation = () => {
		setValue('education', [...education, ''])
	}
	const removeEducation = index => {
		const newEducation = education.filter((_, i) => i !== index)
		setValue('education', newEducation)
	}

	const skills = watch('skills')
	const addSkills = () => {
		setValue('skills', [...skills, ''])
	}
	const removeSkills = index => {
		const newSkills = skills.filter((_, i) => i !== index)
		setValue('skills', newSkills)
	}

	const languages = watch('languages')
	const addLanguages = () => {
		setValue('languages', [...languages, ''])
	}
	const removeLanguages = index => {
		const newLanguages = languages.filter((_, i) => i !== index)
		setValue('languages', newLanguages)
	}

	const onSubmit = async (data: any) => {
		console.log('Form data:', data) // Проверяем данные формы

		const formData = new FormData()

		Object.entries(data).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				// Для массивов передаём каждый элемент отдельно
				value.forEach((item, index) => {
					formData.append(`${key}[${index}]`, item)
				})
			} else if (value !== undefined && value !== null) {
				formData.append(key, String(value))
			}
		})

		console.log('FormData:', formData) // Проверяем структуру FormData

		try {
			const response = await axiosInstance.post(`/leads/create`, formData, {})
			handleCloseModal()
			setTableKey(prev => prev + 1) // Триггерим обновление таблицы
			toast.success('Lead created successfully!')
		} catch (error) {
			console.error('Error:', error)
			toast.error(error?.response?.data?.message || 'Failed to create lead')
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
				borderColor: '#5F27CD',
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
				<InfoBlock
					title='Управління Кандидатами'
					description='Переглядайте заявки кандидатів, керуйте профілями та відстежуйте прогрес найму.'
					image={CandidatesImg}
					backgroundColor='#E3FCEF' // Светло-зелёный фон
				/>

				<ParserBlock />

				<CandidatesSearchBar
					onSearch={setSearchTerm}
					onAddCandidate={handleOpenModal}
				/>

				<DynamicTable
					key={tableKey}
					url='/leads'
					excludeColumns={[
						'_id',
						'__v',
						'file',
						'languages',
						'education',
						'experience',
						'skills',
						'resumeId',
						'notebookId',
						'img',
					]}
					searchQuery={searchTerm}
					onEdit={candidate => navigate(`/candidate/${candidate._id}`)}
				/>

				{/* Модальное окно */}
				<CustomModal
					open={isModalOpen}
					onClose={handleCloseModal}
					title='Створити кандидата'
					onConfirm={handleSubmit(onSubmit)}
					confirmLabel='Створити'
					width={800}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
						}}
					>
						{/* Поля формы */}
						{/* First name & Surname */}
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
								<Typography sx={{ mb: -2 }}>По Батькові</Typography>
								<Input
									placeholder='Введіть по батькові'
									{...register('surname')}
									value={watch('surname', '')}
									onChange={handleInputChange('surname', '', 1000, 'letters')}
									error={!!errors.surname}
									helperText={errors.surname?.message}
									sx={inputStyles}
								/>
							</Box>
						</Box>
						{/* Last name & Email */}
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Box sx={{ width: '50%' }}>
								<Typography sx={{ mb: -2 }}>Прізвище</Typography>
								<Input
									placeholder='Введіть прізвище'
									{...register('lastname')}
									value={watch('lastname', '')}
									onChange={handleInputChange('lastname', '', 1000, 'letters')}
									error={!!errors.lastname}
									helperText={errors.lastname?.message}
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
						{/* Phone & City */}
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Box sx={{ width: '50%' }}>
								<Typography sx={{ mb: -2 }}>Телефон</Typography>
								<Input
									placeholder='Введіть телефон (+380123456789)'
									{...register('phone', {
										required: "Поле обов'язкове до заповнення",
									})}
									value={watch('phone', '+')}
									onChange={handleInputChange('phone', '+', 12, 'digits')}
									error={!!errors.phone}
									helperText={errors.phone?.message}
									sx={inputStyles}
								/>
							</Box>
							{/* City */}
							<Box sx={{ width: '50%' }}>
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
						</Box>
						{/* Status & Status Date */}
						<Box sx={{ display: 'flex', gap: 2 }}>
							{/* Status */}
							<Box sx={{ width: '50%' }}>
								<Typography>Статус</Typography>
								<Controller
									name='status'
									control={control}
									render={({ field }) => (
										<Autocomplete
											options={statuses}
											getOptionLabel={option => option.name} // Показываем только имя, а цвет через renderOption
											value={
												statuses.find(status => status._id === field.value) ||
												null
											}
											onChange={(_, newValue) =>
												field.onChange(newValue?._id || '')
											}
											sx={inputStyles}
											renderOption={(props, option) => (
												<li {...props} key={option._id}>
													<Box
														sx={{
															width: 16,
															height: 16,
															backgroundColor: option.color,
															border: '1px solid #ccc',
															borderRadius: '4px',
															marginRight: 1,
															flexShrink: 0,
														}}
													/>
													{option.name}
												</li>
											)}
											renderInput={params => (
												<TextField
													{...params}
													placeholder='Оберіть статус'
													variant='outlined'
													error={!!errors.status}
													helperText={errors.status?.message}
												/>
											)}
										/>
									)}
								/>
							</Box>
							{/* Status Date */}
							<Box sx={{ width: '50%' }}>
								<Typography>Дата статусу</Typography>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<Controller
										name='statusDate'
										control={control}
										render={({ field }) => (
											<DateTimePicker
												sx={{
													width: '100%',
													'& .MuiOutlinedInput-root': {
														'&:hover fieldset': {
															borderColor: '#5F27CD',
														},
														'&.Mui-focused fieldset': {
															borderColor: '#5F27CD', //
														},
													},
												}}
												{...field}
												value={field.value ? dayjs(field.value) : null}
												onChange={newValue =>
													field.onChange(newValue?.toDate())
												}
												ampm={false}
												slots={{ textField: TextField }}
												slotProps={{
													textField: {
														variant: 'outlined',
														placeholder: 'Оберіть дату',
													},
												}}
											/>
										)}
									/>
								</LocalizationProvider>
							</Box>
						</Box>
						{/*Commnets */}
						<Box sx={{ width: '100%' }}>
							<Typography sx={{ mb: -2 }}>Коментар</Typography>
							<Input
								placeholder='Введіть коментар'
								multiline
								rows={4}
								{...register('comments')}
								sx={inputStyles}
							/>
						</Box>

						{!showResume && (
							<>
								<Button
									variant='outlined'
									onClick={handleAddResume}
									sx={{
										height: '56px',
										borderColor: '#5F27CD',
										color: '#5F27CD',
										textTransform: 'none',
									}}
								>
									+ Додати інформацію про резюме
								</Button>
							</>
						)}
						{showResume && (
							<>
								<Box sx={{ width: '100%' }}>
									<Typography sx={{ mb: -2 }}>Професія</Typography>
									<Input
										placeholder='Введіть професію'
										{...register('profession')}
										sx={inputStyles}
									/>
								</Box>

								<Box sx={{ width: '100%' }}>
									<Typography sx={{ mb: -2 }}>Профіль</Typography>
									<Input
										placeholder='Опишіть кандидата'
										multiline
										rows={4}
										{...register('about')}
										sx={inputStyles}
									/>
								</Box>

								<Box display='flex' flexDirection='column' gap={2}>
									<Typography sx={{ mb: -2 }}>Досвід</Typography>
									{experience.map((_, index) => (
										<Box key={index} display='flex' alignItems='center' gap={1}>
											<Controller
												name={`experience.${index}`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														placeholder={`Досвід ${index + 1}`}
														{...register(`experience.${index}`)}
														sx={inputStyles}
														fullWidth
													/>
												)}
											/>
											<IconButton onClick={() => removeExperience(index)}>
												<DeleteIcon color='error' />
											</IconButton>
										</Box>
									))}
									<Button
										onClick={addExperience}
										variant='outlined'
										sx={{
											height: 56,
											borderColor: '#5F27CD',
											color: '#5F27CD',
											textTransform: 'none',
										}}
									>
										Додати Досвід
									</Button>
								</Box>

								<Box display='flex' flexDirection='column' gap={2}>
									<Typography sx={{ mb: -2 }}>Освіта</Typography>
									{education.map((_, index) => (
										<Box key={index} display='flex' alignItems='center' gap={1}>
											<Controller
												name={`education.${index}`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														placeholder={`Освіта ${index + 1}`}
														{...register(`education.${index}`)}
														sx={inputStyles}
														fullWidth
													/>
												)}
											/>
											<IconButton onClick={() => removeEducation(index)}>
												<DeleteIcon color='error' />
											</IconButton>
										</Box>
									))}
									<Button
										onClick={addEducation}
										variant='outlined'
										sx={{
											height: 56,
											borderColor: '#5F27CD',
											color: '#5F27CD',
											textTransform: 'none',
										}}
									>
										Додати Освіту
									</Button>
								</Box>

								<Box display='flex' flexDirection='column' gap={2}>
									<Typography sx={{ mb: -2 }}>Вміння</Typography>
									{skills.map((_, index) => (
										<Box key={index} display='flex' alignItems='center' gap={1}>
											<Controller
												name={`skills.${index}`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														placeholder={`Вміння ${index + 1}`}
														{...register(`skills.${index}`)}
														sx={inputStyles}
														fullWidth
													/>
												)}
											/>
											<IconButton onClick={() => removeSkills(index)}>
												<DeleteIcon color='error' />
											</IconButton>
										</Box>
									))}
									<Button
										onClick={addSkills}
										variant='outlined'
										sx={{
											height: 56,
											borderColor: '#5F27CD',
											color: '#5F27CD',
											textTransform: 'none',
										}}
									>
										Додати Вміння
									</Button>
								</Box>

								<Box display='flex' flexDirection='column' gap={2}>
									<Typography>Мови</Typography>
									{languages.map((_, index) => (
										<Box key={index} display='flex' alignItems='center' gap={1}>
											<Controller
												name={`languages.${index}`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														placeholder={`Мова ${index + 1}`}
														{...register(`languages.${index}`)}
														sx={inputStyles}
														fullWidth
													/>
												)}
											/>
											<IconButton onClick={() => removeLanguages(index)}>
												<DeleteIcon color='error' />
											</IconButton>
										</Box>
									))}
									<Button
										onClick={addLanguages}
										variant='outlined'
										sx={{
											height: 56,
											borderColor: '#5F27CD',
											color: '#5F27CD',
											textTransform: 'none',
										}}
									>
										Додати Мову
									</Button>
								</Box>
							</>
						)}
					</Box>
				</CustomModal>
			</Box>
		</PageLoader>
	)
}

export default CandidatesPage
