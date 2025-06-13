import React from 'react'
import ReactPaginate from 'react-paginate'
import paginationNext from '../assets/paginationNext.svg'

interface PaginationProps {
	pageCount: number
	currentPage: number
	onPageChange: (selected: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
	pageCount,
	currentPage,
	onPageChange,
}) => {
	return (
		<>
			<div className='flex justify-center mt-6'>
				<ReactPaginate
					// Кнопка "Предыдущая"
					previousLabel={
						<div className='flex items-center justify-center h-full'>
							<img
								className='rotate-180'
								src={paginationNext}
								alt='<'
								style={{ filter: 'grayscale(100%)' }} // Серый цвет для отключенных кнопок
							/>
						</div>
					}
					// Кнопка "Следующая"
					nextLabel={
						<div className='flex items-center justify-center h-full'>
							<img
								src={paginationNext}
								alt='>'
								style={{ filter: 'grayscale(100%)' }} // Серый цвет для отключенных кнопок
							/>
						</div>
					}
					// Многоточие для скрытия диапазонов страниц
					breakLabel={
						<div className='flex items-center justify-center h-full'>
							<span className='text-[#76767A]'>...</span>
						</div>
					}
					// Общее количество страниц
					pageCount={pageCount}
					// Количество страниц, отображаемых перед и после текущей
					marginPagesDisplayed={2}
					// Количество страниц, отображаемых в текущем диапазоне
					pageRangeDisplayed={5}
					// Обработчик изменения страницы
					onPageChange={({ selected }) => onPageChange(selected)}
					// Текущая страница
					forcePage={currentPage}
					// Стилизация контейнера
					containerClassName={'flex gap-2 items-center'}
					// Стилизация активной страницы
					activeClassName={
						'text-[#007AFF] font-openSans border-[1px] border-[#007AFF]'
					}
					// Стилизация обычной страницы
					pageClassName={'border rounded font-openSans'}
					// Стилизация кнопки "Предыдущая"
					previousClassName={
						'border rounded h-full flex items-center justify-center'
					}
					// Стилизация кнопки "Следующая"
					nextClassName={
						'border rounded h-full flex items-center justify-center'
					}
					// Стилизация многоточия
					breakClassName={'border rounded flex items-center justify-center'}
					// Стилизация отключенных кнопок
					disabledClassName={'opacity-50 cursor-not-allowed'}
					// Стилизация ссылки на страницу
					pageLinkClassName={'block px-3 py-1 w-full h-full'}
					// Стилизация ссылки на кнопку "Предыдущая"
					previousLinkClassName={
						'block px-3 py-1 w-full h-full flex items-center justify-center'
					}
					// Стилизация ссылки на кнопку "Следующая"
					nextLinkClassName={
						'block px-3 py-1 w-full h-full flex items-center justify-center'
					}
					// Стилизация ссылки на многоточие
					breakLinkClassName={
						'block px-3 py-1 w-full h-full flex items-center justify-center'
					}
				/>
			</div>
		</>
	)
}

export default Pagination
