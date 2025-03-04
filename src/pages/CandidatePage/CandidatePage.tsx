import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import {
	Autocomplete,
	TextField,
	Avatar,
	Box,
	Divider,
	Typography,
	Button,
	IconButton,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmailIcon from '@mui/icons-material/Email'
import WorkIcon from '@mui/icons-material/Work'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import axiosInstance from '@/api/axiosInstance'
import { Input } from '@/components/UI'
import parse from 'html-react-parser'

import { toast } from 'react-toastify'
import { PageLoader } from '@/components/Layout'

const CandidatePage = () => {
	const navigate = useNavigate()
	const { id } = useParams() // Получаем ID из URL
	const [lead, setLead] = useState<any>(null)
	const [cities, setCities] = useState([])
	const [statuses, setStatuses] = useState([])
	const [showResume, setShowResume] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [openDialog, setOpenDialog] = useState(false)

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

	useEffect(() => {
		const fetchStatuses = async () => {
			try {
				const response = await axiosInstance.get('/statuses')
				setStatuses(response.data)
			} catch (error) {
				console.error('Ошибка загрузки статусов:', error)
			}
		}
		fetchStatuses()
	}, [])

	useEffect(() => {
		const fetchLead = async () => {
			try {
				const response = await axiosInstance.get(`/leads/lead/${id}`)
				setLead(response.data)
			} catch (error) {
				console.error('Error loading lead:', error)
			}
		}
		fetchLead()
	}, [id])

	useEffect(() => {
		if (lead) {
			setValue('firstname', lead.firstname || '')
			setValue('surname', lead.surname || '')
			setValue('lastname', lead.lastname || '')
			setValue('email', lead.email || '')
			setValue('phone', lead.phone || '')
			setValue('city', lead.city?._id || '')
			setValue('status', lead.status?._id || '')
			setValue('statusDate', lead.statusDate || '')
			setValue('comments', lead.comments || '')
			setValue('profession', lead.profession || '')
			setValue('about', lead.about || '')
			setValue('languages', lead.languages || [''])
			setValue('skills', lead.skills || [''])
			setValue('education', lead.education || [''])
			setValue('experience', lead.experience || [''])
		}
	}, [lead, setValue])

	// Проверяем, что данные получены
	if (!lead) {
		return (
			<PageLoader>
				<Box
					sx={{
						height: '100vh',
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<CircularProgress
						sx={{ display: 'block', margin: '20px auto', color: '#5F27CD' }}
					/>
				</Box>
			</PageLoader>
		)
	}

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`/leads/${lead._id}`)
			navigate(`/candidates`)
			toast.success('Deleted successfully')
			setOpenDialog(false)
		} catch (err: any) {
			toast.error('Error deleting candidate:', err)
		}
	}

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

		if (file) formData.append('file', file)

		console.log('FormData:', formData) // Проверяем структуру FormData

		try {
			const response = await axiosInstance.patch(`/leads/${id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			toast.success('Lead edited successfully!')
		} catch (error) {
			console.error('Error:', error)
			toast.error(error?.response?.data?.message || 'Failed to edit lead')
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

	const handleDownloadResume = async () => {
		try {
			const data = {
				cvId: lead.resumeId,
				notebookId: lead.notebookId,
				email: localStorage.getItem('rabotaEmail'),
				password: localStorage.getItem('rabotaPassword'),
			}

			const response = await axiosInstance.post(`/leads/rabota/resume`, data, {
				responseType: 'blob', // Ожидаем файл в бинарном виде
			})

			// Определяем тип файла
			const contentType = response.headers['content-type']
			let fileExtension = '.bin'

			if (contentType.includes('pdf')) fileExtension = '.pdf'
			else if (contentType.includes('rtf')) fileExtension = '.rtf'
			else if (contentType.includes('msword')) fileExtension = '.doc'
			else if (contentType.includes('officedocument.wordprocessingml.document'))
				fileExtension = '.docx'
			else if (contentType.includes('plain')) fileExtension = '.txt'

			// Создаём ссылку для скачивания
			const url = window.URL.createObjectURL(
				new Blob([response.data], { type: contentType })
			)
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', `resume_${data.cvId}${fileExtension}`)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			console.log(`✅ Файл загружен в формате ${fileExtension.toUpperCase()}!`)
		} catch (error) {
			console.error('❌ Ошибка при загрузке резюме:', error)
			alert('Ошибка при скачивании файла')
		}
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

	console.log(lead)

	return (
		<Box
			sx={{
				width: '100%',
				padding: 2,
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{/* Блок с картинкой и краткой информацией */}
			<Box
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: 7,
					p: 2,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						p: 4,
						borderRadius: '12px',
					}}
				>
					<Box
						sx={{
							width: 300,
							height: 300,
							borderRadius: '6px',
							overflow: 'hidden',
						}}
					>
						<Avatar
							src={lead.img}
							sx={{
								width: '100%',
								height: '100%',
							}}
						/>
					</Box>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						bgcolor: '#F8F9FC',
						p: 4,
						borderRadius: '12px',
					}}
				>
					<Typography variant='h5' sx={{ color: '#5F27CD', fontWeight: 700 }}>
						Контакти
					</Typography>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<PhoneIcon sx={{ color: '#5F27CD' }} />
						<Typography>{lead.phone}</Typography>
					</Box>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<EmailIcon sx={{ color: '#5F27CD' }} />
						<Typography>{lead.email}</Typography>
					</Box>
					{lead.city?.name && (
						<>
							<Box sx={{ display: 'flex', gap: 2 }}>
								<LocationOnIcon sx={{ color: '#5F27CD' }} />
								<Typography>{lead.city.name}</Typography>
							</Box>
						</>
					)}
				</Box>
				{/* Skills */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						bgcolor: '#F8F9FC',
						p: 4,
						borderRadius: '12px',
					}}
				>
					<Typography variant='h5' sx={{ color: '#5F27CD', fontWeight: 700 }}>
						Вміння
					</Typography>
					{lead.skills?.map((skill: string, index: number) => (
						<Box key={index}>{parse(skill)}</Box>
					))}
				</Box>
				{/* Languages */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						bgcolor: '#F8F9FC',
						p: 4,
						borderRadius: '12px',
					}}
				>
					<Typography variant='h5' sx={{ color: '#5F27CD', fontWeight: 700 }}>
						Мови
					</Typography>
					{/* Отображение языков */}
					{lead.languages?.map((language: string, index: number) => (
						<Typography key={index}>{language}</Typography>
					))}
				</Box>
			</Box>

			{/* Блок с именем и описанием */}
			<Box
				sx={{
					height: '100%',
					width: 700,
					ml: 5,
					p: 2,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Box
					sx={{
						height: '15vh',
						p: 4,
						mt: 4,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						bgcolor: '#F8F9FC',
						borderRadius: '12px',
						textAlign: 'center',
					}}
				>
					<Typography variant='h3'>
						{lead.firstname} {lead.surname} {lead.lastname}
					</Typography>
					<Divider sx={{ bgcolor: '#5F27CD', height: '3px' }} />
					<Typography variant='h4'>{lead.profession}</Typography>
				</Box>
				<Box
					sx={{
						mt: 15,
						height: '75%',
						display: 'flex',
						flexDirection: 'column',
						gap: 5,
					}}
				>
					{/* Profile Section */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							p: 4,
							borderRadius: '12px',
							bgcolor: '#F8F9FC',
						}}
					>
						<Box sx={{ display: 'flex', gap: 3 }}>
							<PersonIcon sx={{ width: 60, height: 60, color: '#5F27CD' }} />
							<Typography sx={{ fontSize: '40px' }}>Профіль</Typography>
						</Box>
						<Divider sx={{ bgcolor: '#5F27CD', height: '3px', mt: 1, mb: 1 }} />
						<Typography>{lead.about}</Typography>
					</Box>
					{/* Work Experience Section */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							p: 4,
							borderRadius: '12px',
							bgcolor: '#F8F9FC',
						}}
					>
						<Box sx={{ display: 'flex', gap: 3 }}>
							<WorkIcon sx={{ width: 60, height: 60, color: '#5F27CD' }} />
							<Typography sx={{ fontSize: '40px' }}>Досвід роботи</Typography>
						</Box>
						<Divider sx={{ bgcolor: '#5F27CD', height: '3px', mt: 1, mb: 1 }} />
						{lead.experience?.map((experience: string, index: number) => (
							<Typography sx={{ fontSize: 17, mb: 1 }} key={index}>
								{experience}
							</Typography>
						))}
					</Box>
					{/* Education Section */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							p: 4,
							borderRadius: '12px',
							bgcolor: '#F8F9FC',
						}}
					>
						<Box sx={{ display: 'flex', gap: 3 }}>
							<SchoolIcon sx={{ width: 60, height: 60, color: '#5F27CD' }} />
							<Typography sx={{ fontSize: '40px' }}>Освіта</Typography>
						</Box>
						<Divider sx={{ bgcolor: '#5F27CD', height: '3px', mt: 1, mb: 1 }} />
						{lead.education?.map((education: string, index: number) => (
							<Typography sx={{ fontSize: 17, mb: 1 }} key={index}>
								{education}
							</Typography>
						))}
					</Box>
				</Box>
			</Box>

			{/* Блок с формой */}
			<Box
				sx={{
					width: 700,
					height: '95vh',
					ml: 6,
					p: 3,
					borderRadius: '12px',
					bgcolor: '#F8F9FC',
					overflowY: 'auto',
				}}
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
								onChange={handleInputChange('firstname', '', 1000, 'letters')}
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
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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
										value={
											cities.find(city => city._id === field.value) || null
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
											onChange={newValue => field.onChange(newValue?.toDate())}
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
					<Button
						onClick={handleSubmit(onSubmit)}
						variant='contained'
						sx={{
							height: 56,
							bgcolor: '#5F27CD',
							color: '#FFFFFF',
							textTransform: 'none',
						}}
					>
						Редагувати кандидата
					</Button>
					<Button
						onClick={handleOpenDialog}
						variant='contained'
						color='error'
						sx={{
							height: 56,
							textTransform: 'none',
						}}
					>
						Видалити кандидата
					</Button>
					{lead.resumeId && (
						<>
							<Button
								variant='contained'
								onClick={handleDownloadResume}
								startIcon={<CloudDownloadIcon />}
								sx={{ height: '56px', minWidth: '160px', bgcolor: '#007BFF' }}
							>
								Завантажити резюме
							</Button>
						</>
					)}
				</Box>
			</Box>
			{/* Диалог для удаления */}
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>Підтвердити видалення</DialogTitle>
				<DialogContent>
					<Typography sx={{ mt: 3, mb: 1 }}>
						Ви впевнені, що хочете видалити цього кандидата?
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
	)
}

export default CandidatePage
