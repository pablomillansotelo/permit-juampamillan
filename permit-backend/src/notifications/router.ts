import { Elysia, t } from 'elysia'
import { NotificationsService } from './service.js'

export const notifications = new Elysia({ prefix: '/notifications' })
	.get(
		'/',
		async ({ query }) => {
			try {
				// En producción, obtener userId del token JWT o sesión
				// Por ahora, asumimos que viene en query (temporal)
				const userId = Number(query.userId)
				if (!userId) {
					throw new Error('userId es requerido')
				}

				return await NotificationsService.getUserNotifications(userId, {
					unreadOnly: query.unreadOnly === 'true',
					limit: query.limit ? Number(query.limit) : undefined,
				})
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				userId: t.String(),
				unreadOnly: t.Optional(t.String()),
				limit: t.Optional(t.String()),
			}),
			detail: {
				tags: ['notifications'],
				summary: 'Obtener notificaciones del usuario',
			},
		}
	)
	.get(
		'/unread-count',
		async ({ query }) => {
			try {
				const userId = Number(query.userId)
				if (!userId) {
					throw new Error('userId es requerido')
				}

				const count = await NotificationsService.getUnreadCount(userId)
				return { count }
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				userId: t.String(),
			}),
			detail: {
				tags: ['notifications'],
				summary: 'Obtener contador de notificaciones no leídas',
			},
		}
	)
	.put(
		'/:id/read',
		async ({ params, query }) => {
			try {
				const userId = Number(query.userId)
				if (!userId) {
					throw new Error('userId es requerido')
				}

				return await NotificationsService.markAsRead(Number(params.id), userId)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			query: t.Object({
				userId: t.String(),
			}),
			detail: {
				tags: ['notifications'],
				summary: 'Marcar notificación como leída',
			},
		}
	)
	.put(
		'/read-all',
		async ({ query }) => {
			try {
				const userId = Number(query.userId)
				if (!userId) {
					throw new Error('userId es requerido')
				}

				return await NotificationsService.markAllAsRead(userId)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				userId: t.String(),
			}),
			detail: {
				tags: ['notifications'],
				summary: 'Marcar todas las notificaciones como leídas',
			},
		}
	)
	.get(
		'/preferences',
		async ({ query }) => {
			try {
				const userId = Number(query.userId)
				if (!userId) {
					throw new Error('userId es requerido')
				}

				return await NotificationsService.getUserPreferences(userId)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				userId: t.String(),
			}),
			detail: {
				tags: ['notifications'],
				summary: 'Obtener preferencias de notificaciones',
			},
		}
	)
	.put(
		'/preferences',
		async ({ body, query }) => {
			try {
				const userId = Number(query.userId)
				if (!userId) {
					throw new Error('userId es requerido')
				}

				return await NotificationsService.updatePreference(userId, body)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			query: t.Object({
				userId: t.String(),
			}),
			body: t.Object({
				channel: t.String({ enum: ['email', 'in-app', 'push'] }),
				notificationType: t.String(),
				enabled: t.Boolean(),
			}),
			detail: {
				tags: ['notifications'],
				summary: 'Actualizar preferencias de notificaciones',
			},
		}
	)
	.post(
		'/',
		async ({ body }) => {
			try {
				return await NotificationsService.createNotification(body)
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: t.Object({
				userId: t.Number(),
				type: t.String(),
				title: t.String(),
				message: t.String(),
				data: t.Optional(t.Any()),
				actionUrl: t.Optional(t.String()),
			}),
			detail: {
				tags: ['notifications'],
				summary: 'Crear una nueva notificación (interno)',
			},
		}
	)

