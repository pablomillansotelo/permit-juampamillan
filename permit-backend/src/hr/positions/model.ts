import { t } from 'elysia'

/**
 * Modelos de validación para las operaciones de puestos
 */
export const PositionsModel = {
	// Esquema para crear un puesto
	createBody: t.Object({
		title: t.String({ 
			description: 'Título del puesto',
			minLength: 1,
			maxLength: 255 
		}),
		description: t.Optional(t.String({ description: 'Descripción del puesto' })),
		departmentId: t.Optional(t.Number({ description: 'ID del departamento' })),
		level: t.Optional(t.Number({ description: 'Nivel jerárquico' })),
	}),

	// Esquema para actualizar un puesto
	updateBody: t.Object({
		title: t.Optional(t.String({ 
			description: 'Título del puesto',
			minLength: 1,
			maxLength: 255 
		})),
		description: t.Optional(t.String({ description: 'Descripción del puesto' })),
		departmentId: t.Optional(t.Number({ description: 'ID del departamento' })),
		level: t.Optional(t.Number({ description: 'Nivel jerárquico' })),
	}),

	// Esquema de respuesta de puesto
	positionResponse: t.Object({
		id: t.Number({ description: 'ID del puesto' }),
		title: t.String({ description: 'Título del puesto' }),
		description: t.Optional(t.String({ description: 'Descripción del puesto' })),
		departmentId: t.Optional(t.Number({ description: 'ID del departamento' })),
		level: t.Optional(t.Number({ description: 'Nivel jerárquico' })),
		createdAt: t.Date({ description: 'Fecha de creación' }),
		updatedAt: t.Date({ description: 'Fecha de actualización' }),
	}),

	// Esquema para lista de puestos
	positionsList: t.Array(
		t.Object({
			id: t.Number(),
			title: t.String(),
			description: t.Optional(t.String()),
			departmentId: t.Optional(t.Number()),
			level: t.Optional(t.Number()),
			createdAt: t.Date(),
			updatedAt: t.Date(),
		})
	),

	// Esquema de error
	errorResponse: t.Object({
		error: t.String({ description: 'Mensaje de error' }),
		details: t.Optional(t.String({ description: 'Detalles del error' }))
	}),
}

