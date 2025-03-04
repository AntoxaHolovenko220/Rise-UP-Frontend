import { RabotaUaPage } from '@/pages'
import { lazy } from 'react'

const LoginPage = lazy(() => import('@pages/LoginPage'))
const DashboardPage = lazy(() => import('@pages/DashboardPage'))
const CandidatesPage = lazy(() => import('@pages/CandidatesPage'))
const CandidatePage = lazy(() => import('@pages/CandidatePage'))
const RecruitersPage = lazy(() => import('@pages/RecruitersPage'))
const RecruiterPage = lazy(() => import('@pages/RecruiterPage'))
const CitiesPage = lazy(() => import('@pages/CitiesPage'))
const StatisticsPage = lazy(() => import('@pages/StatisticsPage'))
const SettingsPage = lazy(() => import('@pages/SettingsPage'))

interface RouteType {
	path: string
	element: React.ComponentType
	title: string
	protected?: boolean
}

const routes: RouteType[] = [
	{ path: '/', element: LoginPage, title: 'Login - Rise UP' },
	{
		path: '/dashboard',
		element: DashboardPage,
		title: 'Dashboard - Rise UP',
		protected: true,
	},
	{
		path: '/candidates',
		element: CandidatesPage,
		title: 'Candidates - Rise UP',
		protected: true,
	},
	{
		path: '/recruiters',
		element: RecruitersPage,
		title: 'Recruiters - Rise UP',
		protected: true,
	},
	{
		path: '/cities',
		element: CitiesPage,
		title: 'Cities - Rise UP',
		protected: true,
	},
	{
		path: '/statistics',
		element: StatisticsPage,
		title: 'Statistics - Rise UP',
		protected: true,
	},
	{
		path: '/settings',
		element: SettingsPage,
		title: 'Settings - Rise UP',
		protected: true,
	},
	{
		path: '/recruiter/:id',
		element: RecruiterPage,
		title: 'Recruiter - Rise UP',
		protected: true,
	},
	{
		path: '/candidate/:id',
		element: CandidatePage,
		title: 'Candidate - Rise UP',
		protected: true,
	},
]

export default routes
