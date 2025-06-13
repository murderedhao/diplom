import { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import download from '../assets/download.svg'
import file from '../assets/file.svg'
import paginationNext from '../assets/paginationNext.svg'
import plus from '../assets/plus.svg'
import Header from '../layout/Header'
import AddFile from '../modals/AddFile'
import { getFn } from '../service/api'
import { FileType } from '../types/types'

const Patient = () => {
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [filesTotalCount, setFilesTotalCount] = useState<number>(0)
	const [sortColumn, setSortColumn] = useState<string>('created_on')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const itemsPerPage = 10

	const [files, setFiles] = useState<FileType[]>([])

	const updateFiles = useCallback(async () => {
		const sortParam = sortOrder === 'asc' ? sortColumn : `-${sortColumn}`

		const response = await getFn('/files', {
			offset: currentPage * itemsPerPage,
			limit: itemsPerPage,
			meta: 'total_count',
			sort: sortParam,
		})

		if (response) {
			setFiles(response.data)
			setFilesTotalCount(response.meta.total_count)
		}
	}, [currentPage, itemsPerPage, sortColumn, sortOrder])

	useEffect(() => {
		updateFiles()
	}, [currentPage, sortColumn, sortOrder, updateFiles])

	const handleSort = (column: string) => {
		const columnMapping: Record<string, string> = {
			name: 'title',
			date: 'created_on',
		}

		const directusColumn = columnMapping[column] || column

		if (sortColumn === directusColumn) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortColumn(directusColumn)
			setSortOrder('asc')
		}
		setCurrentPage(0)
	}

	const handlePageClick = ({ selected }: { selected: number }) => {
		setCurrentPage(selected)
	}

	const onFileUploaded = () => {
		updateFiles()
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU')
	}

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['б', 'кб', 'мб', 'гб']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	// Функция для скачивания файла с авторизацией
	const downloadFile = async (fileId: string, fileName: string) => {
		try {
			const token = localStorage.getItem('token')
			const directusUrl = import.meta.env.VITE_API_DIRECTUS_URL
			console.log('fileid', fileId, fileName)

			const response = await fetch(`${directusUrl}/assets/${fileId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error('Ошибка при скачивании файла')
			}

			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)

			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', fileName)
			document.body.appendChild(link)
			link.click()
			link.remove()
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Ошибка при скачивании файла:', error)
			alert('Не удалось скачать файл')
		}
	}

	return (
		<>
			<Header />
			<div className='mx-4 sm:mx-6 md:mx-10 lg:mx-[80px]'>
				<div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-7'>
					<div>
						<h1 className='font-openSans text-[20px] sm:text-[24px] font-bold'>
							Личный кабинет
						</h1>
						<h2 className='font-openSans text-[18px] sm:text-[24px] font-normal mt-1 sm:mt-2'>
							Список файлов
						</h2>
					</div>
					<button
						className='flex items-center py-2 px-3 sm:px-4 rounded-[12px] bg-[#007AFF] text-white font-openSans gap-2 sm:gap-3 hover:bg-[#0054AF] text-sm sm:text-base'
						onClick={() => setModalOpen(true)}
					>
						<img src={plus} alt='+' />
						Загрузить файл
						<img src={file} alt='' />
					</button>
					<AddFile
						isActive={modalOpen}
						setIsActive={setModalOpen}
						onFileUploaded={onFileUploaded}
					/>
				</div>
				<div className='h-full mt-4 mb-5 overflow-x-auto'>
					<div className='bg-white border border-[#B9B9B9] rounded-md min-w-[600px]'>
						<table className='w-full border-collapse'>
							<thead>
								<tr>
									<th
										className='p-3 sm:p-4 text-left text-[#76767A] text-sm sm:text-base cursor-pointer'
										onClick={() => handleSort('name')}
									>
										<div className='flex items-center gap-1 sm:gap-2'>
											<span>Название файла</span>
											<div className='flex flex-col'>
												<span
													className={`text-[10px] mb-[-5px] ${
														sortColumn === 'title' && sortOrder === 'asc'
															? 'text-black'
															: 'text-gray-400'
													}`}
												>
													▲
												</span>
												<span
													className={`text-[10px] ${
														sortColumn === 'title' && sortOrder === 'desc'
															? 'text-black'
															: 'text-gray-400'
													}`}
												>
													▼
												</span>
											</div>
										</div>
									</th>
									<th
										className='p-3 sm:p-4 text-left text-[#76767A] text-sm sm:text-base cursor-pointer'
										onClick={() => handleSort('date')}
									>
										<div className='flex items-center gap-1 sm:gap-2'>
											<span>Дата загрузки</span>
											<div className='flex flex-col'>
												<span
													className={`text-[10px] mb-[-5px] ${
														sortColumn === 'created_on' && sortOrder === 'asc'
															? 'text-black'
															: 'text-gray-400'
													}`}
												>
													▲
												</span>
												<span
													className={`text-[10px] ${
														sortColumn === 'created_on' && sortOrder === 'desc'
															? 'text-black'
															: 'text-gray-400'
													}`}
												>
													▼
												</span>
											</div>
										</div>
									</th>
									<th className='p-3 sm:p-4 text-left text-[#76767A] text-sm sm:text-base'>
										<div className='flex items-center gap-1 sm:gap-2'>
											<span>Размер</span>
										</div>
									</th>
									<th className='p-3 sm:p-4 text-left text-[#76767A] text-sm sm:text-base'>
										Действия
									</th>
								</tr>
							</thead>
							<tbody>
								{files.map((file, index) => (
									<tr key={index} className='border-b'>
										<td className='p-3 sm:p-4'>{file.title}</td>
										<td className='p-3 sm:p-4'>
											{formatDate(file.created_on)}
										</td>
										<td className='p-3 sm:p-4'>
											{formatFileSize(Number(file.filesize))}
										</td>
										<td className='p-3 sm:p-4'>
											<button
												className='flex items-center justify-center gap-2 w-full text-white rounded-[10px] text-[12px] bg-[#007AFF] px-4 py-2 hover:bg-[#0054AF]'
												onClick={() => downloadFile(file.id, file.title)}
											>
												<img src={download} alt='' />
												Скачать
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className='flex items-center justify-center mt-6'>
							<ReactPaginate
								previousLabel={
									<img src={paginationNext} alt='' className='rotate-180' />
								}
								nextLabel={<img src={paginationNext} alt='' />}
								breakLabel={'...'}
								pageCount={Math.ceil(filesTotalCount / itemsPerPage)}
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								onPageChange={handlePageClick}
								containerClassName={'flex flex-wrap justify-center gap-2 p-4'}
								activeClassName={
									'border-[#007AFF] text-[#007AFF] px-3 py-1 rounded'
								}
								pageClassName={'px-3 py-1 border rounded'}
								previousClassName={'px-3 py-1 border rounded'}
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
			</div>
		</>
	)
}

export default Patient
