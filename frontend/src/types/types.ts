export interface PatientDataI {
	id: number
	access: string
	full_name: string
	city: string
	phone_number: string
	operator: string | null
	status: string | null
	comments: string
	treatment_status: string | null
	date_call: string | null
	date_start_treatment: string | null
	volume_work: string | null
	price_work: string | null
	control_one: string | null
	control_month: string | null
	comments_one: string | null
	control_three: string | null
	control_three_months: string | null
	comments_three: string | null
	control_six: string | null
	control_six_months: string | null
	comments_six: string | null
	control_twelve: string | null
	control_twelve_months: string | null
	comments_twelve: string | null
	user: {
		status: string
		id: string
	}
}
export interface UserDataI {
	id: string
	phone_number: string
	name: string
	discription: string
	username: string
	password: string
	first_name: string
	last_name: string
	access: string
	status: 'active' | 'inactive'
}
export interface Auth {
	login: string
	password: string
}

export interface Tokens {
	access_token: string
	refresh_token: string
}
export interface AuthContextType {
	user: User | null
	login: (
		tokens: Tokens,
		role: string,
		fullName: string,
		status: 'active' | 'inactive'
	) => void
	logout: () => void
	isLoading: boolean
}

export interface User {
	fullName?: string
	role: string
	status: 'active' | 'inactive' | null
}

export interface FileType {
	id: string
	storage: string
	filename_disk: string
	filename_download: string
	title: string
	type: string
	folder: null
	uploaded_by: string
	created_on: string
	modified_by: null
	modified_on: string
	charset: null
	filesize: string
	width: null
	height: null
	duration: null
	embed: null
	description: null
	location: null
	tags: null
	metadata: null
	focal_point_x: null
	focal_point_y: null
	tus_id: null
	tus_data: null
	uploaded_on: string
}
