import React, { useEffect, useState } from 'react'
import EditAccess from '../../modals/EditAccess'
import EditPatientInfo from '../../modals/EditPatientInfo'
import Pagination from '../../pagination/TablePagination'
import { getOperatorColorClass } from '../../selectOptions/selectOptionsColors'
import { formatDate } from '../../service/utils'
import { PatientDataI } from '../../types/types'

type SortDirection = 'asc' | 'desc' | null
interface PatientTableProps {
	patients: PatientDataI[]
	totalCount: number
	currentPage: number
	itemsPerPage: number
	onPageChange: (selected: number) => void
	setSortDirection: (direction: SortDirection) => void
	sortDirection: SortDirection
}

const OperatorDetailedTable: React.FC<PatientTableProps> = ({
	patients,
	totalCount,
	currentPage,
	itemsPerPage,
	onPageChange,
	setSortDirection,
	sortDirection,
}) => {
	const [showEditPatientInfo, setShowEditPatientInfo] = useState<boolean>(false)
	const [showEditAccess, setShowEditAccess] = useState<boolean>(false)
	const [toggleStates, setToggleStates] = useState<Record<number, boolean>>({})
	const [currentPatient, setCurrentPatient] = useState<PatientDataI | null>(
		null
	)

	const pageCount = Math.ceil(totalCount / itemsPerPage)

	const handleToggle = async (id: number, patient: PatientDataI) => {
		try {
			const newStatus = !toggleStates[id] ? 'active' : 'inactive'
			const token = localStorage.getItem('token')
			const directusUrl = import.meta.env.VITE_API_DIRECTUS_URL

			const patientResponse = await fetch(
				`${directusUrl}/items/Patients/${id}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			const patientData = await patientResponse.json()
			const userId = patientData.data.user

			if (!userId) {
				throw new Error('У пациента нет привязанного пользователя')
			}
			const response = await fetch(`${directusUrl}/users/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					status: newStatus,
				}),
			})
			if (!response.ok) {
				throw new Error('Ошибка при обновлении доступа пользователя')
			}

			setToggleStates(prev => ({
				...prev,
				[id]: newStatus === 'active',
			}))

			setCurrentPatient({
				...patient,
				status: newStatus,
				user: {
					...patient.user,
					status: newStatus,
				},
			})
		} catch (error) {
			console.error('Error updating patient status:', error)
		}
	}

	const handleEditPatientInfo = (patient: PatientDataI) => {
		setCurrentPatient(patient)
		setShowEditPatientInfo(true)
	}

	useEffect(() => {
		const initialToggleStates: Record<number, boolean> = {}
		patients.forEach(patient => {
			const patientId = patient.id
			initialToggleStates[patientId] = patient.user?.status === 'active'
		})
		setToggleStates(initialToggleStates)
	}, [patients])

	return (
		<>
			<div className='p-4 bg-white rounded-md border-[0.5px] border-[#b9b9b9]'>
				<div className='overflow-x-auto'>
					<table className='w-full min-w-[1500px] border-collapse'>
						<thead>
							<tr>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Доступ
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] cursor-pointer whitespace-nowrap'>
									<div
										className='flex items-center'
										onClick={() => {
											setSortDirection(
												sortDirection === 'asc'
													? 'desc'
													: sortDirection === 'desc'
													? null
													: 'asc'
											)
										}}
									>
										<span className='mr-1'>ФИО</span>
										<div className='flex flex-col'>
											<span
												className={`text-[10px] mb-[-5px] ${
													sortDirection === 'asc' ? 'text-black' : ''
												}`}
											>
												▲
											</span>
											<span
												className={`text-[10px] ${
													sortDirection === 'desc' ? 'text-black' : ''
												}`}
											>
												▼
											</span>
										</div>
									</div>
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Город
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Номер телефона
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Оператор
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Статус
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Комментарий
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Статус трудоустройства
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] cursor-pointer whitespace-nowrap'>
									<div className='flex items-center'>
										<span>Дата обращения</span>
									</div>
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] cursor-pointer whitespace-nowrap'>
									<div className='flex items-center'>
										<span>Дата начала поиска</span>
									</div>
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Объем работы
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Контроль 1
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Контроль через 1 месяц
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Замечания 1
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Контроль 3
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Контроль через 3 месяца
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Замечания 3
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Контроль 6
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Контроль через 6 месяцев
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Замечания 6
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Контроль 12
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Контроль через 12 месяцев
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Замечания 12
								</th>
							</tr>
						</thead>
						<tbody>
							{patients.map(patient => {
								const patientId = patient.id
								const isActive = toggleStates[patientId] || false

								return (
									<tr key={patientId} className='border-b'>
										<td className='p-4 whitespace-nowrap'>
											<button
												onClick={() => handleToggle(patientId, patient)}
												className={`relative flex items-center w-16 h-8 p-1 rounded-full transition-colors duration-300 
                          ${isActive ? 'bg-green-500' : 'bg-red-700'}`}
											>
												<div
													className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 
                            ${isActive ? 'translate-x-8' : 'translate-x-0'}`}
												/>
												<span
													className={`absolute text-white text-sm font-bold transition-opacity duration-300 
                            ${
															isActive
																? 'left-2 opacity-100'
																: 'right-2 opacity-100'
														}`}
												>
													{isActive ? '✓' : '✗'}
												</span>
											</button>
										</td>
										<td
											className='p-4 underline cursor-pointer whitespace-nowrap'
											onClick={() => handleEditPatientInfo(patient)}
										>
											{patient.full_name}
										</td>
										<td className='p-4 whitespace-nowrap'>{patient.city}</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.phone_number}
										</td>
										<td className='p-4 whitespace-nowrap'>
											<div
												className={`flex p-4 rounded-[8px] justify-center items-center ${getOperatorColorClass(
													patient.operator || ''
												)}`}
											>
												{patient.operator}
											</div>
										</td>
										<td className='p-4 whitespace-nowrap'>{patient.status}</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.comments}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.treatment_status}
										</td>
										<td className='p-4 text-center whitespace-nowrap'>
											{formatDate(patient.date_call)}
										</td>
										<td className='p-4 text-center whitespace-nowrap'>
											{formatDate(patient.date_start_treatment)}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.volume_work}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.price_work}
										</td>
										<td className='p-4 text-center whitespace-nowrap'>
											{formatDate(patient.control_one)}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.control_month}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.comments_one}
										</td>
										<td className='p-4 text-center whitespace-nowrap'>
											{formatDate(patient.control_three)}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.control_three_months}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.comments_three}
										</td>
										<td className='p-4 text-center whitespace-nowrap'>
											{formatDate(patient.control_six)}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.control_six_months}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.comments_six}
										</td>
										<td className='p-4 text-center whitespace-nowrap'>
											{formatDate(patient.control_twelve)}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.control_twelve_months}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.comments_twelve}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
				<div className='flex justify-center mt-6'>
					<Pagination
						pageCount={pageCount}
						currentPage={currentPage}
						onPageChange={onPageChange}
					/>
				</div>
			</div>

			{showEditPatientInfo && currentPatient && (
				<EditPatientInfo
					isActive={showEditPatientInfo}
					setIsActive={setShowEditPatientInfo}
					patient={currentPatient}
				/>
			)}

			{showEditAccess && currentPatient && (
				<EditAccess
					isActive={showEditAccess}
					setIsActive={setShowEditAccess}
					patient={currentPatient}
				/>
			)}
		</>
	)
}

export default OperatorDetailedTable
