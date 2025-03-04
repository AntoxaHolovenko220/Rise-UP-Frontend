import {
	TextField,
	TextFieldProps,
	IconButton,
	InputAdornment,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { forwardRef, useState } from 'react'

interface Props extends Omit<TextFieldProps, 'variant'> {
	error?: boolean
	helperText?: string
}

const Input = forwardRef<HTMLInputElement, Props>(
	({ type, error, helperText, ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false)

		return (
			<TextField
				fullWidth
				margin='normal'
				inputRef={ref}
				error={error}
				helperText={helperText}
				type={type === 'password' && !showPassword ? 'password' : 'text'}
				InputProps={{
					endAdornment:
						type === 'password' ? (
							<InputAdornment position='end'>
								<IconButton
									onClick={() => setShowPassword(prev => !prev)}
									edge='end'
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						) : undefined,
				}}
				{...props}
			/>
		)
	}
)

export default Input
