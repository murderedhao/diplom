import React, { useEffect, useState } from 'react'
import EditAccess from '../../modals/EditAccess'
import Pagination from '../../pagination/TablePagination'
import { UserDataI } from '../../types/types'

interface OperatorsTableProps {
	operators: UserDataI[]
	totalCount: number
	currentPage: number
	itemsPerPage: number
	onPageChange: (selected: number) => void
	refreshOperators: () => void
}

const OperatorsTable: React.FC<OperatorsTableProps> = ({
	operators,
	totalCount,
	currentPage,
	itemsPerPage,
	onPageChange,
	refreshOperators,
}) => {
	const [showEditAccess, setShowEditAccess] = useState<boolean>(false)
	const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({})
	const [currentOperator, setCurrentOperator] = useState<UserDataI | null>(null)
	const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
		{}
	)
	const [error, setError] = useState<string | null>(null)

	const pageCount = Math.ceil(totalCount / itemsPerPage)

	const handleToggle = async (id: string, operator: UserDataI) => {
		try {
			setLoadingStates(prev => ({ ...prev, [id]: true }))
			setError(null)

			const newStatus = !toggleStates[id] ? 'active' : 'inactive'

			const token = localStorage.getItem('token')
			const directusUrl = import.meta.env.VITE_API_DIRECTUS_URL

			const response = await fetch(`${directusUrl}/users/${id}`, {
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
				throw new Error('Ошибка при обновлении статуса оператора')
			}

			// Оставляем только одно обновление состояния
			setToggleStates(prev => ({
				...prev,
				[id]: newStatus === 'active',
			}))

			setCurrentOperator({
				...operator,
				status: newStatus,
			})

			refreshOperators()
		} finally {
			setLoadingStates(prev => ({ ...prev, [id]: false }))
		}
	}

	const handleEditOperator = (operator: UserDataI) => {
		setCurrentOperator(operator)
		setShowEditAccess(true)
	}

	useEffect(() => {
		const initialToggleStates: Record<string, boolean> = {}
		operators.forEach(operator => {
			initialToggleStates[operator.id] = operator.status === 'active'
		})
		setToggleStates(initialToggleStates)
	}, [operators])

	return (
		<>
			<div className='p-4 bg-white rounded-md border-[0.5px] border-[#b9b9b9]'>
				{error && (
					<div className='p-3 mb-4 text-red-700 bg-red-100 rounded'>
						{error}
					</div>
				)}

				<div className='overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap w-[100px]'>
									Статус
								</th>
								<th className='p-4 text-[#76767A] text-[16px] whitespace-nowrap'>
									ФИО
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px] whitespace-nowrap'>
									Номер телефона
								</th>
							</tr>
						</thead>
						<tbody>
							{operators.map(operator => {
								const operatorId = operator.id
								const isActive = toggleStates[operatorId] || false
								const isLoading = loadingStates[operatorId] || false

								return (
									<tr key={operatorId} className='border-b'>
										<td className='p-4 whitespace-nowrap'>
											<button
												onClick={() =>
													!isLoading && handleToggle(operatorId, operator)
												}
												disabled={isLoading}
												className={`relative flex items-center w-16 h-8 p-1 rounded-full transition-colors duration-300 
                          ${isActive ? 'bg-green-500' : 'bg-red-700'}
                          ${
														isLoading
															? 'opacity-50 cursor-not-allowed'
															: 'cursor-pointer'
													}`}
											>
												<div
													className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 
                            ${isActive ? 'translate-x-8' : 'translate-x-0'}`}
												/>
												{isLoading ? (
													<span className='absolute inset-0 flex items-center justify-center text-xs text-white'>
														...
													</span>
												) : (
													<span
														className={`absolute text-white text-sm font-bold transition-opacity duration-300 
                              ${isActive ? 'left-2' : 'right-2'}`}
													>
														{isActive ? '✓' : '✗'}
													</span>
												)}
											</button>
										</td>
										<td
											className='p-4 text-center underline cursor-pointer whitespace-nowrap'
											onClick={() => handleEditOperator(operator)}
										>
											{operator.first_name} {operator.last_name}
										</td>
										<td className='p-4 whitespace-nowrap'>
											{operator.username || 'Не указан'}
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

			{showEditAccess && currentOperator && (
				<EditAccess
					patient={currentOperator}
					isActive={showEditAccess}
					setIsActive={setShowEditAccess}
				/>
			)}
		</>
	)
}

export default OperatorsTable
