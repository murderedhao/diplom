import React, { useState } from 'react'
import EditAccess from '../../modals/EditAccess'
import EditPatientInfo from '../../modals/EditPatientInfo'
import Pagination from '../../pagination/TablePagination'
import { getOperatorColorClass } from '../../selectOptions/selectOptionsColors'
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

const OperatorTable: React.FC<PatientTableProps> = ({
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

	const handleToggle = (id: number, patient: PatientDataI) => {
		const newState = !toggleStates[id]
		setToggleStates(prev => ({ ...prev, [id]: newState }))
		setCurrentPatient(patient)
		setShowEditAccess(true)
	}

	const handleEditPatientInfo = (patient: PatientDataI) => {
		setCurrentPatient(patient)
		setShowEditPatientInfo(true)
	}

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
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									ID
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] cursor-pointer whitespace-nowrap'>
									<div
										className='flex items-center gap-2'
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
										<span>ФИО</span>
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
									Время
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
									Статус лечения
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] cursor-pointer whitespace-nowrap'>
									<div className='flex items-center'>
										<span>Дата обращения</span>
									</div>
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] cursor-pointer whitespace-nowrap'>
									<div className='flex items-center'>
										<span>Дата начала лечения</span>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{patients.map((patient, index) => {
								const patientId = patient.id || index
								const isOn = toggleStates[patientId] || false

								return (
									<tr key={patientId} className='border-b'>
										<td className='p-4 whitespace-nowrap'>
											<button
												onClick={() => handleToggle(patientId, patient)}
												className={`relative flex items-center w-16 h-8 p-1 rounded-full transition-colors duration-300 
                        ${isOn ? 'bg-green-500' : 'bg-red-700'}`}
											>
												<div
													className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 
                          ${isOn ? 'translate-x-8' : 'translate-x-0'}`}
												/>
												<span
													className={`absolute text-white text-sm font-bold transition-opacity duration-300 
                          ${
														isOn ? 'left-2 opacity-100' : 'right-2 opacity-100'
													}`}
												>
													{isOn ? '✓' : '✗'}
												</span>
											</button>
										</td>
										<td className='p-4 whitespace-nowrap'>{patientId}</td>
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
										<td className='p-4 whitespace-nowrap'>
											{patient.date_call}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{patient.date_start_treatment}
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

export default OperatorTable
