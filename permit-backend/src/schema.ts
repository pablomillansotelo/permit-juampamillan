/**
 * Archivo central que exporta todos los schemas
 * Este archivo es usado por Drizzle Kit para generar migraciones
 * Única fuente de verdad para la estructura de la base de datos
 */

// RBAC Schemas
export * from './users/schema'
export * from './roles/schema'
export * from './resources/schema'
export * from './permissions/schema'
export * from './role-permissions/schema'
export * from './user-roles/schema'

// HR Schemas
export * from './hr/departments/schema'
export * from './hr/positions/schema'
export * from './hr/employment-types/schema'

// Absences Schemas
export * from './absences/leave-types/schema'
export * from './absences/leave-requests/schema'
export * from './absences/leave-balances/schema'

// API Keys Schema
export * from './api-keys/schema'

// Performance Schemas
export * from './performance/indicators/schema'
export * from './performance/employee-indicators/schema'
export * from './performance/evaluations/schema'
export * from './performance/evaluation-scores/schema'
export * from './performance/evaluation-templates/schema'

// Notifications Schemas
export * from './notifications/schema'

// Audit Schemas
export * from './audit/schema'

