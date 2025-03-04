import axiosInstance from '@/api/axiosInstance'
import { fetchCandidatesData, fetchResumeFile } from '@/api/candidates'
import AddIcon from '@mui/icons-material/Add'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const ParserBlock: React.FC = () => {
	const [candidateUrl, setCandidateUrl] = useState('')
	const [candidateId, setCandidateId] = useState<string | null>(null)

	const handleAddCandidate = async () => {
		if (!candidateUrl) {
			alert('Введите ссылку на кандидата!')
			return
		}

		const responseData = {
			url: candidateUrl,
			email: localStorage.getItem('rabotaEmail'),
			password: localStorage.getItem('rabotaPassword'),
		}

		try {
			const { data } = await axiosInstance.post(
				`/leads/rabota/create`,
				responseData
			)
			toast.success('Кандидат успішно створений!')
			console.log('Кандидат создан успешно', data)
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// Сервер ответил с ошибкой
				if (error.response) {
					console.error('Ошибка сервера:', error.response.data)
					toast.error(
						`Помилка: ${error.response.data.message || 'Сталася помилка'}`
					)
				}
				// Запрос был отправлен, но ответа не было
				else if (error.request) {
					console.error('Нет ответа от сервера:', error.request)
					toast.error('Помилка: сервер не відповідає')
				}
				// Ошибка при настройке запроса
				else {
					console.error('Ошибка при отправке запроса:', error.message)
					toast.error('Помилка: не вдалося відправити запит')
				}
			} else {
				// Непредвиденная ошибка
				console.error('Невідома помилка:', error)
				toast.error('Сталася невідома помилка')
			}
		}
	}

	const handleDownloadResume = async () => {
		if (!candidateId) {
			alert('Сначала получите данные кандидата!')
			return
		}

		// Достаём notebookId
		const candidateData = await fetchCandidatesData(
			`https://robota.ua/candidates/${candidateId}`
		)
		if (!candidateData) {
			alert('Не удалось получить данные кандидата!')
			return
		}

		const notebookId = candidateData.notebookId
		if (!notebookId) {
			alert('Ошибка: notebookId не найден!')
			return
		}

		await fetchResumeFile(candidateId, notebookId)
	}

	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				gap: 2,
				alignItems: 'center',
				backgroundColor: '#F8F9FA',
				mt: 1,
				mb: 2,
			}}
		>
			<TextField
				fullWidth
				variant='outlined'
				placeholder='Введите ссылку на кандидата...'
				value={candidateUrl}
				onChange={e => setCandidateUrl(e.target.value)}
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
				}}
			/>

			<Button
				variant='contained'
				onClick={handleAddCandidate}
				startIcon={<AddIcon />}
				sx={{ height: '56px', minWidth: '160px', bgcolor: '#5F27CD' }}
			>
				Додати
			</Button>
		</Box>
	)
}

export default ParserBlock
