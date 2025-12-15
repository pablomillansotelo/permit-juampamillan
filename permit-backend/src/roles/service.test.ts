import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { RolesService } from './service';
import { db } from '../db';
import { roles } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Tests unitarios para RolesService
 * 
 * Nota: Estos tests requieren una base de datos de prueba.
 * En producción, usar una base de datos de test separada.
 */
describe('RolesService', () => {
  let testRoleId: number | null = null;

  beforeEach(async () => {
    // Limpiar roles de test antes de cada test
    // En un entorno real, usar transacciones o base de datos de test
  });

  afterEach(async () => {
    // Limpiar después de cada test
    if (testRoleId) {
      try {
        await db.delete(roles).where(eq(roles.id, testRoleId));
      } catch (error) {
        // Ignorar errores de limpieza
      }
      testRoleId = null;
    }
  });

  describe('createRole', () => {
    it('debe crear un rol con nombre y descripción', async () => {
      const roleData = {
        name: `test-role-${Date.now()}`,
        description: 'Rol de prueba'
      };

      const role = await RolesService.createRole(roleData);
      testRoleId = role.id;

      expect(role).toBeDefined();
      expect(role.name).toBe(roleData.name);
      expect(role.description).toBe(roleData.description);
      expect(role.id).toBeGreaterThan(0);
    });

    it('debe crear un rol sin descripción', async () => {
      const roleData = {
        name: `test-role-${Date.now()}`
      };

      const role = await RolesService.createRole(roleData);
      testRoleId = role.id;

      expect(role).toBeDefined();
      expect(role.name).toBe(roleData.name);
      expect(role.description).toBeNull();
    });

    it('debe lanzar error si el nombre ya existe', async () => {
      const roleData = {
        name: `test-role-duplicate-${Date.now()}`
      };

      const role1 = await RolesService.createRole(roleData);
      testRoleId = role1.id;

      await expect(
        RolesService.createRole(roleData)
      ).rejects.toThrow('ya existe');
    });
  });

  describe('getRoleById', () => {
    it('debe obtener un rol por ID', async () => {
      const roleData = {
        name: `test-role-${Date.now()}`,
        description: 'Rol de prueba'
      };

      const createdRole = await RolesService.createRole(roleData);
      testRoleId = createdRole.id;

      const role = await RolesService.getRoleById(createdRole.id);

      expect(role).toBeDefined();
      expect(role.id).toBe(createdRole.id);
      expect(role.name).toBe(roleData.name);
    });

    it('debe lanzar error si el rol no existe', async () => {
      await expect(
        RolesService.getRoleById(999999)
      ).rejects.toThrow('no encontrado');
    });
  });

  describe('getAllRoles', () => {
    it('debe obtener todos los roles', async () => {
      const roles = await RolesService.getAllRoles();
      
      expect(Array.isArray(roles)).toBe(true);
      // Verificar que todos los roles tienen las propiedades esperadas
      if (roles.length > 0) {
        expect(roles[0]).toHaveProperty('id');
        expect(roles[0]).toHaveProperty('name');
      }
    });
  });

  describe('updateRole', () => {
    it('debe actualizar el nombre de un rol', async () => {
      const roleData = {
        name: `test-role-${Date.now()}`,
        description: 'Descripción original'
      };

      const createdRole = await RolesService.createRole(roleData);
      testRoleId = createdRole.id;

      const updatedRole = await RolesService.updateRole(createdRole.id, {
        name: 'rol-actualizado'
      });

      expect(updatedRole.name).toBe('rol-actualizado');
      expect(updatedRole.description).toBe(roleData.description);
    });

    it('debe actualizar la descripción de un rol', async () => {
      const roleData = {
        name: `test-role-${Date.now()}`,
        description: 'Descripción original'
      };

      const createdRole = await RolesService.createRole(roleData);
      testRoleId = createdRole.id;

      const updatedRole = await RolesService.updateRole(createdRole.id, {
        description: 'Nueva descripción'
      });

      expect(updatedRole.description).toBe('Nueva descripción');
    });

    it('debe lanzar error si el rol no existe', async () => {
      await expect(
        RolesService.updateRole(999999, { name: 'test' })
      ).rejects.toThrow('no encontrado');
    });
  });

  describe('deleteRole', () => {
    it('debe eliminar un rol', async () => {
      const roleData = {
        name: `test-role-${Date.now()}`
      };

      const createdRole = await RolesService.createRole(roleData);
      const roleId = createdRole.id;

      const deletedRole = await RolesService.deleteRole(roleId);

      expect(deletedRole.id).toBe(roleId);

      // Verificar que el rol fue eliminado
      await expect(
        RolesService.getRoleById(roleId)
      ).rejects.toThrow('no encontrado');
    });

    it('debe lanzar error si el rol no existe', async () => {
      await expect(
        RolesService.deleteRole(999999)
      ).rejects.toThrow('no encontrado');
    });
  });
});

