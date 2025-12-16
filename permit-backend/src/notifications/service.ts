import { db } from '../db.js'
import { notifications, notificationPreferences, notificationTemplates } from './schema.js'
import { eq, and, desc, isNull, count } from 'drizzle-orm'

export interface CreateNotificationInput {
	userId: number
	type: string
	title: string
	message: string
	data?: any
	actionUrl?: string
}

export interface UpdateNotificationPreferenceInput {
	channel: 'email' | 'in-app' | 'push'
	notificationType: string
	enabled: boolean
}

/**
 * Servicio de Notificaciones
 */
export class NotificationsService {
	/**
	 * Crear una notificación
	 */
	static async createNotification(data: CreateNotificationInput) {
		try {
			// Verificar preferencias del usuario
			const preferences = await db
				.select()
				.from(notificationPreferences)
				.where(
					and(
						eq(notificationPreferences.userId, data.userId),
						eq(notificationPreferences.channel, 'in-app'),
						eq(notificationPreferences.notificationType, data.type)
					)
				)

			// Si el usuario tiene deshabilitadas las notificaciones de este tipo, no crear
			if (preferences.length > 0 && !preferences[0]!.enabled) {
				return null
			}

			const result = await db
				.insert(notifications)
				.values({
					userId: data.userId,
					type: data.type,
					title: data.title,
					message: data.message,
					data: data.data || {},
					actionUrl: data.actionUrl,
				})
				.returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al crear notificación: ${error.message || error}`)
		}
	}

	/**
	 * Crear notificaciones para múltiples usuarios
	 */
	static async createBulkNotifications(users: number[], data: Omit<CreateNotificationInput, 'userId'>) {
		try {
			const notificationsToInsert = users.map(userId => ({
				userId,
				type: data.type,
				title: data.title,
				message: data.message,
				data: data.data || {},
				actionUrl: data.actionUrl,
			}))

			const result = await db
				.insert(notifications)
				.values(notificationsToInsert)
				.returning()

			return result
		} catch (error: any) {
			throw new Error(`Error al crear notificaciones masivas: ${error.message || error}`)
		}
	}

	/**
	 * Obtener notificaciones de un usuario
	 */
	static async getUserNotifications(userId: number, filters?: { unreadOnly?: boolean; limit?: number }) {
		try {
			let query = db
				.select()
				.from(notifications)
				.where(eq(notifications.userId, userId))

			if (filters?.unreadOnly) {
				query = query.where(and(eq(notifications.userId, userId), isNull(notifications.readAt))) as any
			}

			const result = await query
				.orderBy(desc(notifications.createdAt))
				.limit(filters?.limit || 50)

			return result
		} catch (error: any) {
			throw new Error(`Error al obtener notificaciones: ${error.message || error}`)
		}
	}

	/**
	 * Marcar notificación como leída
	 */
	static async markAsRead(notificationId: number, userId: number) {
		try {
			const result = await db
				.update(notifications)
				.set({ readAt: new Date() })
				.where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
				.returning()

			if (result.length === 0) {
				throw new Error('Notificación no encontrada o no pertenece al usuario')
			}

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al marcar notificación como leída: ${error.message || error}`)
		}
	}

	/**
	 * Marcar todas las notificaciones como leídas
	 */
	static async markAllAsRead(userId: number) {
		try {
			await db
				.update(notifications)
				.set({ readAt: new Date() })
				.where(and(eq(notifications.userId, userId), isNull(notifications.readAt)))

			return { message: 'Todas las notificaciones marcadas como leídas' }
		} catch (error: any) {
			throw new Error(`Error al marcar todas como leídas: ${error.message || error}`)
		}
	}

	/**
	 * Obtener contador de notificaciones no leídas
	 */
	static async getUnreadCount(userId: number) {
		try {
			const result = await db
				.select({ count: count() })
				.from(notifications)
				.where(and(eq(notifications.userId, userId), isNull(notifications.readAt)))

			return result[0]?.count || 0
		} catch (error: any) {
			throw new Error(`Error al obtener contador: ${error.message || error}`)
		}
	}

	/**
	 * Obtener preferencias de notificaciones de un usuario
	 */
	static async getUserPreferences(userId: number) {
		try {
			return await db
				.select()
				.from(notificationPreferences)
				.where(eq(notificationPreferences.userId, userId))
		} catch (error: any) {
			throw new Error(`Error al obtener preferencias: ${error.message || error}`)
		}
	}

	/**
	 * Actualizar preferencias de notificaciones
	 */
	static async updatePreference(userId: number, data: UpdateNotificationPreferenceInput) {
		try {
			// Buscar preferencia existente
			const existing = await db
				.select()
				.from(notificationPreferences)
				.where(
					and(
						eq(notificationPreferences.userId, userId),
						eq(notificationPreferences.channel, data.channel),
						eq(notificationPreferences.notificationType, data.notificationType)
					)
				)

			if (existing.length > 0) {
				// Actualizar existente
				const result = await db
					.update(notificationPreferences)
					.set({ enabled: data.enabled, updatedAt: new Date() })
					.where(eq(notificationPreferences.id, existing[0]!.id))
					.returning()

				return result[0]!
			} else {
				// Crear nueva preferencia
				const result = await db
					.insert(notificationPreferences)
					.values({
						userId,
						channel: data.channel,
						notificationType: data.notificationType,
						enabled: data.enabled,
						updatedAt: new Date(),
					})
					.returning()

				return result[0]!
			}
		} catch (error: any) {
			throw new Error(`Error al actualizar preferencia: ${error.message || error}`)
		}
	}

	/**
	 * Obtener plantilla de notificación
	 */
	static async getTemplate(type: string) {
		try {
			const result = await db
				.select()
				.from(notificationTemplates)
				.where(eq(notificationTemplates.type, type))

			return result[0] || null
		} catch (error: any) {
			throw new Error(`Error al obtener plantilla: ${error.message || error}`)
		}
	}

	/**
	 * Crear notificación usando plantilla
	 */
	static async createNotificationFromTemplate(
		userId: number,
		templateType: string,
		variables: Record<string, any>,
		actionUrl?: string
	) {
		try {
			const template = await this.getTemplate(templateType)
			if (!template) {
				throw new Error(`Plantilla ${templateType} no encontrada`)
			}

			// Reemplazar variables en el mensaje
			let message = template.body
			if (template.variables && typeof template.variables === 'object') {
				for (const [key, value] of Object.entries(variables)) {
					message = message.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
				}
			}

			let title = template.subject || templateType
			if (template.variables && typeof template.variables === 'object') {
				for (const [key, value] of Object.entries(variables)) {
					title = title.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
				}
			}

			return await this.createNotification({
				userId,
				type: templateType,
				title,
				message,
				data: variables,
				actionUrl,
			})
		} catch (error: any) {
			throw new Error(`Error al crear notificación desde plantilla: ${error.message || error}`)
		}
	}
}

