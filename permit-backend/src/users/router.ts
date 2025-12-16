import { Elysia, t } from 'elysia'
import { UsersService } from './service.js'
import { UsersModel } from './model.js'

export const users = new Elysia({ prefix: '/users' })
	/**
	 * GET /users - Obtener todos los usuarios con filtros opcionales
	 */
	.get(
		'/',
		async ({ query }) => {
			try {
				const filters: any = {}
				const queryParams = query as any
				if (queryParams?.department_id) filters.departmentId = Number(queryParams.department_id)
				if (queryParams?.position_id) filters.positionId = Number(queryParams.position_id)
				if (queryParams?.status) filters.status = queryParams.status as string
				if (queryParams?.manager_id) filters.managerId = Number(queryParams.manager_id)
				if (queryParams?.employment_type) filters.employmentType = queryParams.employment_type as string
				if (queryParams?.search) filters.search = queryParams.search as string
				
				const allUsers = await UsersService.getAllUsers(Object.keys(filters).length > 0 ? filters : undefined)
				return allUsers
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				department_id: t.Optional(t.String()),
				position_id: t.Optional(t.String()),
				status: t.Optional(t.String()),
				manager_id: t.Optional(t.String()),
				employment_type: t.Optional(t.String()),
				search: t.Optional(t.String()),
			}),
			response: UsersModel.usersList,
			detail: {
				tags: ['users'],
				summary: 'Obtener todos los usuarios con filtros opcionales',
			},
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
			response: UsersModel.userResponse,
			detail: {
				tags: ['users'],
				summary: 'Obtener un usuario por ID',
			},
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
			response: UsersModel.userResponse,
			detail: {
				tags: ['users'],
				summary: 'Crear un nuevo usuario',
			},
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
			response: UsersModel.userResponse,
			detail: {
				tags: ['users'],
				summary: 'Actualizar un usuario',
			},
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
			}),
			detail: {
				tags: ['users'],
				summary: 'Eliminar un usuario',
			},
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
			response: UsersModel.signInResponse,
			detail: {
				tags: ['users'],
				summary: 'Autenticación de usuario',
			},
		}
	)

	/**
	 * GET /users/:id/hierarchy - Obtener jerarquía (manager y subordinados)
	 */
	.get(
		'/:id/hierarchy',
		async ({ params }) => {
			try {
				const hierarchy = await UsersService.getHierarchy(Number(params.id))
				return hierarchy
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Object({
				user: UsersModel.userResponse,
				manager: t.Nullable(UsersModel.userResponse),
				subordinates: t.Array(UsersModel.userResponse),
			}),
			detail: {
				tags: ['users'],
				summary: 'Obtener jerarquía (manager y subordinados)',
			},
		}
	)

	/**
	 * GET /users/:id/subordinates - Obtener subordinados directos e indirectos
	 */
	.get(
		'/:id/subordinates',
		async ({ params, query }) => {
			try {
				const includeIndirect = query.include_indirect !== 'false'
				const subordinates = await UsersService.getSubordinates(Number(params.id), includeIndirect)
				return subordinates
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				include_indirect: t.Optional(t.String()),
			}),
			response: t.Array(UsersModel.userResponse),
			detail: {
				tags: ['users'],
				summary: 'Obtener subordinados directos e indirectos',
			},
		}
	)

	/**
	 * GET /users/:id/ancestors - Obtener manager y superiores
	 */
	.get(
		'/:id/ancestors',
		async ({ params }) => {
			try {
				const ancestors = await UsersService.getAncestors(Number(params.id))
				return ancestors
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Array(UsersModel.userResponse),
			detail: {
				tags: ['users'],
				summary: 'Obtener manager y superiores',
			},
		}
	)
	.compile()

    