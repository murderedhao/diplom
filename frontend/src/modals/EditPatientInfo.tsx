import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select, { MultiValue, SingleValue } from 'react-select'
import copy from '../assets/copyClipboard.svg'
import {
	controlStatusOptions,
	operatorOptions,
	Option,
	statusOptions,
	treatmentStatusOptions,
} from '../selectOptions/selectOptions'
import { customStyles } from '../selectOptions/selectStyles'
import { onSubmitUpdate, updateDirectusUser } from '../service/onSubmit'
import { useAuth } from '../service/useAuth'
import { PatientDataI, UserDataI } from '../types/types'

interface PropsModal {
	isActive: boolean
	setIsActive: (v: boolean) => void
	patient: PatientDataI | null
}

type ValueType<IsMulti extends boolean> = IsMulti extends true
	? MultiValue<Option>
	: SingleValue<Option>

const EditPatientInfo = ({ isActive, setIsActive, patient }: PropsModal) => {
	const [password, setPassword] = useState<string>('')
	const [showNewPasswordAlert, setShowNewPasswordAlert] =
		useState<boolean>(false)
	const [operators, setOperators] = useState<Option[]>([])

	// Состояния для выбранных значений Select
	const [selectedOperator, setSelectedOperator] =
		useState<ValueType<false>>(null)
	const [selectedStatus, setSelectedStatus] = useState<ValueType<false>>(null)
	const [selectedTreatmentStatus, setSelectedTreatmentStatus] =
		useState<ValueType<false>>(null)
	const [selectedControlStatusFirst, setSelectedControlStatusFirst] =
		useState<ValueType<false>>(null)
	const [selectedControlStatusThird, setSelectedControlStatusThird] =
		useState<ValueType<false>>(null)
	const [selectedControlStatusSixth, setSelectedControlStatusSixth] =
		useState<ValueType<false>>(null)
	const [selectedControlStatusTwelfth, setSelectedControlStatusTwelfth] =
		useState<ValueType<false>>(null)

	// Инициализация формы
	const patientData = useForm<PatientDataI>()
	const userData = useForm<UserDataI>()

	const { user } = useAuth()
	const adminRole = import.meta.env.VITE_API_ADMIN_TOKEN

	// Инициализация всех состояний при получении данных пациента
	useEffect(() => {
		if (patient) {
			// Сбрасываем форму с данными пациента
			patientData.reset(patient)

			// Инициализация Select-ов
			const operator = operators.find(opt => opt.label === patient.operator)
			setSelectedOperator(operator || null)

			const status = statusOptions.find(opt => opt.label === patient.status)
			setSelectedStatus(status || null)

			const treatmentStatus = treatmentStatusOptions.find(
				opt => opt.label === patient.treatment_status
			)
			setSelectedTreatmentStatus(treatmentStatus || null)

			const controlFirst = controlStatusOptions.find(
				opt => opt.label === patient.control_month
			)
			setSelectedControlStatusFirst(controlFirst || null)

			const controlThird = controlStatusOptions.find(
				opt => opt.label === patient.control_three_months
			)
			setSelectedControlStatusThird(controlThird || null)

			const controlSixth = controlStatusOptions.find(
				opt => opt.label === patient.control_six_months
			)
			setSelectedControlStatusSixth(controlSixth || null)

			const controlTwelfth = controlStatusOptions.find(
				opt => opt.label === patient.control_twelve_months
			)
			setSelectedControlStatusTwelfth(controlTwelfth || null)
		}
	}, [patient, patientData, operators])
	useEffect(() => {
		const loadOperators = async () => {
			try {
				const options = await operatorOptions()
				setOperators(options)
			} catch (error) {
				console.error('Ошибка загрузки операторов:', error)
			}
		}

		loadOperators()
	}, [])

	if (!isActive) return null

	const generatePassword = () => {
		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
		const newPassword = Array.from({ length: 12 }, () =>
			chars.charAt(Math.floor(Math.random() * chars.length))
		).join('')
		setPassword(newPassword)
		setShowNewPasswordAlert(true)
	}

	const copyToClipboard = () => {
		navigator.clipboard.writeText(password).then(() => {})
	}

	// Обработчики для Select
	const handleChangeOperator = (selectedOption: ValueType<false>) => {
		setSelectedOperator(selectedOption)
		patientData.setValue('operator', selectedOption?.label || '')
	}

	const handleChangeStatus = (selectedOption: ValueType<false>) => {
		setSelectedStatus(selectedOption)
		patientData.setValue('status', selectedOption?.label || '')
	}

	const handleChangeTreatmentStatus = (selectedOption: ValueType<false>) => {
		setSelectedTreatmentStatus(selectedOption)
		patientData.setValue('treatment_status', selectedOption?.label || '')
	}

	const handleChangeControlStatusFirst = (selectedOption: ValueType<false>) => {
		setSelectedControlStatusFirst(selectedOption)
		patientData.setValue('control_month', selectedOption?.label || '')
	}

	const handleChangeControlStatusThird = (selectedOption: ValueType<false>) => {
		setSelectedControlStatusThird(selectedOption)
		patientData.setValue('control_three_months', selectedOption?.label || '')
	}

	const handleChangeControlStatusSixth = (selectedOption: ValueType<false>) => {
		setSelectedControlStatusSixth(selectedOption)
		patientData.setValue('control_six_months', selectedOption?.label || '')
	}

	const handleChangeControlStatusTwelfth = (
		selectedOption: ValueType<false>
	) => {
		setSelectedControlStatusTwelfth(selectedOption)
		patientData.setValue('control_twelve_months', selectedOption?.label || '')
	}

	const onSubmitForm = (data: PatientDataI) => {
		const userFormData = userData.getValues()

		if (password !== '') {
			const accessToken = patient?.access
			const userFormDataModified = {
				...userFormData,
				name: data.full_name,
				phone_number: data.phone_number,
				password: password,
			}
			console.log(userFormDataModified)
			updateDirectusUser(userFormDataModified, accessToken)
		}
		onSubmitUpdate(data)
		setIsActive(false)
		console.log(data)
		setPassword('')
		setShowNewPasswordAlert(false)
		// Сброс выбранных значений Select
		setSelectedOperator(null)
		setSelectedStatus(null)
		setSelectedTreatmentStatus(null)
		setSelectedControlStatusFirst(null)
		setSelectedControlStatusThird(null)
		setSelectedControlStatusSixth(null)
		setSelectedControlStatusTwelfth(null)
	}

	return (
		isActive && (
			<div className='fixed top-0 left-0 w-full h-full bg-[#1F1F1F] bg-opacity-[30%] flex justify-center items-center px-4 sm:px-[168px] z-[99998]'>
				<div className='bg-[#FFFFFF] rounded-[12px] border-[0.5px] border-[#B9B9B9] py-6 px-4 sm:px-8 w-full max-w-[1100px] max-h-screen overflow-y-auto'>
					<h1 className='text-[20px] mb-[38px] text-black font-openSans font-bold'>
						Редактирование пользователя
					</h1>
					{showNewPasswordAlert && (
						<div className='p-4 bg-[#E6FFDA] mt-3 relative mb-5'>
							<p className='text-[20px] font-openSans'>
								Задан новый пароль. Скопируйте его
							</p>
							<div className='absolute left-0 top-0 h-full w-[8px] bg-[#16A34A]'></div>
						</div>
					)}
					<form onSubmit={patientData.handleSubmit(onSubmitForm)}>
						<div className='flex justify-between gap-5'>
							<div className='flex flex-col w-full gap-1'>
								<label className='font-openSans text-[16px]' htmlFor='login'>
									Логин
								</label>
								<input
									className='border-[1px] border-[#1A1A1A] p-3 rounded-[12px]'
									type='text'
									placeholder='+7 (233)-333-3333'
									{...userData.register('username')}
								/>
							</div>
							<div className='flex flex-col w-full gap-1'>
								<label className='font-openSans text-[16px]' htmlFor='password'>
									Пароль
								</label>
								<div className='relative'>
									<input
										className='w-full border-[1px] border-[#1A1A1A] p-3 rounded-[12px] pr-12'
										type='text'
										placeholder='9yu-63dUkS'
										value={password}
										{...userData.register('password')}
										readOnly
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
								className='flex w-[%] text-[12px] bg-[#1A1A1A] text-white px-[79px] py-[12.5px] rounded-[10px] mt-4 mb-1'
								onClick={generatePassword}
							>
								Сгенерировать новый пароль
							</button>
						</div>
						<div className='flex justify-between gap-5 mb-1'>
							<div className='flex flex-col w-full gap-1'>
								<label
									className='font-openSans text-[16px]'
									htmlFor='full_name'
								>
									ФИО<span className='text-[#911b1b]'>*</span>
								</label>
								<input
									className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px]'
									type='text'
									{...patientData.register('full_name', { required: true })}
								/>
							</div>
							<div className='flex flex-col w-full gap-1'>
								<label
									className='font-openSans text-[16px]'
									htmlFor='phone_number'
								>
									Номер телефона<span className='text-[#911b1b]'>*</span>
								</label>
								<input
									className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px]'
									type='text'
									{...patientData.register('phone_number', { required: true })}
								/>
							</div>
						</div>
						<div className='flex justify-between gap-5 mb-2'>
							<div className='flex flex-col w-full gap-1'>
								<label className='font-openSans text-[16px]' htmlFor='city'>
									Город
								</label>
								<input
									className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px]'
									type='text'
									{...patientData.register('city')}
								/>
							</div>
							<div className='flex flex-col w-full gap-1'>
								<label className='font-openSans text-[16px]' htmlFor='operator'>
									Оператор
								</label>
								<Select<Option>
									options={operators}
									value={selectedOperator}
									onChange={handleChangeOperator}
									placeholder='Выберите оператора'
									className='react-select-container'
									classNamePrefix='react-select'
									styles={customStyles}
								/>
							</div>
							<div className='flex flex-col w-full gap-1'>
								<label className='font-openSans text-[16px]' htmlFor='status'>
									Статус
								</label>
								<Select<Option>
									options={statusOptions}
									value={selectedStatus}
									onChange={handleChangeStatus}
									placeholder='Выберите статус'
									className='react-select-container'
									classNamePrefix='react-select'
									styles={customStyles}
								/>
							</div>
						</div>
						<div className='flex flex-col gap-1 mb-1'>
							<label className='font-openSans text-[16px]' htmlFor='comments'>
								Комментарий
							</label>
							<textarea
								className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px] h-[135px]'
								placeholder='заметки'
								{...patientData.register('comments')}
							/>
						</div>
						<div className='flex justify-between gap-5 mb-2'>
							<div className='flex flex-col w-full gap-1'>
								<label
									className='font-openSans text-[16px]'
									htmlFor='treatment_status'
								>
									Статус трудоустройства
								</label>
								<Select<Option>
									options={treatmentStatusOptions}
									value={selectedTreatmentStatus}
									onChange={handleChangeTreatmentStatus}
									placeholder='Выберите статус трудоустройства'
									className='react-select-container'
									classNamePrefix='react-select'
									styles={customStyles}
								/>
							</div>
							<div className='flex flex-col w-full gap-1'>
								<label
									className='font-openSans text-[16px]'
									htmlFor='date_call'
								>
									Дата обращения
								</label>
								<input
									className='border-[1px] border-[#1A1A1A] p-[10px] rounded-[12px]'
									type='datetime-local'
									{...patientData.register('date_call')}
								/>
							</div>
							<div className='flex flex-col w-full gap-1'>
								<label
									className='font-openSans text-[16px]'
									htmlFor='date_start_treatment'
								>
									Дата начала поиска
								</label>
								<input
									className='border-[1px] border-[#1A1A1A] p-[10px] rounded-[12px]'
									type='datetime-local'
									{...patientData.register('date_start_treatment')}
								/>
							</div>
						</div>
						<div className='flex justify-between gap-5 pb-4 border-b-[1px] border-[#9FA6B2]'>
							<div className='flex flex-col w-full gap-1'>
								<label
									className='font-openSans text-[16px]'
									htmlFor='volume_work'
								>
									Объем работы
								</label>
								<textarea
									className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px] h-[135px]'
									{...patientData.register('volume_work')}
								/>
							</div>
							<div className='flex flex-col w-full gap-1'>
								<textarea
									className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px] h-[135px]'
									{...patientData.register('price_work')}
								/>
							</div>
						</div>
						{user && user.role === adminRole && (
							<>
								<div className='mt-3'>
									<h2 className='font-openSans text-[18px] text-black mb-3'>
										Контроль через 1 месяц
									</h2>
								</div>
								<div className='flex justify-between gap-5 mb-3'>
									<div className='flex flex-col w-full gap-1'>
										<label
											className='font-openSans text-[16px]'
											htmlFor='control_one'
										>
											Дата контроля
										</label>
										<input
											className='border-[1px] border-[#1A1A1A] p-[10px] rounded-[12px]'
											type='datetime-local'
											{...patientData.register('control_one')}
										/>
									</div>
									<div className='flex flex-col w-full gap-1'>
										<label
											className='font-openSans text-[16px]'
											htmlFor='control_month'
										>
											Статус контроля
										</label>
										<Select<Option>
											options={controlStatusOptions}
											value={selectedControlStatusFirst}
											onChange={handleChangeControlStatusFirst}
											placeholder='Выберите статус контроля'
											className='react-select-container'
											classNamePrefix='react-select'
											styles={customStyles}
										/>
									</div>
								</div>
								<div className='flex flex-col w-full gap-1 pb-4 border-b-[1px] border-[#9FA6B2]'>
									<label
										className='font-openSans text-[16px]'
										htmlFor='comments_one'
									>
										Замечания 1
									</label>
									<textarea
										className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px] h-[135px]'
										placeholder='Замечания 1'
										{...patientData.register('comments_one')}
									/>
								</div>
								<div className='mt-3'>
									<h2 className='font-openSans text-[18px] text-black mb-3'>
										Контроль через 3 месяца
									</h2>
								</div>
								<div className='flex justify-between gap-5 mb-3'>
									<div className='flex flex-col w-full gap-1'>
										<label
											className='font-openSans text-[16px]'
											htmlFor='control_three'
										>
											Дата контроля
										</label>
										<input
											className='border-[1px] border-[#1A1A1A] p-[10px] rounded-[12px]'
											type='datetime-local'
											{...patientData.register('control_three')}
										/>
									</div>
									<div className='flex flex-col w-full gap-1'>
										<label
											className='font-openSans text-[16px]'
											htmlFor='control_three_months'
										>
											Статус контроля
										</label>
										<Select<Option>
											options={controlStatusOptions}
											value={selectedControlStatusThird}
											onChange={handleChangeControlStatusThird}
											placeholder='Выберите статус контроля'
											className='react-select-container'
											classNamePrefix='react-select'
											styles={customStyles}
										/>
									</div>
								</div>
								<div className='flex flex-col w-full gap-1 pb-4 border-b-[1px] border-[#9FA6B2]'>
									<label
										className='font-openSans text-[16px]'
										htmlFor='comments_three'
									>
										Замечания 3
									</label>
									<textarea
										className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px] h-[135px]'
										placeholder='Замечания 3'
										{...patientData.register('comments_three')}
									/>
								</div>
								<div className='mt-3'>
									<h2 className='font-openSans text-[18px] text-black mb-3'>
										Контроль через 6 месяцев
									</h2>
								</div>
								<div className='flex justify-between gap-5 mb-3'>
									<div className='flex flex-col w-full gap-1'>
										<label
											className='font-openSans text-[16px]'
											htmlFor='control_six'
										>
											Дата контроля
										</label>
										<input
											className='border-[1px] border-[#1A1A1A] p-[10px] rounded-[12px]'
											type='datetime-local'
											{...patientData.register('control_six')}
										/>
									</div>
									<div className='flex flex-col w-full gap-1'>
										<label
											className='font-openSans text-[16px]'
											htmlFor='control_six_months'
										>
											Статус контроля
										</label>
										<Select<Option>
											options={controlStatusOptions}
											value={selectedControlStatusSixth}
											onChange={handleChangeControlStatusSixth}
											placeholder='Выберите статус контроля'
											className='react-select-container'
											classNamePrefix='react-select'
											styles={customStyles}
										/>
									</div>
								</div>
								<div className='flex flex-col w-full gap-1 pb-4 border-b-[1px] border-[#9FA6B2]'>
									<label
										className='font-openSans text-[16px]'
										htmlFor='comments_six'
									>
										Замечания 6
									</label>
									<textarea
										className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px] h-[135px]'
										placeholder='Замечания 6'
										{...patientData.register('comments_six')}
									/>
								</div>
								<div className='mt-3'>
									<h2 className='font-openSans text-[18px] text-black mb-3'>
										Контроль через 12 месяцев
									</h2>
								</div>
								<div className='flex justify-between gap-5 mb-3'>
									<div className='flex flex-col w-full gap-1'>
										<label
											className='font-openSans text-[16px]'
											htmlFor='control_twelve'
										>
											Дата контроля
										</label>
										<input
											className='border-[1px] border-[#1A1A1A] p-[10px] rounded-[12px]'
											type='datetime-local'
											{...patientData.register('control_twelve')}
										/>
									</div>
									<div className='flex flex-col w-full gap-1'>
										<label
											className='font-openSans text-[16px]'
											htmlFor='control_twelve_months'
										>
											Статус контроля
										</label>
										<Select<Option>
											options={controlStatusOptions}
											value={selectedControlStatusTwelfth}
											onChange={handleChangeControlStatusTwelfth}
											placeholder='Выберите статус контроля'
											className='react-select-container'
											classNamePrefix='react-select'
											styles={customStyles}
										/>
									</div>
								</div>
								<div className='flex flex-col w-full gap-1 pb-4 border-b-[1px] border-[#9FA6B2]'>
									<label
										className='font-openSans text-[16px]'
										htmlFor='comments_twelve'
									>
										Замечания 12
									</label>
									<textarea
										className='bg-[#F1F4F9] border-[1px] border-[#1A1A1A] p-3 rounded-[12px] h-[135px]'
										placeholder='Замечания 12'
										{...patientData.register('comments_twelve')}
									/>
								</div>
							</>
						)}
						<div className='flex flex-col w-full gap-4 mt-5 sm:flex-row'>
							<button
								type='submit'
								className='w-full sm:w-[25%] bg-[#1A1A1A] text-[#FFFFFF] py-2 px-3 sm:px-4 rounded-[10px] text-[18px]'
							>
								Сохранить
							</button>
							<button
								type='button'
								onClick={() => setIsActive(false)}
								className='w-full sm:w-[25%] border-[1px] border-[#D4D4D8] px-3 sm:px-4 rounded-[10px] text-[18px]'
							>
								Отмена
							</button>
						</div>
					</form>
				</div>
			</div>
		)
	)
}

export default EditPatientInfo
