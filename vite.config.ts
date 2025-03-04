import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: ' https://auth-api.robota.ua',
				changeOrigin: true,
				secure: false,
				rewrite: path => path.replace(/^\/api/, '/api'),
			},
		},
	},
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@api': path.resolve(__dirname, 'src/api'),
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@routes': path.resolve(__dirname, 'src/routes'),
			'@store': path.resolve(__dirname, 'src/store'),
			'@hooks': path.resolve(__dirname, 'src/hooks'),
			'@types': path.resolve(__dirname, 'src/types'),
			'@utils': path.resolve(__dirname, 'src/utils'),
		},
	},
})
