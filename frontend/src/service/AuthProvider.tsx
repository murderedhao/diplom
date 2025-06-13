import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tokens, User } from '../types/types.ts'
import { AuthContext } from './useAuth.tsx'
import { getRedirectPath } from './utils'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()

	const logout = () => {
		localStorage.clear()
		setUser(null)
		navigate('/')
	}

	const initializeUserFromStorage = () => {
		const token = localStorage.getItem('token')
		const role = localStorage.getItem('role')
		const fullName = localStorage.getItem('fullName')
		const status = localStorage.getItem('status') as
			| 'active'
			| 'inactive'
			| null

		if (token && role && fullName && status) {
			if (status === 'inactive') {
				alert('Ваш аккаунт деактивирован. Обратитесь к администратору.')
				logout()
				return
			}

			setUser({ role, fullName, status })
		}
	}

	useEffect(() => {
		initializeUserFromStorage()
		setIsLoading(false)
	}, [])

	const login = (
		tokens: Tokens,
		role: string,
		fullName: string,
		status: 'active' | 'inactive'
	) => {
		if (status === 'inactive') {
			alert('Ваш аккаунт деактивирован. Обратитесь к администратору.')
			return
		}

		localStorage.setItem('token', tokens.access_token)
		localStorage.setItem('refreshToken', tokens.refresh_token)
		localStorage.setItem('role', role)
		localStorage.setItem('fullName', fullName)
		localStorage.setItem('status', status)

		const newUser: User = { role, fullName, status }
		setUser(newUser)
		navigate(getRedirectPath(role))
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
			{!isLoading && user?.status !== 'inactive' && children}
		</AuthContext.Provider>
	)
}
