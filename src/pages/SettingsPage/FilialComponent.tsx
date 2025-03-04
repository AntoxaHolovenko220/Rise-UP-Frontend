import { Box, Typography, TextField, Popover } from '@mui/material'
import { CustomModal, DynamicTable, Input } from '@/components/UI'
import FilialsSearchBar from './FilialsSearchBar'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosInstance from '@/api/axiosInstance'

const schema = yup.object().shape({
	name: yup.string().required("Поле обов'язкове до заповнення"),
})

const FilialComponent = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [editId, setEditId] = useState('')
	const [filial, setFilial] = useState<any>(null)
	const [tableKey, setTableKey] = useState(0)
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
			}),
			[]
		),
	})

	useEffect(() => {
		const fetchFilial = async () => {
			try {
				const response = await axiosInstance.get(`/filials/filial/${editId}`)

				setFilial(response.data)
			} catch (error) {
				console.error('Error loading filial:', error)
			}
		}
		fetchFilial()
	}, [editId])

	useEffect(() => {
		if (filial) {
			setValue('name', filial.name || '')
		}
	}, [filial, setValue])

	const onSubmit = async (data: any) => {
		console.log('Form data:', data) // Логируем данные формы
		const formData = new FormData()
		// Добавляем поля
		Object.entries(data).forEach(([key, value]) => {
			if (value) formData.append(key, String(value))
		})

		console.log('FormData:', formData)

		try {
			const response = await axiosInstance.post('/filials/create', formData)
			toast.success('Філіал успішно створений!')
			setIsModalOpen(false)
			setTableKey(prev => prev + 1) // Триггерим обновление таблицы
		} catch (error) {
			console.error('Error:', error)
			toast.error(error?.response?.data?.message || 'Помилка створення філіалу')
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
			const response = await axiosInstance.patch(`/filials/${editId}`, formData)
			toast.success('Філіал редагований успішно!')
			setIsEditModalOpen(false)
			setTableKey(prev => prev + 1) // Триггерим обновление таблицы
		} catch (error) {
			console.error('Error:', error)
			toast.error(
				error?.response?.data?.message || 'Помилка редагування філіалу'
			)
		}
	}

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				padding: 2,
				display: 'flex',
				flexDirection: 'column',
				p: 0,
			}}
		>
			<Box sx={{ display: 'flex', gap: 2 }}>
				<FilialsSearchBar
					onSearch={setSearchTerm}
					onAddStatus={handleOpenModal}
				/>
			</Box>
			<Box sx={{ display: 'flex', gap: 2 }}>
				{/* Таблица филиалов */}
				<DynamicTable
					key={tableKey}
					url='/filials'
					excludeColumns={['_id', '__v']}
					searchQuery={searchTerm}
					onEdit={filial => {
						setEditId(filial._id)
						handleOpenEditModal()
					}}
				/>
			</Box>

			{/* Модалка для создания */}
			<CustomModal
				open={isModalOpen}
				onClose={handleCloseModal}
				title='Створити філіал'
				onConfirm={handleSubmit(onSubmit)}
				confirmLabel='Створити'
				width={700}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					{/* Поля формы */}
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Box sx={{ width: '100%' }}>
							<Typography>Філіал</Typography>
							<Input
								placeholder='Введіть назву філіалу'
								{...register('name')}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Box>
					</Box>
				</Box>
			</CustomModal>

			{/* Модалка для редактирования */}
			<CustomModal
				open={isEditModalOpen}
				onClose={handleCloseEditModal}
				title='Редагувати філіал'
				onConfirm={handleSubmit(onSubmitEdit)}
				confirmLabel='Редагувати'
				width={700}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					{/* Поля формы */}
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Box sx={{ width: '100%' }}>
							<Typography>Філіал</Typography>
							<Input
								placeholder='Введіть назву філіалу'
								{...register('name')}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Box>
					</Box>
				</Box>
			</CustomModal>
		</Box>
	)
}

export default FilialComponent
