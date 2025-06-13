import { Outlet } from 'react-router-dom'
import Header from './Header'

const OperatorLayout = () => {
	return (
		<div className=''>
			<Header />
			<div className='flex-1 w-full h-[100vh] overflow-x-hidden overflow-y-auto'>
				<Outlet />
			</div>
		</div>
	)
}

export default OperatorLayout
