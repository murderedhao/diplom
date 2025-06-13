import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import download from '../assets/download.svg'
import file from '../assets/file.svg'
import paginationNext from '../assets/paginationNext.svg'
import plus from '../assets/plus.svg'
import Header from '../layout/Header'
import AddFile from '../modals/AddFile'

const PatientCard = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [sortColumn, setSortColumn] = useState<string | null>('date')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const itemsPerPage = 4

	// Пример данных для таблицы
	const files = Array(20)
		.fill(0)
		.map((_, i) => ({
			name: `978-1-7923-270${i}`,
			date: `0${(i % 9) + 1}/03/2025`,
			size: `${15 + i} мб`,
		}))

	// Сортировка данных
	const sortedFiles = [...files].sort((a, b) => {
		if (!sortColumn) return 0

		const valA = a[sortColumn as keyof typeof a]
		const valB = b[sortColumn as keyof typeof b]

		if (sortColumn === 'date') {
			const dateA = new Date(valA.split('/').reverse().join('-'))
			const dateB = new Date(valB.split('/').reverse().join('-'))
			return sortOrder === 'asc'
				? dateA.getTime() - dateB.getTime()
				: dateB.getTime() - dateA.getTime()
		}

		return sortOrder === 'asc'
			? valA.localeCompare(valB, 'ru')
			: valB.localeCompare(valA, 'ru')
	})

	// Пагинация
	const offset = currentPage * itemsPerPage
	const currentFiles = sortedFiles.slice(offset, offset + itemsPerPage)

	// Обработчик сортировки
	const handleSort = (column: string) => {
		if (sortColumn === column) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortColumn(column)
			setSortOrder('asc')
		}
		setCurrentPage(0) // Сброс пагинации при сортировке
	}

	// Обработчик смены страницы
	const handlePageClick = ({ selected }: { selected: number }) => {
		setCurrentPage(selected)
	}

	return (
		<>
			<Header />
			<div className='flex flex-col bg-white border-[0.5px] border-[#9FA6B2] mx-[81px] p-5 rounded-md'>
				<div className='flex justify-between w-full gap-5'>
					<div className='flex flex-col w-full gap-1'>
						<label
							className='text-left font-openSans text-[16px]'
							htmlFor='name'
						>
							ФИО
						</label>
						<input
							className='w-full border-[1px] border-[#1A1A1A] p-4 rounded-[12px]'
							type='text'
							name=''
							id='name'
							placeholder='Иванов Иван Иванович'
						/>
					</div>
					<div className='flex flex-col w-full gap-1'>
						<label
							className='text-left font-openSans text-[16px]'
							htmlFor='tel'
						>
							Номер телефона
						</label>
						<input
							className='w-full border-[1px] border-[#1A1A1A] p-4 rounded-[12px]'
							type='tel'
							id='tel'
							placeholder='+7 (233)-333-3333'
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
						className='w-full border-[1px] border-[#1A1A1A] p-4 rounded-[12px] resize-none'
						id='notes'
						placeholder='Введите дополнительные заметки...'
						rows={4}
					/>
				</div>
			</div>
			<div className='mx-[81px] my-[15px] flex justify-end'>
				<button
					className='flex items-center py-2 px-3 rounded-[12px] bg-[#007AFF] text-white font-openSans gap-3 hover:bg-[#0054AF]'
					onClick={() => setModalOpen(true)}
				>
					<img src={plus} alt='+' />
					Загрузить файл
					<img src={file} alt='' />
				</button>
				<AddFile isActive={modalOpen} setIsActive={setModalOpen} />
			</div>

			{/* Таблица с файлами */}
			<div className='mx-[81px] mt-6'>
				<div className='bg-white border-[#B9B9B9] border-[0.5px] rounded-md'>
					<table className='w-full min-w-[600px] border-collapse'>
						<thead>
							<tr>
								<th
									className='p-4 text-left text-[#76767A] text-[16px] cursor-pointer'
									onClick={() => handleSort('name')}
								>
									<div className='flex items-center gap-2'>
										<span>Название файла</span>
										<div className='flex flex-col'>
											<span
												className='text-[10px] mb-[-5px]'
												style={{
													color:
														sortColumn === 'name' && sortOrder === 'asc'
															? 'black'
															: 'gray',
												}}
											>
												▲
											</span>
											<span
												className='text-[10px]'
												style={{
													color:
														sortColumn === 'name' && sortOrder === 'desc'
															? 'black'
															: 'gray',
												}}
											>
												▼
											</span>
										</div>
									</div>
								</th>
								<th
									className='p-4 text-left text-[#76767A] text-[16px] cursor-pointer'
									onClick={() => handleSort('date')}
								>
									<div className='flex items-center gap-2'>
										<span>Дата загрузки</span>
										<div className='flex flex-col'>
											<span
												className='text-[10px] mb-[-5px]'
												style={{
													color:
														sortColumn === 'date' && sortOrder === 'asc'
															? 'black'
															: 'gray',
												}}
											>
												▲
											</span>
											<span
												className='text-[10px]'
												style={{
													color:
														sortColumn === 'date' && sortOrder === 'desc'
															? 'black'
															: 'gray',
												}}
											>
												▼
											</span>
										</div>
									</div>
								</th>
								<th className='p-4 text-left text-[#76767A] text-[16px]'>
									Размер
								</th>
							</tr>
						</thead>
						<tbody>
							{currentFiles.map((file, index) => (
								<tr key={index} className='border-b'>
									<td className='p-4'>{file.name}</td>
									<td className='p-4'>{file.date}</td>
									<td className='p-4'>{file.size}</td>
									<td className='p-4'>
										<div className='flex gap-2'>
											<button className='flex py-2 w-full bg-[#007AFF] border-[1px] rounded-[10px] text-[12px] font-openSans justify-center items-center gap-1 px-8'>
												<img src={download} alt='' />
												<p className='text-[#FFFFFF] text-[12px] font-openSans '>
													Скачать
												</p>
											</button>
											<button className='px-8 py-2 w-full text-white rounded-[10px] text-[12px] bg-[#DC2626]'>
												Удалить
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{/* Пагинация */}
					<div className='flex items-center justify-center mt-6'>
						<ReactPaginate
							previousLabel={<img src={paginationNext} alt='' />}
							nextLabel={<img src={paginationNext} alt='' />}
							breakLabel={'...'}
							pageCount={Math.ceil(files.length / itemsPerPage)}
							marginPagesDisplayed={2}
							pageRangeDisplayed={5}
							onPageChange={handlePageClick}
							containerClassName={'flex justify-center gap-2 p-4'}
							activeClassName={
								'border-[#007AFF] text-[#007AFF] px-3 py-1 rounded'
							}
							pageClassName={'px-3 py-1 border rounded'}
							previousClassName={'px-3 py-1 border rounded rotate-180'}
							nextClassName={'px-3 py-1 border border-[#007AFF] rounded'}
							breakClassName={'px-3 py-1'}
							disabledClassName={'disabled'}
							previousLinkClassName={
								'block w-full h-full flex items-center justify-center'
							}
							nextLinkClassName={
								'block w-full h-full flex items-center justify-center'
							}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default PatientCard
