import { PatientDataI, UserDataI } from '../types/types'
export default async function onSubmit(patientData: PatientDataI) {
	// directus
	const directus_url = import.meta.env.VITE_API_DIRECTUS_URL
	const directus_token = localStorage.getItem('token')

	// patientdata log
	console.log(patientData)

	const request = await fetch(`${directus_url}/new-patient/new-patient`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${directus_token}`,
		},
		body: JSON.stringify(patientData),
	})
	if (!request.ok) {
		console.log('Ошибка отправки запроса: ', request.status)
	}
}
export async function onSubmitUpdate(patientData: PatientDataI) {
	// directus
	const directus_url = import.meta.env.VITE_API_DIRECTUS_URL
	const directus_token = localStorage.getItem('token')

	// patientdata log
	console.log(patientData)

	const request = await fetch(`${directus_url}/new-patient/update-patient`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${directus_token}`,
		},
		body: JSON.stringify(patientData),
	})
	if (!request.ok) {
		console.log('Ошибка отправки запроса: ', request.status)
	}
}

export async function onSubmitAccess(userData: UserDataI) {
	const directus_url = import.meta.env.VITE_API_DIRECTUS_URL
	const patientIdRole = import.meta.env.VITE_API_PATIENT_TOKEN
	const directus_token = localStorage.getItem('token')

	try {
		const request = await fetch(`${directus_url}/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${directus_token}`,
			},
			body: JSON.stringify({
				first_name: userData.name?.split(' ')[1] || '', // Имя
				last_name: userData.name?.split(' ')[0] || '', // Фамилия
				email: `${userData.username}@example.com`,
				password: userData.password,
				role: patientIdRole,
				phone: userData.phone_number,
				username: userData.username,
			}),
		})

		if (!request.ok) {
			const errorData = await request.json()
			console.error('Ошибка создания пользователя:', errorData)
			throw new Error(`Ошибка создания пользователя: ${request.status}`)
		}

		const response = await request.json()
		console.log('Пользователь успешно создан:', response)
		return response
	} catch (error) {
		console.error('Произошла ошибка:', error)
		throw error
	}
}
export async function updateDirectusUser(
	userData: UserDataI,
	accessToken?: string
) {
	interface User {
		first_name: string
		last_name: string
		username: string
		password: string
	}
	const directus_url = import.meta.env.VITE_API_DIRECTUS_URL
	const directus_token = localStorage.getItem('token')

	try {
		// Подготовка данных для обновления
		const updateData: User = {
			first_name: userData.name?.split(' ')[1] || '', // Имя
			last_name: userData.name?.split(' ')[0] || '', // Фамилия
			// phone: userData.phone_number,
			// access: accessToken,
			username: userData.username,
			password: userData.password,
		}

		if (accessToken !== undefined) {
			// updateData.access = accessToken || null // null для удаления токена
		}

		// Если есть username (логин) - обновляем его
		if (userData.username) {
			updateData.username = userData.username
		}

		// Если есть пароль - обновляем его (если нужно)
		if (userData.password) {
			updateData.password = userData.password
		}
		console.log(updateData)

		const response = await fetch(`${directus_url}/users/${accessToken}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${directus_token}`,
			},
			body: JSON.stringify(updateData),
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || 'Failed to update user')
		}

		return await response.json()
	} catch (error) {
		console.error('Error updating user in Directus:', error)
		throw error
	}
}

// Пример использования:
// Включение доступа (установка токена)
// await updateDirectusUser(patientData, 'some-access-token');

// Выключение доступа (удаление токена)
// await updateDirectusUser(patientData, '');
