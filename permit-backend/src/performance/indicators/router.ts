import { Elysia, t } from 'elysia'
import { IndicatorsService } from './service.js'

export const indicators = new Elysia({ prefix: '/indicators' })
	.get(
		'/',
		async ({ query }) => {
			try {
				const activeOnly = query.activeOnly === 'true'
				return await IndicatorsService.getAllIndicators(activeOnly)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				activeOnly: t.Optional(t.String()),
			}),
			detail: {
				tags: ['performance'],
				summary: 'Listar todos los indicadores de performance',
			},
		}
	)
	.get(
		'/:id',
		async ({ params }) => {
			try {
				return await IndicatorsService.getIndicatorById(Number(params.id))
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			detail: {
				tags: ['performance'],
				summary: 'Obtener un indicador por ID',
			},
		}
	)
	.post(
		'/',
		async ({ body }) => {
			try {
				return await IndicatorsService.createIndicator({
					name: body.name,
					description: body.description,
					type: body.type as 'numeric' | 'percentage' | 'boolean' | 'text',
					unit: body.unit,
					targetValue: body.targetValue,
					weight: body.weight,
					category: body.category,
					isActive: body.isActive,
				})
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: t.Object({
				name: t.String({ minLength: 1 }),
				description: t.Optional(t.String()),
				type: t.String({ enum: ['numeric', 'percentage', 'boolean', 'text'] }),
				unit: t.Optional(t.String()),
				targetValue: t.Optional(t.Number()),
				weight: t.Optional(t.Number()),
				category: t.Optional(t.String()),
				isActive: t.Optional(t.Boolean()),
			}),
			detail: {
				tags: ['performance'],
				summary: 'Crear un nuevo indicador',
			},
		}
	)
	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				return await IndicatorsService.updateIndicator(Number(params.id), {
					name: body.name,
					description: body.description,
					type: body.type as 'numeric' | 'percentage' | 'boolean' | 'text' | undefined,
					unit: body.unit,
					targetValue: body.targetValue,
					weight: body.weight,
					category: body.category,
					isActive: body.isActive,
				})
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			body: t.Object({
				name: t.Optional(t.String({ minLength: 1 })),
				description: t.Optional(t.String()),
				type: t.Optional(t.String({ enum: ['numeric', 'percentage', 'boolean', 'text'] })),
				unit: t.Optional(t.String()),
				targetValue: t.Optional(t.Number()),
				weight: t.Optional(t.Number()),
				category: t.Optional(t.String()),
				isActive: t.Optional(t.Boolean()),
			}),
			detail: {
				tags: ['performance'],
				summary: 'Actualizar un indicador',
			},
		}
	)
	.delete(
		'/:id',
		async ({ params }) => {
			try {
				return await IndicatorsService.deleteIndicator(Number(params.id))
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			detail: {
				tags: ['performance'],
				summary: 'Eliminar un indicador (soft delete)',
			},
		}
	)

