import { Elysia, t } from 'elysia'
import { UsersService } from './service.js'
import { UsersModel } from './model.js'

export const users = new Elysia({ prefix: '/users' })
	/**
	 * GET /users - Obtener todos los usuarios
	 */
	.get(
		'/',
		async () => {
			try {
				const allUsers = await UsersService.getAllUsers()
				return allUsers
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: UsersModel.usersList
		}
	)

	/**
	 * GET /users/:id - Obtener un usuario por ID
	 */
	.get(
		'/:id',
		async ({ params }) => {
			try {
				const user = await UsersService.getUserById(Number(params.id))
				return user
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: UsersModel.userResponse
		}
	)

	/**
	 * POST /users - Crear un nuevo usuario
	 */
	.post(
		'/',
		async ({ body }) => {
			try {
				const newUser = await UsersService.createUser({
					name: body.name,
					email: body.email
				})
				return newUser
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: UsersModel.createBody,
			response: UsersModel.userResponse
		}
	)

	/**
	 * PUT /users/:id - Actualizar un usuario
	 */
	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				const updatedUser = await UsersService.updateUser(
					Number(params.id),
					body
				)
				return updatedUser
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: UsersModel.updateBody,
			response: UsersModel.userResponse
		}
	)

	/**
	 * DELETE /users/:id - Eliminar un usuario
	 */
	.delete(
		'/:id',
		async ({ params }) => {
			try {
				const deletedUser = await UsersService.deleteUser(Number(params.id))
				return {
					message: 'Usuario eliminado exitosamente',
					user: deletedUser
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Object({
				message: t.String(),
				user: UsersModel.userResponse
			})
		}
	)

	/**
	 * POST /users/sign-in - Autenticación de usuario
	 */
	.post(
		'/sign-in',
		async ({ body, cookie: { session } }) => {
			try {
				const response = await UsersService.signIn(body.email, body.password)

				// Establecer cookie de sesión
				if (session) {
					session.value = response.token
				}

				return response
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: UsersModel.signInBody,
			response: UsersModel.signInResponse
		}
	)
	.compile()

    