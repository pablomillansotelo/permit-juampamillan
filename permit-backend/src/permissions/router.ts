import { Elysia, t } from 'elysia'
import { PermissionsService } from './service.js'
import { PermissionsModel } from './model.js'

export const permissions = new Elysia({ prefix: '/permissions' })
	/**
	 * GET /permissions - Obtener todos los permisos
	 */
	.get(
		'/',
		async () => {
			try {
				const allPermissions = await PermissionsService.getAllPermissions()
				return allPermissions
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: PermissionsModel.permissionsList
		}
	)

	/**
	 * GET /permissions/:id - Obtener un permiso por ID
	 */
	.get(
		'/:id',
		async ({ params }) => {
			try {
				const permission = await PermissionsService.getPermissionById(Number(params.id))
				return permission
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: PermissionsModel.permissionResponse
		}
	)

	/**
	 * GET /permissions/resource/:resourceId - Obtener permisos por recurso
	 */
	.get(
		'/resource/:resourceId',
		async ({ params }) => {
			try {
				const resourcePermissions = await PermissionsService.getPermissionsByResource(Number(params.resourceId))
				return resourcePermissions
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: PermissionsModel.permissionsList
		}
	)

	/**
	 * POST /permissions - Crear un nuevo permiso para un recurso
	 */
	.post(
		'/',
		async ({ body }) => {
			try {
				const newPermission = await PermissionsService.createPermission({
					name: body.name,
					action: body.action,
					resourceId: body.resourceId,
					description: body.description
				})
				return newPermission
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: PermissionsModel.createBody,
			response: PermissionsModel.permissionResponse
		}
	)

	/**
	 * PUT /permissions/:id - Actualizar un permiso
	 */
	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				const updatedPermission = await PermissionsService.updatePermission(
					Number(params.id),
					body
				)
				return updatedPermission
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: PermissionsModel.updateBody,
			response: PermissionsModel.permissionResponse
		}
	)

	/**
	 * DELETE /permissions/:id - Eliminar un permiso
	 */
	.delete(
		'/:id',
		async ({ params }) => {
			try {
				const deletedPermission = await PermissionsService.deletePermission(Number(params.id))
				return {
					message: 'Permiso eliminado exitosamente',
					permission: deletedPermission
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Object({
				message: t.String(),
				permission: PermissionsModel.permissionResponse
			})
		}
	)
	.compile()

