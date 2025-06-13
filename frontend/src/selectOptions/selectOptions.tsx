export interface Option {
	value: string
	label: string
}

export const statusOptions: Option[] = [
	{ value: 'В связи не нуждается', label: 'В связи не нуждается' },
	{ value: 'Ожидание связи', label: 'Ожидание связи' },
	{ value: 'В процессе связи', label: 'В процессе связи' },
	{
		value: 'Взять на контроль Колл-центру',
		label: 'Взять на контроль Колл-центру',
	},
	{ value: 'Нет отвечает, дать номер', label: 'Не отвечает, дать номер' },
	{ value: 'Думает', label: 'Думает' },
	{ value: 'В связи не нуждается', label: 'В связи не нуждается' },
	{
		value: 'Согласен, записать на встречу',
		label: 'Согласен, записать на встречу',
	},
	{ value: 'Записан на встречу', label: 'Записан на встречу' },
	{ value: 'Записан на консультацию', label: 'Записан на консультацию' },
	{ value: 'Отказывается', label: 'Отказывается' },
	{ value: 'Ожидание', label: 'Ожидание' },
	{ value: 'Отработано', label: 'Отработано' },
]

export async function operatorOptions(): Promise<Option[]> {
	try {
		// directus
		const apiUrl = `${import.meta.env.VITE_API_DIRECTUS_URL}/users`
		const token = localStorage.getItem('token')

		// Параметры запроса
		const params = new URLSearchParams({
			'filter[role][name][_eq]': 'operator',
			fields: 'id,last_name',
		})

		const response = await fetch(`${apiUrl}?${params.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const { data } = await response.json()

		return data.map((user: { id: string; last_name: string }) => ({
			value: `operator${user.id}`,
			label: user.last_name,
		}))
	} catch (error) {
		console.error('Error fetching operators:', error)
		return []
	}
}

export const treatmentStatusOptions: Option[] = [
	{ value: 'Ожидаем приезда', label: 'Ожидаем приезда' },
	{ value: 'Устроен', label: 'Устроен' },
]

export const controlStatusOptions: Option[] = [
	{ value: 'completed_orally', label: 'Выполнено устно' },
	{ value: 'waiting_for_contact', label: 'Ожидание связи' },
	{ value: 'has_remarks', label: 'Есть вопросы' },
	{ value: 'no_remarks', label: 'Вопросов нет' },
	{ value: 'no_answer_give_number', label: 'Не отвечает, дать номер' },
]
export const sortOptions: Option[] = [
	{ value: 'full_name', label: 'По алфавиту' },
	{ value: '-id', label: 'Сначала новые' },
	{ value: 'id', label: 'Сначала старые' },
]
