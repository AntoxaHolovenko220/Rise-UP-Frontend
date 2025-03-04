import { useAuthStore } from '@/store/authStore'
import axios from 'axios'
import { toast } from 'react-toastify'
import axiosInstance from './axiosInstance'

const LOGIN_URL = 'https://auth-api.robota.ua/Login'
const RESUME_FILE_URL = 'https://employer-api.robota.ua/resume/file'

// 🔹 Функция получения токена
export const getAuthToken = async (): Promise<string | null> => {
	try {
		const { rabotaEmail, rabotaPassword } = useAuthStore.getState()

		if (!rabotaEmail || !rabotaPassword) {
			console.error('Ошибка: не удалось получить логин или пароль из Store')
			return null
		}

		const response = await axios.post<string>(
			LOGIN_URL,
			{ username: rabotaEmail, password: rabotaPassword },
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			}
		)

		if (response.status !== 200) {
			throw new Error(`Ошибка авторизации! Статус: ${response.status}`)
		}

		const token = response.data.trim()
		console.log('✅ Токен успешно получен:', token)
		return token
	} catch (error) {
		console.error('❌ Ошибка получения токена:', error)
		return null
	}
}

// 🔹 Функция получения данных кандидата
export const fetchCandidatesData = async (candidateUrl: string) => {
	try {
		const token = await getAuthToken()
		if (!token) throw new Error('❌ Ошибка: Токен не получен.')

		// Извлекаем ID кандидата из ссылки
		const match = candidateUrl.match(/\/candidates\/(\d+)/)
		if (!match) {
			alert('⚠️ Неверный формат ссылки!')
			return null
		}
		const candidateId = match[1]

		console.log(`🔹 Запрос данных кандидата с ID: ${candidateId}`)

		const response = await axios.get(
			`https://employer-api.robota.ua/resume/${candidateId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
			}
		)

		if (response.status !== 200) {
			throw new Error(`Ошибка загрузки данных! Статус: ${response.status}`)
		}

		console.log('✅ Данные кандидата:', response.data)

		// Обработка данных
		const educationArray =
			response.data.educations?.map(
				(ed: any) =>
					`${ed.name}${ed.speciality ? `, ${ed.speciality}` : ''}, ${
						ed.yearOfGraduation
					}`
			) || []

		const experiencesArray =
			response.data.experiences?.map(
				(exp: any) => `${exp.position} в компании ${exp.company}`
			) || []

		// Получаем контактный телефон
		let phoneNumber = ''
		const contact = response.data.contacts?.find(
			(contact: any) =>
				contact.typeId === 'Phone' || contact.typeId === 'SocialNetwork'
		)

		if (contact) {
			if (contact.typeId === 'Phone') {
				phoneNumber = contact.description
			} else if (contact.typeId === 'SocialNetwork') {
				if (contact.subTypeId === 'telegram') {
					phoneNumber = contact.description.replace('https://t.me/', '')
				} else if (contact.subTypeId === 'viber') {
					phoneNumber = contact.description.replace('viber://chat?number=', '')
				}
			}
		}

		// Данные для отправки в CRM
		const payload = {
			firstname: response.data.name,
			surname: response.data.fatherName,
			lastname: response.data.surname,
			email: response.data.email,
			phone: phoneNumber,
			profession: response.data.speciality,
			education: educationArray,
			experience: experiencesArray,
			resumeId: response.data.resumeId,
			notebookId: response.data.notebookId,
			img: `https://cv-photos-original.robota.ua/cdn-cgi/image/w=300/${response.data.photo}`,
		}

		// Отправляем данные в CRM
		await axiosInstance.post('/leads/create', payload, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})

		toast.success('Кандидат успешно создан!')
		return response.data
	} catch (error) {
		console.error('❌ Ошибка получения данных кандидата:', error)
		return null
	}
}

// 🔹 Функция скачивания файла резюме
export const fetchResumeFile = async (
	cvId: string,
	notebookId: string
): Promise<void> => {
	try {
		const token = await getAuthToken()
		if (!token) throw new Error('❌ Ошибка: Токен не получен.')

		console.log(
			`🔹 Запрос на скачивание резюме для CvId: ${cvId}, NotebookId: ${notebookId}`
		)

		const response = await axios.get(RESUME_FILE_URL, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: '*/*',
			},
			params: { CvId: cvId, notebookId: notebookId },
			responseType: 'blob',
		})

		if (response.status !== 200) {
			throw new Error(
				`Ошибка при скачивании резюме! Статус: ${response.status}`
			)
		}

		// Определяем расширение файла
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
		link.setAttribute('download', `resume_${cvId}${fileExtension}`)
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		console.log(
			`✅ Файл успешно загружен в формате ${fileExtension.toUpperCase()}!`
		)
	} catch (error) {
		console.error('❌ Ошибка загрузки файла резюме:', error)
	}
}
