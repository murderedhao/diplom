import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import arrow from '../assets/arrow.svg'
import hidePassword from '../assets/hidePassword.svg'
import logo from '../assets/logo&company.svg'
import { useAuth } from '../service/useAuth.tsx'
import { getRedirectPath } from '../service/utils'
import styles from '../styles/Login.module.css'
import { Auth } from '../types/types'

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const { register, handleSubmit, reset } = useForm<Auth>()
	const { login } = useAuth()
	const navigate = useNavigate()

	const onSubmitForm = async (data: Auth) => {
		setError(null)
		try {
			const directus_url = import.meta.env.VITE_API_DIRECTUS_URL

			const initialResponse = await fetch(
				`${directus_url}/new-patient/auth-patient`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						username: data.login,
						password: data.password,
					}),
				}
			)

			const initialResult = await initialResponse.json()
			if (!initialResponse.ok) {
				throw new Error(
					initialResult.errors?.[0]?.message || 'Ошибка авторизации'
				)
			}

			const authResponse = await fetch(`${directus_url}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: initialResult.email,
					password: data.password,
				}),
			})

			const authResult = await authResponse.json()
			if (!authResponse.ok) {
				throw new Error(authResult.errors?.[0]?.message || 'Ошибка входа')
			}

			const tokens = authResult.data
			const userResponse = await fetch(`${directus_url}/users/me`, {
				headers: {
					Authorization: `Bearer ${tokens.access_token}`,
					'Content-Type': 'application/json',
				},
			})

			if (!userResponse.ok) {
				throw new Error('Не удалось получить пользователя')
			}

			const userData = await userResponse.json()
			const userRole = userData.data.role
			const userFio = userData.data.last_name || 'Неизвестный'
			const userStatus = userData.data.status
			console.log(userData.data)

			login(tokens, userRole, userFio, userStatus)
			navigate(getRedirectPath(userRole))
		} catch (error: unknown) {
			console.error('Auth error:', error)
			setError(
				error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
			)
			reset()
		}
	}

	return (
		<div className={styles.background__login}>
			<div className='flex items-center justify-center'>
				<div className='bg-[#FFFFFF] rounded-md border-[0.5px] border-[#B9B9B9] p-8 w-full ml-[420px] mr-[420px] mt-[237px] mb-[237px] min-w-[350px] max-w-[600px]'>
					<div className='flex justify-center'>
						<img src={logo} alt='Logo' />
					</div>
					<div className='gap-1 mt-1 text-center'>
						<h1 className='text-[20px] font-openSans font-normal'>
							Авторизация
						</h1>
						<p className='font-openSans font-normal text-[16px]'>
							Пожалуйста, заполните данные
						</p>
					</div>
					{error && <p className='mt-2 text-center text-red-500'>{error}</p>}
					<form onSubmit={handleSubmit(onSubmitForm)}>
						<div className='flex flex-col mt-5'>
							<label className='font-openSans text-[16px]'>Логин/Номер</label>
							<input
								className='bg-[#F1F4F9] rounded-[12px] p-4 w-full border-[#E4E4E7] border-[1px] focus:outline-none focus:border-[#1A1A1A]'
								placeholder='johndoe@gmail.com'
								{...register('login', { required: true })}
							/>
						</div>
						<div className='flex flex-col mt-2'>
							<label className='font-openSans text-[16px]'>Пароль</label>
							<div className='relative'>
								<input
									type={showPassword ? 'text' : 'password'}
									className='bg-[#F1F4F9] rounded-[12px] p-4 w-full border-[#E4E4E7] border-[1px] focus:outline-none focus:border-[#1A1A1A]'
									placeholder='********************'
									{...register('password', { required: true })}
								/>
								<img
									className='absolute cursor-pointer top-5 right-4'
									src={hidePassword}
									alt='Toggle Password'
									onClick={() => setShowPassword(!showPassword)}
								/>
							</div>
						</div>
						<div className='flex justify-center mt-4'>
							<button
								type='submit'
								className='flex bg-[#007AFF] w-full justify-center items-center py-4 rounded-[12px] text-[#FFFFFF] gap-[8px] font-openSans hover:bg-[#005bb5]'
							>
								Войти
								<img src={arrow} alt='Arrow' />
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default LoginPage
