/**
 * Script de seed para cargar datos iniciales en la base de datos
 * Ejecutar con: bun run src/seed.ts
 * 
 * Este script carga datos de ejemplo que tienen sentido de negocio:
 * - Departamentos organizacionales
 * - Puestos de trabajo
 * - Usuarios con estructura jerárquica
 * - Roles y permisos básicos
 * - Tipos de ausencia
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient, { schema });

async function seed() {
  console.log('🌱 Iniciando seed de datos...');

  try {
    // 1. Crear Departamentos (idempotente)
    console.log('📦 Creando departamentos...');
    const [techDept] = await db.insert(schema.departments).values({
      name: 'Tecnología',
      description: 'Departamento de Tecnología e Innovación',
    }).onConflictDoNothing().returning();

    const [hrDept] = await db.insert(schema.departments).values({
      name: 'Recursos Humanos',
      description: 'Departamento de Recursos Humanos',
    }).onConflictDoNothing().returning();

    const [salesDept] = await db.insert(schema.departments).values({
      name: 'Ventas',
      description: 'Departamento de Ventas y Marketing',
    }).onConflictDoNothing().returning();

    const [financeDept] = await db.insert(schema.departments).values({
      name: 'Finanzas',
      description: 'Departamento de Finanzas y Contabilidad',
    }).onConflictDoNothing().returning();
    
    // Obtener departamentos existentes si no se crearon
    const existingDepts = await db.select().from(schema.departments);
    const techDeptFinal = techDept || existingDepts.find(d => d.name === 'Tecnología')!;
    const hrDeptFinal = hrDept || existingDepts.find(d => d.name === 'Recursos Humanos')!;
    const salesDeptFinal = salesDept || existingDepts.find(d => d.name === 'Ventas')!;
    const financeDeptFinal = financeDept || existingDepts.find(d => d.name === 'Finanzas')!;

    // 2. Crear Puestos (idempotente)
    console.log('📦 Creando puestos...');
    const [ceoPosition] = await db.insert(schema.positions).values({
      title: 'CEO',
      description: 'Chief Executive Officer',
      departmentId: null, // CEO no pertenece a un departamento específico
      level: 1,
    }).onConflictDoNothing().returning();

    const [ctoPosition] = await db.insert(schema.positions).values({
      title: 'CTO',
      description: 'Chief Technology Officer',
      departmentId: techDeptFinal.id,
      level: 2,
    }).onConflictDoNothing().returning();

    const [hrManagerPosition] = await db.insert(schema.positions).values({
      title: 'Gerente de RH',
      description: 'Gerente de Recursos Humanos',
      departmentId: hrDeptFinal.id,
      level: 3,
    }).onConflictDoNothing().returning();

    const [seniorDevPosition] = await db.insert(schema.positions).values({
      title: 'Desarrollador Senior',
      description: 'Desarrollador de Software Senior',
      departmentId: techDeptFinal.id,
      level: 4,
    }).onConflictDoNothing().returning();

    const [devPosition] = await db.insert(schema.positions).values({
      title: 'Desarrollador',
      description: 'Desarrollador de Software',
      departmentId: techDeptFinal.id,
      level: 5,
    }).onConflictDoNothing().returning();

    const [hrSpecialistPosition] = await db.insert(schema.positions).values({
      title: 'Especialista de RH',
      description: 'Especialista en Recursos Humanos',
      departmentId: hrDeptFinal.id,
      level: 4,
    }).onConflictDoNothing().returning();
    
    // Obtener puestos existentes si no se crearon
    const existingPositions = await db.select().from(schema.positions);
    const ceoPositionFinal = ceoPosition || existingPositions.find(p => p.title === 'CEO')!;
    const ctoPositionFinal = ctoPosition || existingPositions.find(p => p.title === 'CTO')!;
    const hrManagerPositionFinal = hrManagerPosition || existingPositions.find(p => p.title === 'Gerente de RH')!;
    const seniorDevPositionFinal = seniorDevPosition || existingPositions.find(p => p.title === 'Desarrollador Senior')!;
    const devPositionFinal = devPosition || existingPositions.find(p => p.title === 'Desarrollador')!;
    const hrSpecialistPositionFinal = hrSpecialistPosition || existingPositions.find(p => p.title === 'Especialista de RH')!;

    // 3. Crear Roles RBAC (idempotente)
    console.log('📦 Creando roles...');
    const [adminRole] = await db.insert(schema.roles).values({
      name: 'admin',
      description: 'Administrador del sistema con acceso completo',
    }).onConflictDoNothing().returning();

    const [managerRole] = await db.insert(schema.roles).values({
      name: 'manager',
      description: 'Manager con permisos de gestión de equipo',
    }).onConflictDoNothing().returning();

    const [employeeRole] = await db.insert(schema.roles).values({
      name: 'employee',
      description: 'Empleado con permisos básicos',
    }).onConflictDoNothing().returning();
    
    // Obtener roles existentes si no se crearon
    const existingRoles = await db.select().from(schema.roles);
    const adminRoleFinal = adminRole || existingRoles.find(r => r.name === 'admin')!;
    const managerRoleFinal = managerRole || existingRoles.find(r => r.name === 'manager')!;
    const employeeRoleFinal = employeeRole || existingRoles.find(r => r.name === 'employee')!;

    // 4. Crear Recursos (idempotente)
    console.log('📦 Creando recursos...');
    const [usersResource] = await db.insert(schema.resources).values({
      name: 'users',
      description: 'Gestión de usuarios',
    }).onConflictDoNothing().returning();

    const [rolesResource] = await db.insert(schema.resources).values({
      name: 'roles',
      description: 'Gestión de roles',
    }).onConflictDoNothing().returning();

    const [absencesResource] = await db.insert(schema.resources).values({
      name: 'absences',
      description: 'Gestión de ausentismos',
    }).onConflictDoNothing().returning();

    const [performanceResource] = await db.insert(schema.resources).values({
      name: 'performance',
      description: 'Gestión de performance',
    }).onConflictDoNothing().returning();
    
    // Obtener recursos existentes si no se crearon
    const existingResources = await db.select().from(schema.resources);
    const usersResourceFinal = usersResource || existingResources.find(r => r.name === 'users')!;
    const rolesResourceFinal = rolesResource || existingResources.find(r => r.name === 'roles')!;
    const absencesResourceFinal = absencesResource || existingResources.find(r => r.name === 'absences')!;
    const performanceResourceFinal = performanceResource || existingResources.find(r => r.name === 'performance')!;

    // 5. Crear Permisos (idempotente)
    console.log('📦 Creando permisos...');
    const permissions = await db.insert(schema.permissions).values([
      { name: 'Ver usuarios', action: 'read', resourceId: usersResourceFinal.id },
      { name: 'Crear usuarios', action: 'create', resourceId: usersResourceFinal.id },
      { name: 'Editar usuarios', action: 'update', resourceId: usersResourceFinal.id },
      { name: 'Eliminar usuarios', action: 'delete', resourceId: usersResourceFinal.id },
      { name: 'Gestionar usuarios', action: 'manage', resourceId: usersResourceFinal.id },
      { name: 'Ver roles', action: 'read', resourceId: rolesResourceFinal.id },
      { name: 'Gestionar roles', action: 'manage', resourceId: rolesResourceFinal.id },
      { name: 'Ver ausentismos', action: 'read', resourceId: absencesResourceFinal.id },
      { name: 'Gestionar ausentismos', action: 'manage', resourceId: absencesResourceFinal.id },
      { name: 'Ver performance', action: 'read', resourceId: performanceResourceFinal.id },
      { name: 'Gestionar performance', action: 'manage', resourceId: performanceResourceFinal.id },
    ]).onConflictDoNothing().returning();
    
    // Obtener permisos existentes si no se crearon
    const existingPermissions = await db.select().from(schema.permissions);
    const permissionsFinal = permissions.length > 0 ? permissions : existingPermissions;

    // 6. Asignar permisos a roles (idempotente)
    console.log('📦 Asignando permisos a roles...');
    // Admin tiene todos los permisos
    for (const perm of permissionsFinal) {
      await db.insert(schema.rolePermissions).values({
        roleId: adminRoleFinal.id,
        permissionId: perm.id,
      }).onConflictDoNothing();
    }

    // Manager tiene permisos de lectura y gestión de ausentismos
    // Verificar que los permisos existen antes de usarlos
    if (permissionsFinal.length >= 10) {
      await db.insert(schema.rolePermissions).values([
        { roleId: managerRoleFinal.id, permissionId: permissionsFinal[0]!.id }, // Ver usuarios
        { roleId: managerRoleFinal.id, permissionId: permissionsFinal[6]!.id }, // Ver roles
        { roleId: managerRoleFinal.id, permissionId: permissionsFinal[7]!.id }, // Ver ausentismos
        { roleId: managerRoleFinal.id, permissionId: permissionsFinal[8]!.id }, // Gestionar ausentismos
        { roleId: managerRoleFinal.id, permissionId: permissionsFinal[9]!.id }, // Ver performance
      ]).onConflictDoNothing();
    }

    // Employee tiene permisos básicos
    if (permissionsFinal.length >= 8) {
      await db.insert(schema.rolePermissions).values([
        { roleId: employeeRoleFinal.id, permissionId: permissionsFinal[0]!.id }, // Ver usuarios
        { roleId: employeeRoleFinal.id, permissionId: permissionsFinal[7]!.id }, // Ver ausentismos
      ]).onConflictDoNothing();
    }

    // 7. Crear Usuarios con estructura jerárquica (idempotente)
    console.log('📦 Creando usuarios...');
    
    // CEO (sin manager)
    const [ceo] = await db.insert(schema.users).values({
      name: 'María González',
      email: 'maria.gonzalez@empresa.com',
      employeeId: 'EMP001',
      hireDate: '2020-01-15',
      positionId: ceoPositionFinal.id,
      departmentId: null,
      managerId: null,
      employmentType: 'full-time',
      status: 'active',
      phone: '+34 600 000 001',
      address: 'Madrid, España',
    }).onConflictDoNothing().returning();

    // Obtener CEO existente si no se creó
    const existingUsers = await db.select().from(schema.users);
    const ceoFinal = ceo || existingUsers.find(u => u.email === 'maria.gonzalez@empresa.com')!;

    // CTO (reporta a CEO)
    const [cto] = await db.insert(schema.users).values({
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
      employeeId: 'EMP002',
      hireDate: '2020-03-01',
      positionId: ctoPositionFinal.id,
      departmentId: techDeptFinal.id,
      managerId: ceoFinal.id,
      employmentType: 'full-time',
      status: 'active',
      phone: '+34 600 000 002',
    }).onConflictDoNothing().returning();

    // HR Manager (reporta a CEO)
    const [hrManager] = await db.insert(schema.users).values({
      name: 'Ana Martínez',
      email: 'ana.martinez@empresa.com',
      employeeId: 'EMP003',
      hireDate: '2020-02-10',
      positionId: hrManagerPositionFinal.id,
      departmentId: hrDeptFinal.id,
      managerId: ceoFinal.id,
      employmentType: 'full-time',
      status: 'active',
      phone: '+34 600 000 003',
    }).onConflictDoNothing().returning();

    // Desarrollador Senior (reporta a CTO)
    const ctoFinal = cto || existingUsers.find(u => u.email === 'carlos.rodriguez@empresa.com')!;
    const [seniorDev] = await db.insert(schema.users).values({
      name: 'Luis Fernández',
      email: 'luis.fernandez@empresa.com',
      employeeId: 'EMP004',
      hireDate: '2021-06-15',
      positionId: seniorDevPositionFinal.id,
      departmentId: techDeptFinal.id,
      managerId: ctoFinal.id,
      employmentType: 'full-time',
      status: 'active',
      phone: '+34 600 000 004',
    }).onConflictDoNothing().returning();

    // Desarrollador (reporta a Senior Dev)
    const seniorDevFinal = seniorDev || existingUsers.find(u => u.email === 'luis.fernandez@empresa.com')!;
    const [dev1] = await db.insert(schema.users).values({
      name: 'Sofía López',
      email: 'sofia.lopez@empresa.com',
      employeeId: 'EMP005',
      hireDate: '2022-09-01',
      positionId: devPositionFinal.id,
      departmentId: techDeptFinal.id,
      managerId: seniorDevFinal.id,
      employmentType: 'full-time',
      status: 'active',
      phone: '+34 600 000 005',
    }).onConflictDoNothing().returning();

    const [dev2] = await db.insert(schema.users).values({
      name: 'Pedro Sánchez',
      email: 'pedro.sanchez@empresa.com',
      employeeId: 'EMP006',
      hireDate: '2023-01-10',
      positionId: devPositionFinal.id,
      departmentId: techDeptFinal.id,
      managerId: seniorDevFinal.id,
      employmentType: 'full-time',
      status: 'active',
      phone: '+34 600 000 006',
    }).onConflictDoNothing().returning();

    // Especialista de RH (reporta a HR Manager)
    const hrManagerFinal = hrManager || existingUsers.find(u => u.email === 'ana.martinez@empresa.com')!;
    const [hrSpecialist] = await db.insert(schema.users).values({
      name: 'Laura García',
      email: 'laura.garcia@empresa.com',
      employeeId: 'EMP007',
      hireDate: '2022-03-20',
      positionId: hrSpecialistPositionFinal.id,
      departmentId: hrDeptFinal.id,
      managerId: hrManagerFinal.id,
      employmentType: 'full-time',
      status: 'active',
      phone: '+34 600 000 007',
    }).onConflictDoNothing().returning();
    
    // Obtener usuarios finales
    const dev1Final = dev1 || existingUsers.find(u => u.email === 'sofia.lopez@empresa.com')!;
    const dev2Final = dev2 || existingUsers.find(u => u.email === 'pedro.sanchez@empresa.com')!;
    const hrSpecialistFinal = hrSpecialist || existingUsers.find(u => u.email === 'laura.garcia@empresa.com')!;

    // 8. Asignar roles a usuarios (idempotente)
    console.log('📦 Asignando roles a usuarios...');
    await db.insert(schema.userRoles).values([
      { userId: ceoFinal.id, roleId: adminRoleFinal.id },
      { userId: ctoFinal.id, roleId: managerRoleFinal.id },
      { userId: hrManagerFinal.id, roleId: managerRoleFinal.id },
      { userId: seniorDevFinal.id, roleId: managerRoleFinal.id },
      { userId: dev1Final.id, roleId: employeeRoleFinal.id },
      { userId: dev2Final.id, roleId: employeeRoleFinal.id },
      { userId: hrSpecialistFinal.id, roleId: employeeRoleFinal.id },
    ]).onConflictDoNothing();

    // 9. Crear Tipos de Ausencia (idempotente)
    console.log('📦 Creando tipos de ausencia...');
    const [vacationType] = await db.insert(schema.leaveTypes).values({
      name: 'Vacaciones',
      code: 'VAC',
      maxDaysPerYear: 22,
      carryOverAllowed: true,
      requiresApproval: true,
      color: '#4CAF50',
    }).onConflictDoNothing().returning();

    const [sickType] = await db.insert(schema.leaveTypes).values({
      name: 'Enfermedad',
      code: 'ENF',
      maxDaysPerYear: 15,
      carryOverAllowed: false,
      requiresApproval: false,
      color: '#F44336',
    }).onConflictDoNothing().returning();

    const [personalType] = await db.insert(schema.leaveTypes).values({
      name: 'Asuntos Personales',
      code: 'PER',
      maxDaysPerYear: 5,
      carryOverAllowed: false,
      requiresApproval: true,
      color: '#FF9800',
    }).onConflictDoNothing().returning();
    
    // Obtener tipos de ausencia existentes si no se crearon
    const existingLeaveTypes = await db.select().from(schema.leaveTypes);
    const vacationTypeFinal = vacationType || existingLeaveTypes.find(t => t.code === 'VAC')!;
    const sickTypeFinal = sickType || existingLeaveTypes.find(t => t.code === 'ENF')!;
    const personalTypeFinal = personalType || existingLeaveTypes.find(t => t.code === 'PER')!;

    // 10. Crear Saldos de Ausencia para el año actual (idempotente)
    console.log('📦 Creando saldos de ausencia...');
    const currentYear = new Date().getFullYear();
    const employees = [dev1Final, dev2Final, hrSpecialistFinal, seniorDevFinal];

    for (const employee of employees) {
      await db.insert(schema.leaveBalances).values([
        {
          userId: employee.id,
          leaveTypeId: vacationTypeFinal.id,
          year: currentYear,
          totalDays: 22,
          usedDays: 0,
          remainingDays: 22,
          carriedOverDays: 0,
        },
        {
          userId: employee.id,
          leaveTypeId: sickTypeFinal.id,
          year: currentYear,
          totalDays: 15,
          usedDays: 0,
          remainingDays: 15,
          carriedOverDays: 0,
        },
        {
          userId: employee.id,
          leaveTypeId: personalTypeFinal.id,
          year: currentYear,
          totalDays: 5,
          usedDays: 0,
          remainingDays: 5,
          carriedOverDays: 0,
        },
      ]).onConflictDoNothing();
    }

    console.log('✅ Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${await db.select().from(schema.departments).then(r => r.length)} departamentos`);
    console.log(`   - ${await db.select().from(schema.positions).then(r => r.length)} puestos`);
    console.log(`   - ${await db.select().from(schema.users).then(r => r.length)} usuarios`);
    console.log(`   - ${await db.select().from(schema.roles).then(r => r.length)} roles`);
    console.log(`   - ${await db.select().from(schema.leaveTypes).then(r => r.length)} tipos de ausencia`);
    console.log('\n👤 Usuarios creados:');
    console.log('   - CEO: maria.gonzalez@empresa.com (admin)');
    console.log('   - CTO: carlos.rodriguez@empresa.com (manager)');
    console.log('   - HR Manager: ana.martinez@empresa.com (manager)');
    console.log('   - Senior Dev: luis.fernandez@empresa.com (manager)');
    console.log('   - Devs y HR Specialist: (employee)');
  } catch (error: any) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

// Ejecutar seed si se llama directamente
// En Bun, import.meta.main funciona, pero también podemos usar process.argv
if (import.meta.path === Bun.main || process.argv[1]?.includes('seed.ts')) {
  seed()
    .then(() => {
      console.log('🎉 Seed finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal en seed:', error);
      process.exit(1);
    });
}

export { seed };

