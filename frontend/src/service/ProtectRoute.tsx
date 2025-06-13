import { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth.tsx'

interface ProtectedRouteProps {
	element: ReactElement
	roles: string[]
}

const ProtectedRoute = ({ element, roles }: ProtectedRouteProps) => {
	const { user, isLoading } = useAuth()
	const location = useLocation()

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	if (!user) {
		return <Navigate to='/' state={{ from: location }} replace />
	}

	const userRole = user.role.trim().toLowerCase()
	const allowedRoles = roles.map(role => role.trim().toLowerCase())

	if (!allowedRoles.includes(userRole)) {
		console.warn(`Доступ запрещён: ${userRole} не входит в [${allowedRoles}]`)
		return <Navigate to='/403' replace />
	}

	return element
}

export default ProtectedRoute
