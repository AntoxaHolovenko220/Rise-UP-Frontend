import { login } from '@/api'
import { Button, Input } from '@/components/UI'
import type { DecodedToken } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar, Box, Typography } from '@mui/material'
import { useAuthStore } from '@store/authStore'
import { jwtDecode } from 'jwt-decode'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import OwlImage from '@assets/obrez owl 2.svg'

const schema = yup.object().shape({
	email: yup.string().email('Невалідний email').required("Email обов'язковий"),
	password: yup
		.string()
		.min(5, 'Пароль має бути від 5 символів')
		.required("Пароль обов'язковий"),
})

const inputStyles = {
	'& .MuiOutlinedInput-root': {
		'& fieldset': { borderColor: '#f0efdd' },
		'&:hover fieldset': { borderColor: '#f0efdd' },
		'&.Mui-focused fieldset': { borderColor: '#f0efdd' },
	},
}

const LoginPage = () => {
	const navigate = useNavigate()
	const { setToken, setUserRole } = useAuthStore()

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
	})

	const handleLogin = async (data: { email: string; password: string }) => {
		try {
			const response = await login(data.email, data.password)

			if (!response || !response.access_token) {
				throw new Error('❌ Сервер вернул некорректный ответ!')
			}

			setToken(response.access_token)

			const decoded: DecodedToken = jwtDecode(response.access_token)

			const decodedRole = decoded.role?.toLowerCase() as 'admin' | 'hr'
			const validRoles = ['admin', 'hr'] as const
			const role: 'admin' | 'hr' = validRoles.includes(decodedRole)
				? decodedRole
				: 'hr'

			setUserRole(role)
			localStorage.setItem('userRole', role)

			toast.success('Вхід успішний!')
			navigate('/dashboard')
		} catch (error: any) {
			console.error(error) // Логирование для отладки

			if (error.response?.status === 401) {
				toast.error('Невірний логін або пароль!')
			} else if (error.response?.status === 403) {
				toast.error('Вхід заборонено! Ваш акаунт неактивний.')
			} else {
				toast.error('Помилка входу! Перевірте дані.')
			}
		}
	}

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				display: 'flex',
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				flexDirection: { xs: 'column', md: 'row' },
			}}
		>
			{/* Левая часть */}
			<Box
				sx={{
					width: '50%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative',
				}}
			>
				{/* Логотип */}
				<Box
					sx={{
						position: 'absolute',
						top: '20px',
						left: '30px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<Typography
						component='div'
						sx={{ fontSize: '19px', fontWeight: '600' }}
					>
						Rise UP
					</Typography>
				</Box>

				{/* Форма логина */}
				<form
					onSubmit={handleSubmit(handleLogin)}
					noValidate
					style={{ width: '400px' }}
				>
					<Typography sx={{ fontSize: '38px' }}>Ласкаво просимо</Typography>
					<Typography
						sx={{ fontSize: '15px', color: 'grey', marginBottom: '20px' }}
					>
						Ласкаво просимо назад! Будь ласка, введіть свої дані
					</Typography>

					<Typography sx={{ fontSize: '15px', color: '#171717', mb: -2 }}>
						Email
					</Typography>
					<Input
						placeholder='Введіть email'
						{...register('email')}
						error={!!errors.email}
						helperText={errors.email?.message}
						sx={inputStyles}
					/>

					<Typography
						sx={{
							fontSize: '15px',
							color: '#171717',
							marginTop: '20px',
							mb: -2,
						}}
					>
						Password
					</Typography>
					<Input
						placeholder='Введіть password'
						type='password'
						{...register('password')}
						error={!!errors.password}
						helperText={errors.password?.message}
						sx={inputStyles}
					/>

					<Box
						sx={{
							display: 'flex',
							margin: '10px 0px',
							justifyContent: 'space-between',
						}}
					>
						<Typography
							sx={{ marginLeft: '20px', fontSize: '15px', color: '#171717' }}
						>
							Запам'ятати на 30 днів
						</Typography>
						<Typography
							sx={{ fontSize: '15px', color: '#7321d1', cursor: 'pointer' }}
						>
							Забули пароль
						</Typography>
					</Box>

					<Button
						type='submit'
						label='Sign in'
						variant='contained'
						fullWidth
						isLoading={isSubmitting}
						disabled={
							!isValid || isSubmitting || !watch('email') || !watch('password')
						}
						sx={{
							mt: 2,
							height: '46px',
							bgcolor: '#7321d1',
							textTransform: 'none',
							fontSize: '16px',
							'&:hover': { bgcolor: '#7321d1' },
						}}
					/>
				</form>

				{/* Нижний логотип */}
				<Box
					sx={{
						position: 'absolute',
						bottom: '20px',
						left: '30px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<Typography sx={{ fontSize: '14px', color: 'gray' }}>
						Rise UP
					</Typography>
				</Box>
			</Box>
			{/* Правая часть */}
			<Box
				sx={{
					width: '50%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Box
					component='img'
					src={OwlImage}
					alt='Описание изображения'
					sx={{ width: 400, height: 'auto' }}
				/>
				<Typography
					variant='h3'
					sx={{
						mt: 4,
						fontWeight: 'bold',
						background: 'linear-gradient(to right, #FF6B6B, #5F27CD)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						display: 'block',
					}}
				>
					Rise UP
				</Typography>
			</Box>
		</Box>
	)
}

export default LoginPage
