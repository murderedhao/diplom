import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom'
import InternalServerErrorPage from './errors/InternalServerErrorPage'
import NotAccessPage from './errors/NotAccessPage'
import NotFoundPage from './errors/NotFoundPage'
import AdminLayout from './layout/AdminLayout'
import OperatorLayout from './layout/OperatorLayout'
import AdminDetailed from './pages/admin/AdminDetailed'
import AdminOperators from './pages/admin/AdminOperators'
import LoginPage from './pages/Login'
import OperatorDetailed from './pages/operator/OperatorDetailed'
import Patient from './pages/Patient'
import PatientCard from './pages/PatientCard'
import { AuthProvider } from './service/AuthProvider'
import ProtectedRoute from './service/ProtectRoute'

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path='/' element={<LoginPage />} />

					<Route
						path='/operator'
						element={
							<ProtectedRoute
								element={<OperatorLayout />}
								roles={[import.meta.env.VITE_API_OPERATOR_TOKEN]}
							/>
						}
					>
						<Route index element={<OperatorDetailed />} />
					</Route>

					<Route
						path='/patient'
						element={
							<ProtectedRoute
								element={<Patient />}
								roles={[import.meta.env.VITE_API_PATIENT_TOKEN]}
							/>
						}
					/>

					<Route
						path='/admin'
						element={
							<ProtectedRoute
								element={<AdminLayout />}
								roles={[import.meta.env.VITE_API_ADMIN_TOKEN]}
							/>
						}
					>
						<Route index element={<AdminDetailed />} />
						<Route path='operators' element={<AdminOperators />} />
					</Route>

					<Route
						path='/patientcard'
						element={
							<ProtectedRoute
								element={<PatientCard />}
								roles={['admin', 'operator']}
							/>
						}
					/>

					<Route path='/500' element={<InternalServerErrorPage />} />
					<Route path='/403' element={<NotAccessPage />} />
					<Route path='/404' element={<NotFoundPage />} />
					<Route path='*' element={<Navigate to='/404' replace />} />
				</Routes>
			</AuthProvider>
		</Router>
	)
}

export default App
