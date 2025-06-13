import { PatientDataI } from './lib/types'

// function createNewPatient
export async function createNewPatient(
	patientCollection: any,
	patientData: PatientDataI
) {
	console.log('patientdata', patientData)
	return await patientCollection.createOne(patientData)
}
// function updatePatient
export async function updatePatient(
	patientCollection: any,
	id: number,
	patientData: PatientDataI
) {
	return await patientCollection.updateOne(id, patientData)
}
