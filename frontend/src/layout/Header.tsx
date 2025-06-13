import exit from '../assets/exit.svg'
import logo from '../assets/logo&company.svg'
import { useAuth } from '../service/useAuth.tsx'
const Header = () => {
	const { logout } = useAuth()
	return (
		<div className='pt-3 pb-[35px] px-[80px] flex gap-8 justify-between'>
			<div>
				<img src={logo} alt='' />
			</div>
			<button onClick={logout} className='flex items-center gap-4'>
				<img className='w-[27px] h-[30px]' src={exit} alt='' />
				<p className='text-[16px] font-openSans font-semibold'>Выйти</p>
			</button>
		</div>
	)
}

export default Header
