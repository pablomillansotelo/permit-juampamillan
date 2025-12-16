import { Elysia, t } from 'elysia'
import { UserRolesService } from './service.js'

export const userRoles = new Elysia({ prefix: '/user-roles' })
	/**
	 * POST /user-roles - Asignar un rol a un usuario
	 */
	.post(
		'/',
		async ({ body }) => {
			try {
				const assignment = await UserRolesService.assignRoleToUser({
					userId: body.userId,
					roleId: body.roleId
				})
				return {
					message: 'Rol asignado al usuario exitosamente',
					assignment
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: t.Object({
				userId: t.Number({ description: 'ID del usuario' }),
				roleId: t.Number({ description: 'ID del rol' })
			}),
			response: t.Object({
				message: t.String(),
				assignment: t.Object({
					id: t.Number(),
					userId: t.Number(),
					roleId: t.Number(),
					createdAt: t.Date()
				})
			}),
			detail: {
				tags: ['user-roles'],
				summary: 'Asignar un rol a un usuario',
			},
		}
	)

	/**
	 * DELETE /user-roles/:userId/:roleId - Remover un rol de un usuario
	 */
	.delete(
		'/:userId/:roleId',
		async ({ params }) => {
			try {
				const removed = await UserRolesService.removeRoleFromUser(
					Number(params.userId),
					Number(params.roleId)
				)
				return {
					message: 'Rol removido del usuario exitosamente',
					assignment: removed
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Object({
				message: t.String(),
				assignment: t.Object({
					id: t.Number(),
					userId: t.Number(),
					roleId: t.Number(),
					createdAt: t.Date()
				})
			}),
			detail: {
				tags: ['user-roles'],
				summary: 'Remover un rol de un usuario',
			},
		}
	)

	/**
	 * GET /user-roles/user/:userId - Obtener todos los roles de un usuario
	 */
	.get(
		'/user/:userId',
		async ({ params }) => {
			try {
				const roles = await UserRolesService.getUserRoles(Number(params.userId))
				return roles
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Array(
				t.Object({
					id: t.Number(),
					userId: t.Number(),
					roleId: t.Number(),
					roleName: t.Nullable(t.String()),
					roleDescription: t.Nullable(t.String()),
					createdAt: t.Date()
				})
			),
			detail: {
				tags: ['user-roles'],
				summary: 'Obtener todos los roles de un usuario',
			},
		}
	)

	/**
	 * GET /user-roles/user/:userId/permissions - Obtener todos los permisos de un usuario
	 */
	.get(
		'/user/:userId/permissions',
		async ({ params }) => {
			try {
				const permissions = await UserRolesService.getUserPermissions(Number(params.userId))
				return permissions
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Array(
				t.Object({
					permissionId: t.Number(),
					permissionName: t.Nullable(t.String()),
					permissionAction: t.Nullable(t.String()),
					resourceId: t.Nullable(t.Number()),
					resourceName: t.Nullable(t.String()),
					roleId: t.Number(),
					roleName: t.Nullable(t.String())
				})
			),
			detail: {
				tags: ['user-roles'],
				summary: 'Obtener todos los permisos de un usuario',
			},
		}
	)

	/**
	 * GET /user-roles/role/:roleId - Obtener todos los usuarios que tienen un rol
	 */
	.get(
		'/role/:roleId',
		async ({ params }) => {
			try {
				const users = await UserRolesService.getUsersWithRole(Number(params.roleId))
				return users
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Array(
				t.Object({
					id: t.Number(),
					userId: t.Number(),
					userName: t.Nullable(t.String()),
					userEmail: t.Nullable(t.String()),
					roleId: t.Number(),
					createdAt: t.Date()
				})
			),
			detail: {
				tags: ['user-roles'],
				summary: 'Obtener todos los usuarios que tienen un rol',
			},
		}
	)
	.compile()

