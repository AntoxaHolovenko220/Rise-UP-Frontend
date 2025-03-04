import AddIcon from '@mui/icons-material/Add' // Иконка "+"
import SearchIcon from '@mui/icons-material/Search' // Иконка "Поиск"
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material'

interface SearchBarProps {
	onSearch: (searchTerm: string) => void
	onAddRecruiter: () => void
}

const RecruitersSearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	onAddRecruiter,
}) => {
	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				gap: 2,
				alignItems: 'center',
				backgroundColor: '#F8F9FA',
				borderRadius: 2,
				mt: 1,
				mb: 2,
			}}
		>
			{/* Поле поиска */}
			<TextField
				fullWidth
				variant='outlined'
				placeholder='Пошук рекрутерів...'
				onChange={e => onSearch(e.target.value)}
				sx={{
					height: '56px',
					'& .MuiOutlinedInput-root': {
						'&:hover fieldset': {
							borderColor: '#5F27CD',
						},
						'&.Mui-focused fieldset': {
							borderColor: '#5F27CD', //
						},
					},
				}} // Устанавливаем высоту в один уровень с кнопками
			/>

			{/* Кнопка поиска */}
			<Button
				variant='contained'
				color='secondary'
				sx={{ height: '56px', minWidth: '140px' }}
				startIcon={<SearchIcon />} // Иконка "Поиск"
			>
				Пошук
			</Button>

			{/* Кнопка добавления рекрутера */}
			<Button
				variant='contained'
				onClick={onAddRecruiter}
				startIcon={<AddIcon />} // Иконка "+"
				sx={{ height: '56px', minWidth: '160px', bgcolor: '#5F27CD' }}
			>
				Додати
			</Button>
		</Box>
	)
}

export default RecruitersSearchBar
