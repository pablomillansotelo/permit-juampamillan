import { t } from 'elysia'

/**
 * Modelos de validación para las operaciones de permisos
 */
export const PermissionsModel = {
	// Esquema para crear un permiso
	createBody: t.Object({
		name: t.String({ 
			description: 'Nombre del permiso',
			minLength: 1,
			maxLength: 255 
		}),
		action: t.String({ 
			description: 'Acción del permiso (read, write, delete, update, etc.)',
			minLength: 1,
			maxLength: 50 
		}),
		resourceId: t.Number({ 
			description: 'ID del recurso al que pertenece el permiso' 
		}),
		description: t.Optional(t.String({ 
			description: 'Descripción del permiso',
			maxLength: 500 
		}))
	}),

	// Esquema para actualizar un permiso
	updateBody: t.Object({
		name: t.Optional(t.String({ 
			description: 'Nombre del permiso',
			minLength: 1,
			maxLength: 255 
		})),
		action: t.Optional(t.String({ 
			description: 'Acción del permiso',
			minLength: 1,
			maxLength: 50 
		})),
		resourceId: t.Optional(t.Number({ 
			description: 'ID del recurso' 
		})),
		description: t.Optional(t.String({ 
			description: 'Descripción del permiso',
			maxLength: 500 
		}))
	}),

	// Esquema de respuesta de permiso
	permissionResponse: t.Object({
		id: t.Number({ description: 'ID del permiso' }),
		name: t.String({ description: 'Nombre del permiso' }),
		action: t.String({ description: 'Acción del permiso' }),
		resourceId: t.Number({ description: 'ID del recurso' }),
		resourceName: t.Nullable(t.String({ description: 'Nombre del recurso' })),
		description: t.Nullable(t.String({ description: 'Descripción del permiso' })),
		createdAt: t.Date({ description: 'Fecha de creación' }),
		updatedAt: t.Date({ description: 'Fecha de actualización' })
	}),

	// Esquema para lista de permisos
	permissionsList: t.Array(
		t.Object({
			id: t.Number(),
			name: t.String(),
			action: t.String(),
			resourceId: t.Number(),
			resourceName: t.Nullable(t.String()),
			description: t.Nullable(t.String()),
			createdAt: t.Date(),
			updatedAt: t.Date()
		})
	),

	// Esquema de error
	errorResponse: t.Object({
		error: t.String({ description: 'Mensaje de error' }),
		details: t.Optional(t.String({ description: 'Detalles del error' }))
	})
}

