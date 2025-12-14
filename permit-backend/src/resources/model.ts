import { t } from 'elysia'

/**
 * Modelos de validación para las operaciones de recursos
 */
export const ResourcesModel = {
	// Esquema para crear un recurso
	createBody: t.Object({
		name: t.String({ 
			description: 'Nombre del recurso',
			minLength: 1,
			maxLength: 255 
		}),
		description: t.Optional(t.String({ 
			description: 'Descripción del recurso',
			maxLength: 500 
		}))
	}),

	// Esquema para actualizar un recurso
	updateBody: t.Object({
		name: t.Optional(t.String({ 
			description: 'Nombre del recurso',
			minLength: 1,
			maxLength: 255 
		})),
		description: t.Optional(t.String({ 
			description: 'Descripción del recurso',
			maxLength: 500 
		}))
	}),

	// Esquema de respuesta de recurso
	resourceResponse: t.Object({
		id: t.Number({ description: 'ID del recurso' }),
		name: t.String({ description: 'Nombre del recurso' }),
		description: t.Nullable(t.String({ description: 'Descripción del recurso' })),
		createdAt: t.Date({ description: 'Fecha de creación' }),
		updatedAt: t.Date({ description: 'Fecha de actualización' })
	}),

	// Esquema para lista de recursos
	resourcesList: t.Array(
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

