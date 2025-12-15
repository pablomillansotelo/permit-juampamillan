'server-only';

import { usersApi } from './api-server';
import type { CreateUserInput } from './api';

/**
 * Sincroniza un usuario de NextAuth con el backend
 * - Si el usuario no existe, lo crea
 * - Si el usuario existe, lo actualiza con la información más reciente
 * 
 * @param email - Email del usuario (usado como identificador único)
 * @param name - Nombre del usuario
 * @returns El usuario sincronizado o null si hay error
 */
export async function syncUser(
  email: string,
  name?: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar usuario por email
    const allUsers = await usersApi.getAll();
    const existingUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      // Usuario existe, actualizar si hay cambios
      if (name && name !== existingUser.name) {
        await usersApi.update(existingUser.id, { name });
      }
    } else {
      // Usuario no existe, crearlo
      const createData: CreateUserInput = {
        email,
        name: name || email.split('@')[0], // Usar parte antes del @ como nombre por defecto
      };
      await usersApi.create(createData);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error al sincronizar usuario:', error);
    // No lanzar error para no bloquear el login
    return {
      success: false,
      error: error.message || 'Error al sincronizar usuario con el backend',
    };
  }
}

