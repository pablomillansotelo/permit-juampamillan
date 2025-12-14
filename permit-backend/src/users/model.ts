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
		})
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
		}))
	}),

	// Esquema de respuesta de usuario
	userResponse: t.Object({
		id: t.Number({ description: 'ID del usuario' }),
		name: t.String({ description: 'Nombre del usuario' }),
		email: t.String({ description: 'Correo electrónico del usuario' }),
		createdAt: t.Date({ description: 'Fecha de creación' })
	}),

	// Esquema para lista de usuarios
	usersList: t.Array(
		t.Object({
			id: t.Number(),
			name: t.String(),
			email: t.String(),
			createdAt: t.Date()
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
