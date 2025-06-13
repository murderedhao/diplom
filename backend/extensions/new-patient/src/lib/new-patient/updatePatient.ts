import { EndpointExtensionContext } from '@directus/extensions'
import { Router } from 'express'
import { updatePatient } from '../../directus-repository'
import { PatientDataI } from '../types'

export default function handleUpdatePatientRequest(
	router: Router,
	context: EndpointExtensionContext
) {
	router.post('/update-patient', async (req, res) => {
		try {
			// Получаем тело запроса
			const patientData: PatientDataI = req.body
			console.log('Received request body for update:', patientData)

			// Получаем сервисы и схему
			const { ItemsService } = context.services
			const schema = await context.getSchema()

			// Получаем коллекцию `Patients`
			const patientCollection = new ItemsService('Patients', { schema })

			// Обновляем данные пациента
			const updatedPatient = await updatePatient(
				patientCollection,
				patientData.id,
				patientData
			)

			// Отправляем успешный ответ
			res.status(200).json({
				message: 'Patient updated successfully',
				data: updatedPatient,
			})
		} catch (error) {
			console.error('Error updating patient:', error)
			res.status(500).json({
				message: 'Failed to update patient',
				error: error instanceof Error ? error.message : 'Unknown error',
			})
		}
	})
}
