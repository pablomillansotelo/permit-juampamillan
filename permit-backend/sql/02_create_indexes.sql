-- Script SQL de referencia para crear índices
-- Estos índices mejoran el rendimiento de las consultas

-- Índices para la tabla de permisos
CREATE INDEX IF NOT EXISTS idx_permissions_resource_id ON permissions(resource_id);

-- Índices para la tabla de role_permissions
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Índices para la tabla de user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Índice adicional para búsquedas por email de usuario
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Índice adicional para búsquedas por nombre de rol
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- Índice adicional para búsquedas por nombre de recurso
CREATE INDEX IF NOT EXISTS idx_resources_name ON resources(name);

