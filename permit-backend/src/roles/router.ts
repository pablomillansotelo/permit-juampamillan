import { Elysia, t } from 'elysia'
import { RolesService } from './service.js'
import { RolesModel } from './model.js'

export const roles = new Elysia({ prefix: '/roles' })
	/**
	 * GET /roles - Obtener todos los roles
	 */
	.get(
		'/',
		async () => {
			try {
				const allRoles = await RolesService.getAllRoles()
				return allRoles
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: RolesModel.rolesList,
			detail: {
				tags: ['roles'],
				summary: 'Obtener todos los roles',
			},
		}
	)

	/**
	 * GET /roles/:id - Obtener un rol por ID
	 */
	.get(
		'/:id',
		async ({ params }) => {
			try {
				const role = await RolesService.getRoleById(Number(params.id))
				return role
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: RolesModel.roleResponse,
			detail: {
				tags: ['roles'],
				summary: 'Obtener un rol por ID',
			},
		}
	)

	/**
	 * POST /roles - Crear un nuevo rol
	 */
	.post(
		'/',
		async ({ body }) => {
			try {
				const newRole = await RolesService.createRole({
					name: body.name,
					description: body.description
				})
				return newRole
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: RolesModel.createBody,
			response: RolesModel.roleResponse,
			detail: {
				tags: ['roles'],
				summary: 'Crear un nuevo rol',
			},
		}
	)

	/**
	 * PUT /roles/:id - Actualizar un rol
	 */
	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				const updatedRole = await RolesService.updateRole(
					Number(params.id),
					body
				)
				return updatedRole
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: RolesModel.updateBody,
			response: RolesModel.roleResponse,
			detail: {
				tags: ['roles'],
				summary: 'Actualizar un rol',
			},
		}
	)

	/**
	 * DELETE /roles/:id - Eliminar un rol
	 */
	.delete(
		'/:id',
		async ({ params }) => {
			try {
				const deletedRole = await RolesService.deleteRole(Number(params.id))
				return {
					message: 'Rol eliminado exitosamente',
					role: deletedRole
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Object({
				message: t.String(),
				role: RolesModel.roleResponse
			}),
			detail: {
				tags: ['roles'],
				summary: 'Eliminar un rol',
			},
		}
	)
	.compile()

