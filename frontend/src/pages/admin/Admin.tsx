import { useEffect, useState } from 'react'
import Select, { MultiValue, SingleValue } from 'react-select'
import iconSearch from '../../assets/iconSearch.svg'
import iconUser from '../../assets/iconUser.svg'
import AddPacient from '../../modals/AddPacient'
import {
	operatorOptions,
	Option,
	sortOptions,
} from '../../selectOptions/selectOptions'
import { customStyles } from '../../selectOptions/selectStyles'
import { getFn } from '../../service/api'
import AdminTable from '../../tables/admin/Table'
import { PatientDataI } from '../../types/types'

type ValueType<IsMulti extends boolean> = IsMulti extends true
	? MultiValue<Option>
	: SingleValue<Option>

const Admin = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [patients, setPatients] = useState<PatientDataI[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [searchQuery, setSearchQuery] = useState<string>()
	const [sortOption, setSortOption] = useState<ValueType<false>>()
	const [selectedOperator, setSelectedOperator] = useState<ValueType<false>>()
	const [operators, setOperators] = useState<Option[]>([])
	const [totalCount, setTotalCount] = useState<number>(0)
	const [currentPage, setCurrentPage] = useState<number>(() => {
		return parseInt(localStorage.getItem('operatorCurrentPage') || '0', 10)
	})
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
		null
	)
	const itemsPerPage = 6

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				setIsLoading(true)
				const params = new URLSearchParams()
				const offset = currentPage * itemsPerPage

				// Фильтрация по поиску
				if (searchQuery) {
					params.append('filter[_or][0][full_name][_contains]', searchQuery)
					params.append('filter[_or][1][phone_number][_contains]', searchQuery)
				}

				// Фильтрация по оператору
				if (selectedOperator) {
					params.append('?filter[operator][_eq]', selectedOperator.label)
				}

				// Поля для выборки
				params.append(
					'fields',
					'id,full_name,phone_number,city,time,operator,status,comments,treatment_status,date_call,date_start_treatment,volume_work,price_work,control_one,control_month,comments_one,control_three,control_three_months,comments_three,control_six,control_six_months,comments_six,control_twelve,control_twelve_months,comments_twelve,access'
				)

				const getSort = () => {
					switch (sortDirection) {
						case 'asc':
							return 'full_name'
						case 'desc':
							return '-full_name'
					}
				}
				const sort = sortOption ? [sortOption.value] : getSort()

				const response = await getFn('/items/Patients', {
					params: params.toString(),
					offset,
					limit: itemsPerPage,
					meta: 'total_count',
					search: searchQuery,
					filter: { operator: selectedOperator?.label },
					sort: sort,
				})

				if (response) {
					setPatients(response.data || [])
					setTotalCount(response.meta?.total_count || 0)
				}
			} catch (error) {
				console.error('Ошибка:', error)
			} finally {
				setIsLoading(false)
			}
		}

		const debounceTimer = setTimeout(() => {
			fetchPatients()
		}, 300)

		return () => clearTimeout(debounceTimer)
	}, [searchQuery, selectedOperator, currentPage, sortOption, sortDirection])

	useEffect(() => {
		localStorage.setItem('operatorCurrentPage', currentPage.toString())
	}, [searchQuery, sortOption, selectedOperator, currentPage])
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

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
		setCurrentPage(0)
	}

	const handleSortChange = (selectedOption: ValueType<false>) => {
		setSortOption(selectedOption)
		setCurrentPage(0)
	}

	const handleOperatorChange = (selectedOption: ValueType<false>) => {
		setSelectedOperator(selectedOption)
		setCurrentPage(0)
	}

	const handlePageChange = (selectedPage: number) => {
		setCurrentPage(selectedPage)
	}

	return (
		<>
			<div className='pt-[86px] h-[100vh] mx-auto w-full px-[50px]'>
				<div className=''>
					<div className='flex flex-col gap-4 mb-[35px] sm:flex-row sm:items-center'>
						<div className='relative w-full sm:flex-1'>
							<input
								className='w-full py-3 px-9 rounded-[8px] border border-gray-300'
								placeholder='Поиск'
								value={searchQuery}
								onChange={handleSearchChange}
							/>
							<img
								className='absolute transform -translate-y-1/2 left-4 top-1/2'
								src={iconSearch}
								alt='Поиск'
							/>
						</div>
						<div className='flex gap-4 sm:flex-1 sm:items-center'>
							<Select<Option>
								className='flex-1'
								options={sortOptions}
								placeholder='Сортировать по'
								styles={customStyles}
								onChange={handleSortChange}
								value={sortOption}
							/>
							<Select<Option>
								className='flex-1'
								options={operators}
								placeholder='Оператор'
								styles={customStyles}
								onChange={handleOperatorChange}
								value={selectedOperator}
								isClearable
							/>
							<button
								className='flex bg-[#007AFF] px-5 p-3 items-center rounded-[8px] justify-center gap-3 min-w-[200px] hover:bg-[#0054AF]'
								onClick={() => setModalOpen(true)}
							>
								<img src={iconUser} alt='Добавить' />
								<p className='text-white'>Добавить</p>
							</button>
							<AddPacient isActive={modalOpen} setIsActive={setModalOpen} />
						</div>
					</div>

					{isLoading ? (
						<div className='flex items-center justify-center h-64'>
							<p>Загрузка данных...</p>
						</div>
					) : patients.length === 0 ? (
						<div className='flex items-center justify-center h-64'>
							<p>пользователи не найдены</p>
						</div>
					) : (
						<AdminTable
							patients={patients}
							totalCount={totalCount}
							currentPage={currentPage}
							itemsPerPage={itemsPerPage}
							onPageChange={handlePageChange}
							setSortDirection={setSortDirection}
							sortDirection={sortDirection}
						/>
					)}
				</div>
			</div>
		</>
	)
}

export default Admin
