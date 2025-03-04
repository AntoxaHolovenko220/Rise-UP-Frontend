import {
	ButtonProps,
	CircularProgress,
	Button as MUIButton,
} from '@mui/material'
import React from 'react'

interface Props extends ButtonProps {
	label: string
	isLoading?: boolean
}

const Button: React.FC<Props> = ({ label, isLoading, ...props }) => {
	return (
		<MUIButton {...props} disabled={isLoading || props.disabled}>
			{isLoading ? <CircularProgress size={24} color='inherit' /> : label}
		</MUIButton>
	)
}

export default Button
