import { t } from 'elysia'

/**
 * Modelos de validación para las operaciones de usuarios
 */
export const UsersModel = {
	// Esquema para crear un usuario
	createBody: t.Object({
		name: t.String({ 
			description: 'Nombre del usuario',
			minLength: 1,
			maxLength: 255 
		}),
		email: t.String({ 
			description: 'Correo electrónico del usuario',
			format: 'email'
		}),
		// Campos HR opcionales
		employeeId: t.Optional(t.String({ description: 'ID de empleado' })),
		hireDate: t.Optional(t.String({ format: 'date', description: 'Fecha de ingreso' })),
		positionId: t.Optional(t.Number({ description: 'ID del puesto' })),
		departmentId: t.Optional(t.Number({ description: 'ID del departamento' })),
		managerId: t.Optional(t.Number({ description: 'ID del jefe directo' })),
		employmentType: t.Optional(t.String({ description: 'Tipo de contrato' })),
		status: t.Optional(t.String({ description: 'Estado del empleado' })),
		phone: t.Optional(t.String({ description: 'Teléfono' })),
		address: t.Optional(t.String({ description: 'Dirección' })),
		birthDate: t.Optional(t.String({ format: 'date', description: 'Fecha de nacimiento' })),
		emergencyContact: t.Optional(t.Any({ description: 'Contacto de emergencia (JSON)' })),
		salary: t.Optional(t.Number({ description: 'Salario' })),
	}),

	// Esquema para actualizar un usuario
	updateBody: t.Object({
		name: t.Optional(t.String({ 
			description: 'Nombre del usuario',
			minLength: 1,
			maxLength: 255 
		})),
		email: t.Optional(t.String({ 
			description: 'Correo electrónico del usuario',
			format: 'email'
		})),
		// Campos HR opcionales
		employeeId: t.Optional(t.String({ description: 'ID de empleado' })),
		hireDate: t.Optional(t.String({ format: 'date', description: 'Fecha de ingreso' })),
		positionId: t.Optional(t.Number({ description: 'ID del puesto' })),
		departmentId: t.Optional(t.Number({ description: 'ID del departamento' })),
		managerId: t.Optional(t.Number({ description: 'ID del jefe directo' })),
		employmentType: t.Optional(t.String({ description: 'Tipo de contrato' })),
		status: t.Optional(t.String({ description: 'Estado del empleado' })),
		phone: t.Optional(t.String({ description: 'Teléfono' })),
		address: t.Optional(t.String({ description: 'Dirección' })),
		birthDate: t.Optional(t.String({ format: 'date', description: 'Fecha de nacimiento' })),
		emergencyContact: t.Optional(t.Any({ description: 'Contacto de emergencia (JSON)' })),
		salary: t.Optional(t.Number({ description: 'Salario' })),
	}),

	// Esquema de respuesta de usuario
	userResponse: t.Object({
		id: t.Number({ description: 'ID del usuario' }),
		name: t.String({ description: 'Nombre del usuario' }),
		email: t.String({ description: 'Correo electrónico del usuario' }),
		createdAt: t.Union([t.Date(), t.String({ format: 'date-time' })], { description: 'Fecha de creación' }),
		employeeId: t.Optional(t.String({ description: 'ID de empleado' })),
		hireDate: t.Optional(t.Union([t.Date(), t.String({ format: 'date' })], { description: 'Fecha de ingreso' })),
		positionId: t.Optional(t.Number({ description: 'ID del puesto' })),
		departmentId: t.Optional(t.Number({ description: 'ID del departamento' })),
		managerId: t.Optional(t.Number({ description: 'ID del jefe directo' })),
		employmentType: t.Optional(t.String({ description: 'Tipo de contrato' })),
		status: t.Optional(t.String({ description: 'Estado del empleado' })),
		phone: t.Optional(t.String({ description: 'Teléfono' })),
		address: t.Optional(t.String({ description: 'Dirección' })),
		birthDate: t.Optional(t.Union([t.Date(), t.String({ format: 'date' })], { description: 'Fecha de nacimiento' })),
		emergencyContact: t.Optional(t.Any({ description: 'Contacto de emergencia' })),
		salary: t.Optional(t.Union([t.Number(), t.String()], { description: 'Salario' })),
		updatedAt: t.Optional(t.Union([t.Date(), t.String({ format: 'date-time' })], { description: 'Fecha de actualización' })),
	}),

	// Esquema para lista de usuarios
	usersList: t.Array(
		t.Object({
			id: t.Number(),
			name: t.String(),
			email: t.String(),
			createdAt: t.Union([t.Date(), t.String({ format: 'date-time' })]),
			employeeId: t.Optional(t.String()),
			hireDate: t.Optional(t.Union([t.Date(), t.String({ format: 'date' })])),
			positionId: t.Optional(t.Number()),
			departmentId: t.Optional(t.Number()),
			managerId: t.Optional(t.Number()),
			employmentType: t.Optional(t.String()),
			status: t.Optional(t.String()),
			phone: t.Optional(t.String()),
			address: t.Optional(t.String()),
			birthDate: t.Optional(t.Union([t.Date(), t.String({ format: 'date' })])),
			emergencyContact: t.Optional(t.Any()),
			salary: t.Optional(t.Union([t.Number(), t.String()])),
			updatedAt: t.Optional(t.Union([t.Date(), t.String({ format: 'date-time' })])),
		})
	),

	// Esquema de error
	errorResponse: t.Object({
		error: t.String({ description: 'Mensaje de error' }),
		details: t.Optional(t.String({ description: 'Detalles del error' }))
	}),

	// Esquema para sign-in
	signInBody: t.Object({
		email: t.String({ format: 'email' }),
		password: t.String()
	}),

	signInResponse: t.Object({
		token: t.String(),
		user: t.Object({
			id: t.Number(),
			name: t.String(),
			email: t.String()
		})
	}),

	signInInvalid: t.Object({
		error: t.String()
	})
}
