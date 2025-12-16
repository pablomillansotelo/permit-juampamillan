import { Elysia, t } from 'elysia'
import { EvaluationsService } from './service.js'

export const evaluations = new Elysia({ prefix: '/evaluations' })
	.get(
		'/',
		async ({ query }) => {
			try {
				return await EvaluationsService.getAllEvaluations({
					userId: query.userId ? Number(query.userId) : undefined,
					evaluatorId: query.evaluatorId ? Number(query.evaluatorId) : undefined,
					status: query.status,
					periodType: query.periodType,
				})
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				userId: t.Optional(t.String()),
				evaluatorId: t.Optional(t.String()),
				status: t.Optional(t.String()),
				periodType: t.Optional(t.String()),
			}),
			detail: {
				tags: ['performance'],
				summary: 'Listar todas las evaluaciones',
			},
		}
	)
	.get(
		'/:id',
		async ({ params }) => {
			try {
				return await EvaluationsService.getEvaluationById(Number(params.id))
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
				summary: 'Obtener una evaluación por ID',
			},
		}
	)
	.get(
		'/user/:userId/summary',
		async ({ params, query }) => {
			try {
				return await EvaluationsService.getUserPerformanceSummary(
					Number(params.userId),
					query.periodType
				)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			params: t.Object({
				userId: t.Numeric(),
			}),
			query: t.Object({
				periodType: t.Optional(t.String()),
			}),
			detail: {
				tags: ['performance'],
				summary: 'Obtener resumen de performance de un usuario',
			},
		}
	)
	.post(
		'/',
		async ({ body }) => {
			try {
				return await EvaluationsService.createEvaluation(body)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: t.Object({
				userId: t.Number(),
				evaluatorId: t.Number(),
				periodType: t.String({ enum: ['monthly', 'quarterly', 'annual'] }),
				periodStart: t.String({ format: 'date' }),
				periodEnd: t.String({ format: 'date' }),
				comments: t.Optional(t.String()),
				scores: t.Optional(t.Array(t.Object({
					indicatorId: t.Number(),
					value: t.Number(),
					targetValue: t.Optional(t.Number()),
					notes: t.Optional(t.String()),
				}))),
			}),
			detail: {
				tags: ['performance'],
				summary: 'Crear una nueva evaluación',
			},
		}
	)
	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				return await EvaluationsService.updateEvaluation(Number(params.id), body)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			body: t.Object({
				status: t.Optional(t.String({ enum: ['draft', 'submitted', 'reviewed', 'finalized'] })),
				overallScore: t.Optional(t.Number()),
				comments: t.Optional(t.String()),
				scores: t.Optional(t.Array(t.Object({
					indicatorId: t.Number(),
					value: t.Number(),
					targetValue: t.Optional(t.Number()),
					notes: t.Optional(t.String()),
				}))),
			}),
			detail: {
				tags: ['performance'],
				summary: 'Actualizar una evaluación',
			},
		}
	)
	.post(
		'/:id/submit',
		async ({ params }) => {
			try {
				return await EvaluationsService.submitEvaluation(Number(params.id))
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
				summary: 'Enviar evaluación para revisión',
			},
		}
	)
	.post(
		'/:id/finalize',
		async ({ params }) => {
			try {
				return await EvaluationsService.finalizeEvaluation(Number(params.id))
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
				summary: 'Finalizar evaluación',
			},
		}
	)

