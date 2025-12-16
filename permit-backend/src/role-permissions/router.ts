import { Elysia, t } from 'elysia'
import { RolePermissionsService } from './service.js'

export const rolePermissions = new Elysia({ prefix: '/role-permissions' })
	/**
	 * POST /role-permissions - Asignar un permiso a un rol
	 */
	.post(
		'/',
		async ({ body }) => {
			try {
				const assignment = await RolePermissionsService.assignPermissionToRole({
					roleId: body.roleId,
					permissionId: body.permissionId
				})
				return {
					message: 'Permiso asignado al rol exitosamente',
					assignment
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: t.Object({
				roleId: t.Number({ description: 'ID del rol' }),
				permissionId: t.Number({ description: 'ID del permiso' })
			}),
			response: t.Object({
				message: t.String(),
				assignment: t.Object({
					id: t.Number(),
					roleId: t.Number(),
					permissionId: t.Number(),
					createdAt: t.Date()
				})
			}),
			detail: {
				tags: ['role-permissions'],
				summary: 'Asignar un permiso a un rol',
			},
		}
	)

	/**
	 * DELETE /role-permissions/:roleId/:permissionId - Remover un permiso de un rol
	 */
	.delete(
		'/:roleId/:permissionId',
		async ({ params }) => {
			try {
				const removed = await RolePermissionsService.removePermissionFromRole(
					Number(params.roleId),
					Number(params.permissionId)
				)
				return {
					message: 'Permiso removido del rol exitosamente',
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
					roleId: t.Number(),
					permissionId: t.Number(),
					createdAt: t.Date()
				})
			}),
			detail: {
				tags: ['role-permissions'],
				summary: 'Remover un permiso de un rol',
			},
		}
	)

	/**
	 * GET /role-permissions/role/:roleId - Obtener todos los permisos de un rol
	 */
	.get(
		'/role/:roleId',
		async ({ params }) => {
			try {
				const permissions = await RolePermissionsService.getRolePermissions(Number(params.roleId))
				return permissions
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Array(
				t.Object({
					id: t.Number(),
					roleId: t.Number(),
					permissionId: t.Number(),
					permissionName: t.Nullable(t.String()),
					permissionAction: t.Nullable(t.String()),
					resourceId: t.Nullable(t.Number()),
					resourceName: t.Nullable(t.String()),
					createdAt: t.Date()
				})
			),
			detail: {
				tags: ['role-permissions'],
				summary: 'Obtener todos los permisos de un rol',
			},
		}
	)

	/**
	 * GET /role-permissions/permission/:permissionId - Obtener todos los roles que tienen un permiso
	 */
	.get(
		'/permission/:permissionId',
		async ({ params }) => {
			try {
				const roles = await RolePermissionsService.getRolesWithPermission(Number(params.permissionId))
				return roles
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Array(
				t.Object({
					id: t.Number(),
					roleId: t.Number(),
					roleName: t.Nullable(t.String()),
					permissionId: t.Number(),
					createdAt: t.Date()
				})
			),
			detail: {
				tags: ['role-permissions'],
				summary: 'Obtener todos los roles que tienen un permiso',
			},
		}
	)
	.compile()

