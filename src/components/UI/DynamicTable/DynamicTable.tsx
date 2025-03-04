import axiosInstance from '@/api/axiosInstance'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface DynamicTableProps {
	url: string
	excludeColumns: string[]
	searchQuery?: string
	onEdit?: (item: any) => void
}

const statusColors: Record<string, string> = {
	draft: '#f44336',
	paid: '#4caf50',
	'partial payment': '#3f51b5',
}

const DynamicTable: React.FC<DynamicTableProps> = ({
	url,
	excludeColumns = [],
	searchQuery = '',
	onEdit,
}) => {
	const navigate = useNavigate()
	const [data, setData] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [openDialog, setOpenDialog] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<string | null>(null)
	const tableRef = useRef<HTMLDivElement | null>(null)
	const [tableHeight, setTableHeight] = useState<number>(300) // Начальная высота

	const fetchData = async () => {
		setLoading(true)
		try {
			const response = await axiosInstance.get(url)
			if (Array.isArray(response.data)) {
				const sortedData = response.data.sort(
					(a, b) =>
						new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
				)
				setData(sortedData)
			} else {
				throw new Error('Полученные данные не являются массивом')
			}
		} catch (err: any) {
			setError(err.message || 'Не удалось загрузить данные')
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async () => {
		if (!itemToDelete) return
		try {
			await axiosInstance.delete(`${url}/${itemToDelete}`)
			toast.success('Видалено успішно!')
			setOpenDialog(false)
			fetchData()
		} catch (err: any) {
			toast.error('Помилка видалення:', err)
		}
	}

	const handleOpenDialog = (id: string) => {
		setItemToDelete(id)
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
		setItemToDelete(null)
	}

	const handleEdit = (item: any) => {
		onEdit(item)
	}

	useEffect(() => {
		fetchData()
	}, [url])

	useEffect(() => {
		const updateTableHeight = () => {
			setTimeout(() => {
				if (tableRef.current) {
					const offsetTop = tableRef.current.offsetTop
					const newHeight = window.innerHeight - offsetTop - 20
					setTableHeight(newHeight > 100 ? newHeight : 100)
				}
			}, 1200) // Даем браузеру время на рендеринг
		}

		updateTableHeight()
		window.addEventListener('resize', updateTableHeight)

		return () => window.removeEventListener('resize', updateTableHeight)
	}, [])

	if (loading)
		return (
			<CircularProgress
				sx={{ display: 'block', margin: '20px auto', color: '#5F27CD' }}
			/>
		)
	if (error)
		return (
			<Typography color='error' sx={{ textAlign: 'center', mt: 2 }}>
				{error}
			</Typography>
		)
	if (!data.length)
		return (
			<Typography sx={{ textAlign: 'center', mt: 2 }}>
				Немає доступних даних
			</Typography>
		)

	const columns = Object.keys(data[0]).filter(
		column => !excludeColumns.includes(column)
	)

	const matchesSearchQuery = (row: any) => {
		const lowerSearch = searchQuery.toLowerCase()
		return columns.some(column => {
			const value = row[column]
			if (
				typeof value === 'string' &&
				value.toLowerCase().includes(lowerSearch)
			) {
				return true
			}
			if (typeof value === 'object' && value !== null) {
				return Object.values(value).some(
					prop =>
						typeof prop === 'string' && prop.toLowerCase().includes(lowerSearch)
				)
			}
			return false
		})
	}

	const filteredData = searchQuery ? data.filter(matchesSearchQuery) : data

	const renderCellContent = (value: any, column: string) => {
		if (!value) return '-'

		// Если колонка "color", показываем квадрат вместо текста
		if (column === 'color') {
			return (
				<Box
					sx={{
						width: 40,
						height: 20,
						backgroundColor: value,
						borderRadius: 1,
						border: '1px solid #ccc',
						display: 'inline-block',
					}}
				/>
			)
		}

		if (typeof value === 'string' && statusColors[value.toLowerCase().trim()]) {
			return (
				<Chip
					label={value}
					sx={{
						backgroundColor: statusColors[value.toLowerCase().trim()],
						color: '#fff',
						fontSize: '12px',
						borderRadius: '8px',
						padding: '4px 10px',
						fontWeight: 'bold',
					}}
				/>
			)
		}
		if (typeof value === 'string' && Date.parse(value)) {
			return format(new Date(value), 'dd.MM.yyyy HH:mm')
		}
		if (typeof value === 'object' && value !== null) {
			return value.name || value.nickname || JSON.stringify(value)
		}
		return value
	}

	return (
		<Box sx={{ width: '100%', height: '100%' }}>
			<TableContainer
				component={Paper}
				ref={tableRef}
				sx={{
					width: '100%',
					boxShadow: 3,
					borderRadius: '12px',
					height: tableHeight,
				}}
			>
				<Table sx={{ minWidth: 700, tableLayout: 'auto' }} stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell sx={{ whiteSpace: 'nowrap', width: 'max-content' }}>
								#
							</TableCell>
							{columns.map(column => (
								<TableCell
									key={column}
									sx={{ whiteSpace: 'nowrap', width: 'max-content' }}
								>
									{column.toUpperCase()}
								</TableCell>
							))}
							<TableCell sx={{ whiteSpace: 'nowrap', width: '200px' }}>
								ACTIONS
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredData.map((row, rowIndex) => (
							<TableRow key={rowIndex}>
								<TableCell sx={{ whiteSpace: 'nowrap', width: 'max-content' }}>
									{rowIndex + 1}
								</TableCell>
								{columns.map(column => (
									<TableCell
										key={column}
										sx={{ whiteSpace: 'nowrap', width: 'max-content' }}
									>
										{renderCellContent(row[column], column)}
									</TableCell>
								))}
								<TableCell sx={{ whiteSpace: 'nowrap', width: '200px' }}>
									<IconButton color='primary' onClick={() => handleEdit(row)}>
										<EditIcon sx={{ color: '#5F27CD' }} />
									</IconButton>
									<IconButton
										color='error'
										onClick={() => handleOpenDialog(row._id)}
									>
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>Підтвердити видалення</DialogTitle>
				<DialogContent>
					<Typography sx={{ mt: 3, mb: 1 }}>
						Ви впевнені, що хочете видалити цей елемент?
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

export default DynamicTable
