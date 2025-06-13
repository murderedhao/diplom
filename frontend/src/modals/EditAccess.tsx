import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import copy from '../assets/copyClipboard.svg'
import { updateDirectusUser } from '../service/onSubmit'
import { PatientDataI, UserDataI } from '../types/types'

interface Props {
	isActive: boolean
	setIsActive: (v: boolean) => void
	patient: PatientDataI | UserDataI | null
}

const EditAccess = ({ isActive, setIsActive, patient }: Props) => {
	const [password, setPassword] = useState<string>('')
	const [showNewPasswordAlert, setShowNewPasswordAlert] =
		useState<boolean>(false)

	const { register, handleSubmit, reset } = useForm<UserDataI>()

	if (!isActive) return null

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			closeForm()
		}
	}

	const generatePassword = (e: React.MouseEvent) => {
		e.preventDefault()
		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
		setPassword(
			Array.from({ length: 12 }, () =>
				chars.charAt(Math.floor(Math.random() * chars.length))
			).join('')
		)
		setShowNewPasswordAlert(true)
	}

	const copyToClipboard = (e: React.MouseEvent) => {
		e.preventDefault()
		navigator.clipboard.writeText(password).then(() => {})
	}

	const closeForm = () => {
		setPassword('')
		setShowNewPasswordAlert(false)
		setIsActive(false)
	}

	const onSubmitForm = (data: UserDataI) => {
		const accessToken = patient?.access
		console.log('access token', accessToken)
		updateDirectusUser(data, accessToken)
		console.log(data)
		closeForm()
		reset()
	}

	return (
		isActive && (
			<form
				onSubmit={handleSubmit(onSubmitForm)}
				className='fixed top-0 left-0 w-full h-full bg-[#1F1F1F] bg-opacity-[30%] overflow-hidden overflow-y-auto transition-opacity duration-300 z-[99998] flex justify-center items-center px-4 sm:px-[168px]'
				onClick={handleOverlayClick}
			>
				<div className='bg-[#FFFFFF] rounded-[12px] border-[0.5px] border-[#B9B9B9] py-6 px-4 sm:px-8 w-full max-w-[800px]'>
					<h1 className='font-openSans text-[20px] font-bold mb-5'>
						Редактирование пароля
					</h1>
					{!password && (
						<div className='mb-4 p-4 bg-[#FFD0D0] relative'>
							<p className='font-openSans text-[16px] sm:text-[20px]'>
								Сгенерируйте новый пароль, чтобы открыть доступ
							</p>
							<div className='absolute left-0 top-0 h-full w-[8px] bg-[#991B1B]'></div>
						</div>
					)}
					<div className='flex flex-col justify-between w-full gap-4 sm:flex-row'>
						<div className='flex flex-col w-full gap-1'>
							<label
								className='text-left font-openSans text-[16px]'
								htmlFor='name'
							>
								Номер телефона<span className='text-red-600'>*</span>
							</label>
							<input
								className='w-full border-[1px] border-[#1A1A1A] p-3 sm:p-4 rounded-[12px]'
								type='tel'
								id='tel'
								placeholder='+7 (233)-333-3333'
								{...register('phone_number')}
							/>
						</div>
						<div className='flex flex-col w-full gap-1'>
							<label
								className='text-left font-openSans text-[16px]'
								htmlFor='tel'
							>
								ФИО<span className='text-red-600'>*</span>
							</label>
							<input
								className='w-full border-[1px] border-[#1A1A1A] p-3 sm:p-4 rounded-[12px]'
								type='text'
								id='name'
								placeholder='Иванов Иван Иванович'
								{...register('name')}
							/>
						</div>
					</div>
					<div className='flex flex-col w-full gap-1 mt-4'>
						<label
							className='text-left font-openSans text-[16px]'
							htmlFor='notes'
						>
							Дополнительная информация
						</label>
						<textarea
							className='w-full border-[1px] border-[#1A1A1A] p-3 sm:p-4 rounded-[12px] resize-none'
							id='notes'
							placeholder='Введите дополнительные заметки...'
							rows={4}
							{...register('discription')}
						/>
					</div>
					{showNewPasswordAlert && (
						<div className='p-4 bg-[#E6FFDA] mt-3 relative'>
							<p className='text-[20px] font-openSans'>
								Задан новый пароль. Скопируйте его
							</p>
							<div className='absolute left-0 top-0 h-full w-[8px] bg-[#16A34A]'></div>
						</div>
					)}
					<div className='flex flex-col justify-between w-full gap-4 mt-4 sm:flex-row'>
						<div className='flex flex-col w-full gap-1'>
							<label className='font-openSans text-[16px]'>Логин</label>
							<input
								className='w-full border-[1px] border-[#1A1A1A] p-3 sm:p-4 rounded-[12px]'
								type='text'
								placeholder='+7 (233)-333-3333'
								{...register('username', { required: true })}
							/>
						</div>
						<div className='flex flex-col w-full gap-1'>
							<label htmlFor=''>Пароль</label>
							<div className='relative'>
								<input
									className='w-full border-[1px] border-[#1A1A1A] p-3 sm:p-4 rounded-[12px] pr-12'
									type='text'
									placeholder='9yu-63dUkS'
									value={password}
									readOnly
									{...register('password', { required: true })}
								/>
								{password && (
									<button
										type='button'
										className='absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-3 py-1 rounded-[6px] text-sm'
										onClick={copyToClipboard}
									>
										<img src={copy} alt='Копировать' />
									</button>
								)}
							</div>
						</div>
					</div>
					<div className='block'>
						<button
							type='button'
							className='flex w-[%] text-[12px] bg-[#1A1A1A] text-white px-[79px] py-[12.5px] rounded-[10px] mt-4'
							onClick={generatePassword}
						>
							Сгенерировать новый пароль
						</button>
					</div>
					<div className='flex flex-col w-full gap-4 mt-5 sm:flex-row'>
						<button
							type='submit'
							className='w-full sm:w-[25%] bg-[#1A1A1A] text-[#FFFFFF] py-2 px-3 sm:px-4 rounded-[10px] text-[18px]'
						>
							Сохранить
						</button>
						<button
							type='button'
							onClick={closeForm}
							className='w-full sm:w-[25%] border-[1px] border-[#D4D4D8] px-3 sm:px-4 rounded-[10px] text-[18px]'
						>
							Отмена
						</button>
					</div>
				</div>
			</form>
		)
	)
}

export default EditAccess
