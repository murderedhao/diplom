import { EndpointExtensionContext } from '@directus/extensions'
import { Router } from 'express'
import { createNewPatient } from '../../directus-repository'
import { PatientDataI } from '../types'

export default function handleCreatePatientRequest(
	router: Router,
	context: EndpointExtensionContext
) {
	router.post('/new-patient', async (req, res) => {
		try {
			// Получаем тело запроса
			const patientData: PatientDataI = req.body
			console.log('Received request body:', patientData)

			// Получаем сервисы и схему
			const { ItemsService } = context.services
			const schema = await context.getSchema()

			// Получаем коллекцию `patient`
			const patientCollection = new ItemsService('Patients', {
				schema: schema,
			})

			// Используем импортируемую функцию для создания нового пациента
			const newPatient = await createNewPatient(patientCollection, patientData)

			// Отправляем успешный ответ
			res.status(200).json({
				message: 'Patient created successfully',
				data: newPatient,
			})
		} catch (error) {
			console.error('Error creating patient:', error)

			res.status(500).json({
				message: 'Failed to create patient',
				error: error,
			})
		}
	})
}
