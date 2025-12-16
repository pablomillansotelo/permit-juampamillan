import { Elysia, t } from 'elysia'
import { PositionsService } from './service.js'
import { PositionsModel } from './model.js'

export const positionsRouter = new Elysia({ prefix: '/positions' })
	/**
	 * GET /positions - Obtener todos los puestos
	 */
	.get(
		'/',
		async () => {
			try {
				const allPositions = await PositionsService.getAllPositions()
				return allPositions
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: PositionsModel.positionsList,
			detail: {
				tags: ['positions'],
				summary: 'Obtener todos los puestos',
			},
		}
	)

	/**
	 * GET /positions/:id - Obtener un puesto por ID
	 */
	.get(
		'/:id',
		async ({ params }) => {
			try {
				const position = await PositionsService.getPositionById(Number(params.id))
				return position
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: PositionsModel.positionResponse,
			detail: {
				tags: ['positions'],
				summary: 'Obtener un puesto por ID',
			},
		}
	)

	/**
	 * POST /positions - Crear un nuevo puesto
	 */
	.post(
		'/',
		async ({ body }) => {
			try {
				const newPosition = await PositionsService.createPosition({
					title: body.title,
					description: body.description,
					departmentId: body.departmentId,
					level: body.level,
				})
				return newPosition
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: PositionsModel.createBody,
			response: PositionsModel.positionResponse,
			detail: {
				tags: ['positions'],
				summary: 'Crear un nuevo puesto',
			},
		}
	)

	/**
	 * PUT /positions/:id - Actualizar un puesto
	 */
	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				const updatedPosition = await PositionsService.updatePosition(
					Number(params.id),
					body
				)
				return updatedPosition
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: PositionsModel.updateBody,
			response: PositionsModel.positionResponse,
			detail: {
				tags: ['positions'],
				summary: 'Actualizar un puesto',
			},
		}
	)

	/**
	 * DELETE /positions/:id - Eliminar un puesto
	 */
	.delete(
		'/:id',
		async ({ params }) => {
			try {
				const deletedPosition = await PositionsService.deletePosition(Number(params.id))
				return {
					message: 'Puesto eliminado exitosamente',
					position: deletedPosition
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Object({
				message: t.String(),
				position: PositionsModel.positionResponse
			}),
			detail: {
				tags: ['positions'],
				summary: 'Eliminar un puesto',
			},
		}
	)
	.compile()

