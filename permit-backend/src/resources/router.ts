import { Elysia, t } from 'elysia'
import { ResourcesService } from './service.js'
import { ResourcesModel } from './model.js'

export const resources = new Elysia({ prefix: '/resources' })
	/**
	 * GET /resources - Obtener todos los recursos
	 */
	.get(
		'/',
		async () => {
			try {
				const allResources = await ResourcesService.getAllResources()
				return allResources
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: ResourcesModel.resourcesList
		}
	)

	/**
	 * GET /resources/:id - Obtener un recurso por ID
	 */
	.get(
		'/:id',
		async ({ params }) => {
			try {
				const resource = await ResourcesService.getResourceById(Number(params.id))
				return resource
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: ResourcesModel.resourceResponse
		}
	)

	/**
	 * POST /resources - Crear un nuevo recurso
	 */
	.post(
		'/',
		async ({ body }) => {
			try {
				const newResource = await ResourcesService.createResource({
					name: body.name,
					description: body.description
				})
				return newResource
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: ResourcesModel.createBody,
			response: ResourcesModel.resourceResponse
		}
	)

	/**
	 * PUT /resources/:id - Actualizar un recurso
	 */
	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				const updatedResource = await ResourcesService.updateResource(
					Number(params.id),
					body
				)
				return updatedResource
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: ResourcesModel.updateBody,
			response: ResourcesModel.resourceResponse
		}
	)

	/**
	 * DELETE /resources/:id - Eliminar un recurso
	 */
	.delete(
		'/:id',
		async ({ params }) => {
			try {
				const deletedResource = await ResourcesService.deleteResource(Number(params.id))
				return {
					message: 'Recurso eliminado exitosamente',
					resource: deletedResource
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Object({
				message: t.String(),
				resource: ResourcesModel.resourceResponse
			})
		}
	)
	.compile()

