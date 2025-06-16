import { useEffect, useState } from 'react'
import Select, { MultiValue } from 'react-select'
import iconSearch from '../../assets/iconSearch.svg'
import iconUser from '../../assets/iconUser.svg'
import AddPacient from '../../modals/AddPacient'
import {
	operatorOptions,
	Option,
	statusOptions,
	treatmentStatusOptions,
} from '../../selectOptions/selectOptions'
import { customStyles } from '../../selectOptions/selectStyles'
import { getFn } from '../../service/api'
import { useAuth } from '../../service/useAuth'
import OperatorDetailedTable from '../../tables/operator/DetailedTable'
import { PatientDataI } from '../../types/types'

type FilterType = {
	_or?: Array<{
		[key: string]: { _contains: string }
	}>
	operator?: { _in: string[] }
	status?: { _in: string[] }
	_and?: Array<{
		_or: Array<{
			treatment_status: { _eq: string }
		}>
	}>
}

const OperatorDetailed = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [patients, setPatients] = useState<PatientDataI[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [selectedOperators, setSelectedOperators] = useState<
		MultiValue<Option>
	>([])
	const [selectedStatuses, setSelectedStatuses] = useState<MultiValue<Option>>(
		[]
	)
	const [selectedTreatmentStatuses, setSelectedTreatmentStatuses] = useState<
		MultiValue<Option>
	>([])
	const [operators, setOperators] = useState<Option[]>([])
	const [totalCount, setTotalCount] = useState<number>(0)
	const [currentPage, setCurrentPage] = useState<number>(() => {
		return parseInt(localStorage.getItem('operatorCurrentPage') || '0', 10)
	})
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
		null
	)
	const itemsPerPage = 6

	const { user } = useAuth()

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				setIsLoading(true)
				const offset = currentPage * itemsPerPage
				const filter: FilterType = {}
				if (searchQuery) {
					filter._or = [
						{ full_name: { _contains: searchQuery } },
						{ phone_number: { _contains: searchQuery } },
					]
				}
				if (selectedOperators.length > 0) {
					filter.operator = {
						_in: selectedOperators.map(op => op.label),
					}
				}
				if (selectedStatuses.length > 0) {
					filter.status = {
						_in: selectedStatuses.map(s => s.value),
					}
				}
				if (selectedTreatmentStatuses.length > 0) {
					filter._and = [
						{
							_or: selectedTreatmentStatuses.map(status => ({
								treatment_status: { _eq: status.value },
							})),
						},
					]
				}

				const sort =
					sortDirection === 'asc'
						? 'full_name'
						: sortDirection === 'desc'
						? '-full_name'
						: undefined

				const response = await getFn('/items/Patients', {
					offset,
					limit: itemsPerPage,
					meta: 'filter_count',
					filter,
					sort,
					fields: [
						'id',
						'full_name',
						'phone_number',
						'city',
						'time',
						'operator',
						'status',
						'comments',
						'treatment_status',
						'date_call',
						'date_start_treatment',
						'volume_work',
						'price_work',
						'control_one',
						'control_month',
						'comments_one',
						'control_three',
						'control_three_months',
						'comments_three',
						'control_six',
						'control_six_months',
						'comments_six',
						'control_twelve',
						'control_twelve_months',
						'comments_twelve',
						'access',
						'user.status',
						'user.id',
					].join(','),
				})

				if (response) {
					setPatients(response.data || [])
					setTotalCount(response.meta?.filter_count || 0)
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
	}, [
		searchQuery,
		selectedOperators,
		currentPage,
		selectedStatuses,
		selectedTreatmentStatuses,
		sortDirection,
	])

	useEffect(() => {
		localStorage.setItem('operatorCurrentPage', currentPage.toString())
	}, [currentPage])

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
	}

	const handleOperatorsChange = (selectedOptions: MultiValue<Option>) => {
		setSelectedOperators(selectedOptions)
	}

	const handleStatusChange = (selectedOptions: MultiValue<Option>) => {
		setSelectedStatuses(selectedOptions)
	}

	const handleTreatmentStatusChange = (selectedOptions: MultiValue<Option>) => {
		setSelectedTreatmentStatuses(selectedOptions)
	}

	const handlePageChange = (selectedPage: number) => {
		setCurrentPage(selectedPage)
	}
	useEffect(() => {
		setCurrentPage(0)
	}, [
		searchQuery,
		selectedOperators,
		selectedStatuses,
		selectedTreatmentStatuses,
		sortDirection,
	])

	return (
		<>
			<div className='h-[100vh] mx-auto w-full px-[80px]'>
				<h1 className='text-[24px] text-[#27272A] font-bold font-openSans'>
					Оператор&nbsp;{user?.fullName}
				</h1>
				<div className=''>
					<div className='pt-[86px] flex flex-col gap-4 mb-[35px] sm:flex-row sm:items-center'>
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
							<Select<Option, true>
								className='flex-1'
								options={operators}
								placeholder='Оператор'
								styles={customStyles}
								onChange={handleOperatorsChange}
								value={selectedOperators}
								isMulti
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

					<div className='flex gap-4 mb-4'>
						<Select<Option, true>
							className='flex-1'
							options={statusOptions}
							placeholder='Фильтр по статусу'
							styles={customStyles}
							onChange={handleStatusChange}
							value={selectedStatuses}
							isMulti
							isClearable
						/>
						<Select<Option, true>
							className='flex-1'
							options={treatmentStatusOptions}
							placeholder='Фильтр по статусу трудоустройства'
							styles={customStyles}
							onChange={handleTreatmentStatusChange}
							value={selectedTreatmentStatuses}
							isMulti
							isClearable
						/>
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
						<OperatorDetailedTable
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

export default OperatorDetailed
