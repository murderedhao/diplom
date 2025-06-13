import { defineEndpoint } from '@directus/extensions-sdk'
import handleCreatePatientRequest from '../src/lib/new-patient/createNewPatient'
import authPatient from './lib/new-patient/authPatient'
import handleUpdatePatientRequest from './lib/new-patient/updatePatient'

export default defineEndpoint((router, context) => {
	handleCreatePatientRequest(router, context)
	handleUpdatePatientRequest(router, context)
	authPatient(router, context)
})
