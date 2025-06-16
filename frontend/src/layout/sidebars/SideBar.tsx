import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import exit from '../../assets/exit.svg'
import sideBarIconDetailed from '../../assets/sideBarIconDetailed.svg'
import sideBarIconGeneral from '../../assets/sideBarIconGeneral.svg'
import { useAuth } from '../../service/useAuth.tsx'

const SideBar = () => {
	const location = useLocation()
	const { logout } = useAuth()
	const { user } = useAuth()

	const activeMenu =
		location.pathname === '/operator/detailed' ? 'detailed' : 'general'

	return (
		<div className='min-w-[250px] bg-[#FFFFFF] h-screen left-0 top-0 flex flex-col border-r justify-between'>
			<div className='p-4'>
				<div className='flex flex-col justify-center px-4 pt-3'>
					<h1 className='font-openSans text-[24px] font-bold text-[#27272A]'>
						Оператор
					</h1>
					<p className='font-openSans text-[24px] font-bold text-[#27272A]'>
						{user?.fullName}
					</p>
				</div>
			</div>
			<ul className='flex-grow mt-4 border-b'>
				<li className='mb-2'>
					<Link
						to='/operator'
						className={clsx(
							'flex justify-between items-center font-openSans text-[14px] text-[#1A1A1A] rounded-lg cursor-pointer relative',
							activeMenu === 'general' && 'text-[#007AFF]'
						)}
					>
						{activeMenu === 'general' && (
							<div className='absolute left-0 top-0 h-full w-[4px] bg-[#007AFF] rounded-r-lg'></div>
						)}
						<div
							className={clsx(
								'flex ml-6 hover:bg-[#007AFF] hover:text-white p-4 w-full rounded-md h-full gap-3 font-openSans leading-[15px] text-[14px] text-[#1A1A1A]',
								activeMenu === 'general' && 'text-white bg-[#007AFF]'
							)}
						>
							<img
								src={sideBarIconGeneral}
								alt='Общий список'
								className={clsx(
									activeMenu === 'general' && 'filter brightness-0 invert'
								)}
							/>
							Список пользователей общий
						</div>
					</Link>
				</li>
				<li className='mb-2'>
					<Link
						to='/operator/detailed'
						className={clsx(
							'flex justify-between items-center font-openSans text-[14px] text-[#1A1A1A] rounded-lg cursor-pointer relative',
							activeMenu === 'detailed' && 'text-[#007AFF]'
						)}
					>
						{activeMenu === 'detailed' && (
							<div className='absolute left-0 top-0 h-full w-[4px] bg-[#007AFF] rounded-r-lg'></div>
						)}
						<div
							className={clsx(
								'flex ml-6 hover:bg-[#007AFF] hover:text-white p-4 w-full rounded-md h-full gap-3 font-openSans leading-[15px] text-[14px] text-[#1A1A1A]',
								activeMenu === 'detailed' && 'text-white bg-[#007AFF]'
							)}
						>
							<img
								src={sideBarIconDetailed}
								alt='Подробный список'
								className={clsx(
									activeMenu === 'detailed' && 'filter brightness-0 invert'
								)}
							/>
							Список пользователей подробно
						</div>
					</Link>
				</li>
			</ul>
			<div>
				<button onClick={logout} className='flex pl-[40px] gap-3 p-4 mt-auto'>
					<img src={exit} alt='' />
					<p className='text-[14px] font-openSans'>Выйти</p>
				</button>
			</div>
		</div>
	)
}

export default SideBar
