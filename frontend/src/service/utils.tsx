export const getRedirectPath = (role: string): string => {
	const admin = import.meta.env.VITE_API_ADMIN_TOKEN
	const operator = import.meta.env.VITE_API_OPERATOR_TOKEN
	const patient = import.meta.env.VITE_API_PATIENT_TOKEN
	switch (role.toLowerCase()) {
		case admin:
			return '/admin'
		case patient:
			return '/patient'
		case operator:
			return '/operator'
		default:
			return '/'
	}
}

export const formatDate = (dateString: string | null): string => {
	if (!dateString) return ''

	const date = new Date(dateString)
	if (isNaN(date.getTime())) return dateString

	// Получаем компоненты даты
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()

	return `${hours}:${minutes} ${day}.${month}.${year}`
}
