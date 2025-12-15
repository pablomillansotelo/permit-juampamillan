import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { UsersService } from './service';
import { db } from '../db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Tests unitarios para UsersService
 */
describe('UsersService', () => {
  let testUserId: number | null = null;

  afterEach(async () => {
    if (testUserId) {
      try {
        await db.delete(users).where(eq(users.id, testUserId));
      } catch (error) {
        // Ignorar errores de limpieza
      }
      testUserId = null;
    }
  });

  describe('createUser', () => {
    it('debe crear un usuario con nombre y email', async () => {
      const userData = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`
      };

      const user = await UsersService.createUser(userData);
      testUserId = user.id;

      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.id).toBeGreaterThan(0);
    });

    it('debe lanzar error si el email ya existe', async () => {
      const email = `test-duplicate-${Date.now()}@example.com`;
      const userData = {
        name: 'Test User',
        email
      };

      const user1 = await UsersService.createUser(userData);
      testUserId = user1.id;

      await expect(
        UsersService.createUser(userData)
      ).rejects.toThrow('ya existe');
    });
  });

  describe('getUserById', () => {
    it('debe obtener un usuario por ID', async () => {
      const userData = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`
      };

      const createdUser = await UsersService.createUser(userData);
      testUserId = createdUser.id;

      const user = await UsersService.getUserById(createdUser.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(createdUser.id);
      expect(user.email).toBe(userData.email);
    });

    it('debe lanzar error si el usuario no existe', async () => {
      await expect(
        UsersService.getUserById(999999)
      ).rejects.toThrow('no encontrado');
    });
  });

  describe('getAllUsers', () => {
    it('debe obtener todos los usuarios', async () => {
      const allUsers = await UsersService.getAllUsers();
      
      expect(Array.isArray(allUsers)).toBe(true);
      if (allUsers.length > 0) {
        expect(allUsers[0]).toHaveProperty('id');
        expect(allUsers[0]).toHaveProperty('name');
        expect(allUsers[0]).toHaveProperty('email');
      }
    });
  });

  describe('updateUser', () => {
    it('debe actualizar el nombre de un usuario', async () => {
      const userData = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`
      };

      const createdUser = await UsersService.createUser(userData);
      testUserId = createdUser.id;

      const updatedUser = await UsersService.updateUser(createdUser.id, {
        name: 'Usuario Actualizado'
      });

      expect(updatedUser.name).toBe('Usuario Actualizado');
      expect(updatedUser.email).toBe(userData.email);
    });

    it('debe lanzar error si el usuario no existe', async () => {
      await expect(
        UsersService.updateUser(999999, { name: 'test' })
      ).rejects.toThrow('no encontrado');
    });
  });

  describe('deleteUser', () => {
    it('debe eliminar un usuario', async () => {
      const userData = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`
      };

      const createdUser = await UsersService.createUser(userData);
      const userId = createdUser.id;

      const deletedUser = await UsersService.deleteUser(userId);

      expect(deletedUser.id).toBe(userId);

      // Verificar que el usuario fue eliminado
      await expect(
        UsersService.getUserById(userId)
      ).rejects.toThrow('no encontrado');
    });
  });
});

