import { t } from 'elysia'

/**
 * Modelos de validación para las operaciones de roles
 */
export const RolesModel = {
	// Esquema para crear un rol
	createBody: t.Object({
		name: t.String({ 
			description: 'Nombre del rol',
			minLength: 1,
			maxLength: 255 
		}),
		description: t.Optional(t.String({ 
			description: 'Descripción del rol',
			maxLength: 500 
		}))
	}),

	// Esquema para actualizar un rol
	updateBody: t.Object({
		name: t.Optional(t.String({ 
			description: 'Nombre del rol',
			minLength: 1,
			maxLength: 255 
		})),
		description: t.Optional(t.String({ 
			description: 'Descripción del rol',
			maxLength: 500 
		}))
	}),

	// Esquema de respuesta de rol
	roleResponse: t.Object({
		id: t.Number({ description: 'ID del rol' }),
		name: t.String({ description: 'Nombre del rol' }),
		description: t.Nullable(t.String({ description: 'Descripción del rol' })),
		createdAt: t.Date({ description: 'Fecha de creación' }),
		updatedAt: t.Date({ description: 'Fecha de actualización' })
	}),

	// Esquema para lista de roles
	rolesList: t.Array(
		t.Object({
			id: t.Number(),
			name: t.String(),
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

