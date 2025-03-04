import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Typography } from '@mui/material'
import ukraineGeo1 from './UkraineGeojson/UkraineGeo1.json'
import axiosInstance from '../../../../api/axiosInstance'

const Filials = () => {
	const mapRef = useRef(null)
	const [filials, setFilials] = useState([])

	useEffect(() => {
		const fetchFilials = async () => {
			try {
				const response = await axiosInstance.get('/filials')
				setFilials(response.data)
			} catch (error) {
				console.error('Ошибка загрузки филиалов:', error)
			}
		}
		fetchFilials()
	}, [])

	useEffect(() => {
		if (!filials.length) return

		const map = L.map(mapRef.current, {
			zoomControl: false,
			scrollWheelZoom: false,
			doubleClickZoom: false,
			touchZoom: false,
			dragging: false,
			boxZoom: false,
			keyboard: false,
		}).setView([48.3794, 31.1656], 6)

		L.geoJSON(ukraineGeo1, {
			style: {
				color: 'gray',
				fillColor: 'white',
				fillOpacity: 0.5,
				weight: 2,
			},
		}).addTo(map)

		map.eachLayer(layer => {
			if (layer instanceof L.TileLayer) {
				map.removeLayer(layer)
			}
		})

		const cities = [
			{ name: 'Дніпро', coords: [48.4647, 35.0462] },
			{ name: 'Київ', coords: [50.4501, 30.5234] },
			{ name: 'Харків', coords: [49.9935, 36.2304] },
			{ name: 'Одеса', coords: [46.4825, 30.7326] },
			{ name: 'Львів', coords: [49.8397, 24.0297] },
			{ name: 'Запоріжжя', coords: [47.8388, 35.1396] },
			{ name: 'Вінниця', coords: [49.2331, 28.4682] },
			{ name: 'Полтава', coords: [49.5883, 34.5514] },
			{ name: 'Чернігів', coords: [51.4982, 31.2893] },
			{ name: 'Черкаси', coords: [49.4444, 32.0597] },
			{ name: 'Суми', coords: [50.9077, 34.7981] },
			{ name: 'Тернопіль', coords: [49.5535, 25.5948] },
			{ name: 'Рівне', coords: [50.6199, 26.2516] },
			{ name: 'Луцьк', coords: [50.7472, 25.3254] },
			{ name: 'Івано-Франківськ', coords: [48.9226, 24.7111] },
			{ name: 'Ужгород', coords: [48.6208, 22.2879] },
			{ name: 'Хмельницький', coords: [49.4229, 26.9871] },
			{ name: 'Житомир', coords: [50.2547, 28.6587] },
			{ name: 'Кропивницький', coords: [48.5079, 32.2623] },
			{ name: 'Миколаїв', coords: [46.975, 31.9946] },
			{ name: 'Херсон', coords: [46.6354, 32.6169] },
			{ name: 'Чернівці', coords: [48.2921, 25.9358] },
			{ name: 'Донецьк', coords: [48.0159, 37.8029] },
			{ name: 'Луганськ', coords: [48.574, 39.3078] },
		]

		// 🔥 Фильтруем только города, которые есть в филиалах
		const filialCities = filials.map(f => f.name) // Получаем список городов из БД
		const matchingCities = cities.filter(city =>
			filialCities.includes(city.name)
		) // Сопоставляем

		// 🔹 Добавляем маркеры только для совпадающих городов
		matchingCities.forEach(city => {
			L.circleMarker(city.coords, {
				radius: 6,
				fillColor: '#00BFFF',
				color: '#00BFFF',
				opacity: 1,
				fillOpacity: 0.7,
			})
				.addTo(map)
				.bindPopup(city.name)
		})

		return () => map.remove()
	}, [filials])

	return (
		<Box sx={{ width: '100%', mx: 'auto', p: 1 }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 1,
				}}
			>
				<Typography variant='h4' component='h2' sx={{ m: 0 }}>
					Філіали Rise UP
				</Typography>
				<Typography
					variant='body1'
					sx={{ fontSize: '14px', fontWeight: 'bold' }}
				>
					Export
				</Typography>
			</Box>
			<Box
				sx={{
					height: '600px',
					'& .leaflet-container': { background: 'transparent' },
				}}
			>
				<Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />
			</Box>
		</Box>
	)
}

export default Filials
