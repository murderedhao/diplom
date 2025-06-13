import { Outlet } from 'react-router-dom'
import SideBarAdmin from './sidebars/SideBarAdmin'

const AdminLayout = () => {
	return (
		<div className='flex'>
			<SideBarAdmin />
			<div className='flex-1 w-full h-[100vh] overflow-x-hidden overflow-y-auto'>
				<Outlet />
			</div>
		</div>
	)
}

export default AdminLayout
