import { t } from 'elysia'

/**
 * Modelos de validación para las operaciones de departamentos
 */
export const DepartmentsModel = {
	// Esquema para crear un departamento
	createBody: t.Object({
		name: t.String({ 
			description: 'Nombre del departamento',
			minLength: 1,
			maxLength: 255 
		}),
		description: t.Optional(t.String({ description: 'Descripción del departamento' })),
		parentId: t.Optional(t.Number({ description: 'ID del departamento padre' })),
		managerId: t.Optional(t.Number({ description: 'ID del manager del departamento' })),
	}),

	// Esquema para actualizar un departamento
	updateBody: t.Object({
		name: t.Optional(t.String({ 
			description: 'Nombre del departamento',
			minLength: 1,
			maxLength: 255 
		})),
		description: t.Optional(t.String({ description: 'Descripción del departamento' })),
		parentId: t.Optional(t.Number({ description: 'ID del departamento padre' })),
		managerId: t.Optional(t.Number({ description: 'ID del manager del departamento' })),
	}),

	// Esquema de respuesta de departamento
	departmentResponse: t.Object({
		id: t.Number({ description: 'ID del departamento' }),
		name: t.String({ description: 'Nombre del departamento' }),
		description: t.Optional(t.String({ description: 'Descripción del departamento' })),
		parentId: t.Optional(t.Number({ description: 'ID del departamento padre' })),
		managerId: t.Optional(t.Number({ description: 'ID del manager' })),
		createdAt: t.Date({ description: 'Fecha de creación' }),
		updatedAt: t.Date({ description: 'Fecha de actualización' }),
	}),

	// Esquema para lista de departamentos
	departmentsList: t.Array(
		t.Object({
			id: t.Number(),
			name: t.String(),
			description: t.Optional(t.String()),
			parentId: t.Optional(t.Number()),
			managerId: t.Optional(t.Number()),
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

