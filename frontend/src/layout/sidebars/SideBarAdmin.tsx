import clsx from 'clsx'
import { NavLink, useLocation } from 'react-router-dom'
import consultant from '../../assets/consult.svg'
import exit from '../../assets/exit.svg'
import operator from '../../assets/operator.svg'
import sideBarIconDetailed from '../../assets/sideBarIconDetailed.svg'
import { useAuth } from '../../service/useAuth.tsx'

const SideBarAdmin = () => {
	const location = useLocation()
	const { logout } = useAuth()

	const menuItems = [
		{
			key: 'general',
			path: '/admin',
			label: 'Список пациентов',
			icon: sideBarIconDetailed,
		},
		{
			key: 'operator',
			path: '/admin/operators',
			label: 'Операторы',
			icon: operator,
		},
		{
			key: 'consult',
			path: '/admin/consultants',
			label: 'Консультанты',
			icon: consultant,
		},
	]

	return (
		<div className='min-w-[250px] bg-[#FFFFFF] h-screen left-0 top-0 flex flex-col'>
			<div className='p-4'>
				<div className='flex flex-col justify-center px-4 pt-3'>
					<h1 className='font-openSans text-[24px] font-bold text-[#27272A]'>
						Администратор
					</h1>
				</div>
			</div>
			<ul className='flex-grow mt-4 border-b'>
				{menuItems.map(({ key, path, label, icon }) => {
					const isActive = location.pathname === path
					return (
						<li
							key={key}
							className={`flex justify-between items-center mb-2 font-openSans text-[14px] text-[#1A1A1A] rounded-lg cursor-pointer relative `}
						>
							{isActive && (
								<div className='absolute left-0 top-0 h-full w-[4px] bg-[#007AFF] rounded-r-lg'></div>
							)}
							<NavLink
								to={path}
								className={clsx(
									'flex ml-6 hover:bg-[#007AFF] hover:text-white p-4 w-full rounded-md h-full gap-3 font-openSans leading-[15px] text-[14px] text-[#1A1A1A]',
									isActive && 'text-white bg-[#007AFF]'
								)}
							>
								<img
									src={icon}
									alt={label}
									className={clsx(isActive && 'filter brightness-0 invert')}
								/>
								{label}
							</NavLink>
						</li>
					)
				})}
			</ul>
			<div>
				<button onClick={logout} className='flex pl-[40px] gap-3 p-4 mt-auto'>
					<img src={exit} alt='Выйти' />
					<p className='text-[14px] font-openSans'>Выйти</p>
				</button>
			</div>
		</div>
	)
}

export default SideBarAdmin
