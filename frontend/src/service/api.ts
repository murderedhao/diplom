import axios, {
	AxiosError,
	AxiosRequestConfig,
	InternalAxiosRequestConfig,
} from 'axios'

export const $api = axios.create({
	baseURL: import.meta.env.VITE_API_DIRECTUS_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

const sleepRequest = (
	milliseconds: number,
	originalRequest: InternalAxiosRequestConfig
) => {
	return new Promise(resolve => {
		setTimeout(() => resolve($api(originalRequest)), milliseconds)
	})
}

$api.interceptors.request.use(config => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

$api.interceptors.response.use(
	response => {
		return response
	},
	async (error: AxiosError<any>) => {
		const originalRequest = error.config
		const refreshToken = localStorage.getItem('refreshToken')

		if (error.response) {
			const validationErrors = error.response?.data?.errors

			switch (error.response.status) {
				case 401:
					try {
						if (refreshToken) {
							const response = await $api.post('/auth/refresh', {
								refresh_token: refreshToken,
							})

							if (response.status === 200) {
								const { access_token, refresh_token } = response.data
								localStorage.setItem('token', access_token)
								localStorage.setItem('refreshToken', refresh_token)
								return sleepRequest(
									500,
									originalRequest as InternalAxiosRequestConfig
								)
							}
						}
					} catch (e) {
						localStorage.removeItem('token')
						localStorage.removeItem('refreshToken')
						localStorage.removeItem('role')
						localStorage.removeItem('fullName')
						window.location.href = '/'
					}
					break

				default:
					validationErrors?.length
						? validationErrors.map(({ message }: { message: string }) =>
								alert(message)
						  )
						: alert(error.response?.data.message || error.message)
					break
			}
		}

		return Promise.reject(error)
	}
)

export const getFn = (url: string, queryParams?: any) =>
	$api.get(url, { params: queryParams }).then(res => res?.data)

export const postFn = (
	url: string,
	payload: any,
	config?: AxiosRequestConfig
) => $api.post(url, payload, config).then(res => res)

export const putFn = (url: string, payload: any) => {
	return $api.put(url, payload).then(res => res?.data)
}

export const patchFn = (url: string, payload: any) =>
	$api.patch(url, payload).then(res => res?.data)

export const deleteFn = (url: string, payload?: any) =>
	$api.delete(url, payload).then(res => res?.data)
