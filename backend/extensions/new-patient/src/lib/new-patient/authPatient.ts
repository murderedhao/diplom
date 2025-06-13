import { EndpointExtensionContext } from '@directus/extensions'
import { Router } from 'express'

export default async function authPatient(
	router: Router,
	context: EndpointExtensionContext
) {
	const { database: knex } = context
	router.post('/auth-patient', async (req, res) => {
		const { username, password } = req.body

		const user = await knex
			.select('id', 'email')
			.from('directus_users')
			.whereRaw('LOWER(??) = ?', ['username', username.toLowerCase()])
			.first()
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' })
		}
		res.status(200).json({
			email: user.email,
		})
	})
}
