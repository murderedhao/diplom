import { useEffect, useState } from 'react'
import iconSearch from '../../assets/iconSearch.svg'
import { getFn } from '../../service/api'
import OperatorsTable from '../../tables/admin/OperatorsTable'
import { UserDataI } from '../../types/types'

type DirectusFilter = {
	[key: string]: any
	_or?: Array<{
		[key: string]: { _icontains: string }
	}>
}

type RoleFilter = {
	_eq: string
}

type OperatorFilter = DirectusFilter & {
	role: RoleFilter
}

const AdminOperators = () => {
	const [operators, setOperators] = useState<UserDataI[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [totalCount, setTotalCount] = useState<number>(0)
	const [currentPage, setCurrentPage] = useState<number>(0)
	const itemsPerPage = 8

	const operatorRoleId = import.meta.env.VITE_API_OPERATOR_TOKEN

	useEffect(() => {
		const fetchOperators = async () => {
			try {
				setIsLoading(true)
				const offset = currentPage * itemsPerPage

				const filter: OperatorFilter = {
					role: { _eq: operatorRoleId },
				}

				if (searchQuery) {
					filter['_or'] = [
						{ first_name: { _icontains: searchQuery } },
						{ last_name: { _icontains: searchQuery } },
						{ email: { _icontains: searchQuery } },
					]
				}
				const response = await getFn('/users', {
					offset,
					limit: itemsPerPage,
					meta: 'filter_count',
					filter,
					fields: 'id,first_name,last_name,email,username,role,status',
				})

				if (response) {
					setOperators(response.data || [])
					setTotalCount(response.meta?.filter_count || 0)
				}
			} catch (error) {
				console.error('Ошибка при получении операторов:', error)
			} finally {
				setIsLoading(false)
			}
		}

		const debounceTimer = setTimeout(fetchOperators, 300)
		return () => clearTimeout(debounceTimer)
	}, [searchQuery, currentPage, operatorRoleId])

	useEffect(() => {
		setCurrentPage(0)
	}, [searchQuery])

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
	}

	const handlePageChange = (selectedPage: number) => {
		setCurrentPage(selectedPage)
	}

	const refreshOperators = () => {
		setCurrentPage(0)
	}

	return (
		<div className='pt-[86px] h-[100vh] mx-auto w-full px-[50px]'>
			<div className='flex flex-col gap-4 mb-[35px] sm:flex-row sm:items-center'>
				<div className='relative w-full sm:flex-1'>
					<input
						className='w-full py-3 px-9 rounded-[8px] border border-gray-300'
						placeholder='Поиск по имени, фамилии или email'
						value={searchQuery}
						onChange={handleSearchChange}
					/>
					<img
						className='absolute transform -translate-y-1/2 left-4 top-1/2'
						src={iconSearch}
						alt='Поиск'
					/>
				</div>
			</div>

			{isLoading ? (
				<div className='flex items-center justify-center h-64'>
					<p>Загрузка данных...</p>
				</div>
			) : operators.length === 0 ? (
				<div className='flex items-center justify-center h-64'>
					<p>Операторы не найдены</p>
				</div>
			) : (
				<OperatorsTable
					operators={operators}
					totalCount={totalCount}
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					onPageChange={handlePageChange}
					refreshOperators={refreshOperators}
				/>
			)}
		</div>
	)
}

export default AdminOperators
