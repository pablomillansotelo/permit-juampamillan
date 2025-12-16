import { Elysia, t } from 'elysia'
import { AuditService } from './service.js'

export const audit = new Elysia({ prefix: '/audit-logs' })
	.get(
		'/',
		async ({ query }) => {
			try {
				const filters = {
					userId: query.userId ? Number(query.userId) : undefined,
					action: query.action,
					entityType: query.entityType,
					entityId: query.entityId ? Number(query.entityId) : undefined,
					startDate: query.startDate,
					endDate: query.endDate,
					limit: query.limit ? Number(query.limit) : 100,
					offset: query.offset ? Number(query.offset) : 0,
				}

				const logs = await AuditService.getLogs(filters)
				const total = await AuditService.getLogsCount(filters)

				return {
					logs,
					pagination: {
						total,
						limit: filters.limit,
						offset: filters.offset,
						hasMore: (filters.offset || 0) + logs.length < total,
					},
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				userId: t.Optional(t.String()),
				action: t.Optional(t.String()),
				entityType: t.Optional(t.String()),
				entityId: t.Optional(t.String()),
				startDate: t.Optional(t.String()),
				endDate: t.Optional(t.String()),
				limit: t.Optional(t.String()),
				offset: t.Optional(t.String()),
			}),
			detail: {
				tags: ['audit'],
				summary: 'Listar logs de auditoría con filtros y paginación',
			},
		}
	)
	.get(
		'/entity/:type/:id',
		async ({ params, query }) => {
			try {
				const limit = query.limit ? Number(query.limit) : 50
				return await AuditService.getEntityLogs(params.type, Number(params.id), limit)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			params: t.Object({
				type: t.String(),
				id: t.Numeric(),
			}),
			query: t.Object({
				limit: t.Optional(t.String()),
			}),
			detail: {
				tags: ['audit'],
				summary: 'Obtener logs de una entidad específica',
			},
		}
	)
	.get(
		'/user/:userId',
		async ({ params, query }) => {
			try {
				const limit = query.limit ? Number(query.limit) : 100
				return await AuditService.getUserLogs(Number(params.userId), limit)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			params: t.Object({
				userId: t.Numeric(),
			}),
			query: t.Object({
				limit: t.Optional(t.String()),
			}),
			detail: {
				tags: ['audit'],
				summary: 'Obtener logs de un usuario específico',
			},
		}
	)

