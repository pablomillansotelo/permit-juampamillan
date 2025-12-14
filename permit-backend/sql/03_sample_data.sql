-- Script SQL de referencia con datos de ejemplo
-- Este script inserta datos de ejemplo para probar el sistema RBAC

-- Insertar usuarios de ejemplo
INSERT INTO users (name, email) VALUES
    ('Juan Pérez', 'juan@example.com'),
    ('María García', 'maria@example.com'),
    ('Carlos López', 'carlos@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insertar recursos de ejemplo
INSERT INTO resources (name, description) VALUES
    ('posts', 'Artículos del blog'),
    ('users', 'Usuarios del sistema'),
    ('settings', 'Configuraciones del sistema')
ON CONFLICT (name) DO NOTHING;

-- Insertar roles de ejemplo
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrador del sistema con acceso completo'),
    ('editor', 'Editor de contenido'),
    ('viewer', 'Solo lectura')
ON CONFLICT (name) DO NOTHING;

-- Insertar permisos de ejemplo
-- Permisos para posts
INSERT INTO permissions (name, action, resource_id, description) VALUES
    ('read-posts', 'read', (SELECT id FROM resources WHERE name = 'posts'), 'Leer posts'),
    ('write-posts', 'write', (SELECT id FROM resources WHERE name = 'posts'), 'Crear y editar posts'),
    ('delete-posts', 'delete', (SELECT id FROM resources WHERE name = 'posts'), 'Eliminar posts')
ON CONFLICT DO NOTHING;

-- Permisos para users
INSERT INTO permissions (name, action, resource_id, description) VALUES
    ('read-users', 'read', (SELECT id FROM resources WHERE name = 'users'), 'Leer usuarios'),
    ('write-users', 'write', (SELECT id FROM resources WHERE name = 'users'), 'Crear y editar usuarios'),
    ('delete-users', 'delete', (SELECT id FROM resources WHERE name = 'users'), 'Eliminar usuarios')
ON CONFLICT DO NOTHING;

-- Permisos para settings
INSERT INTO permissions (name, action, resource_id, description) VALUES
    ('read-settings', 'read', (SELECT id FROM resources WHERE name = 'settings'), 'Leer configuraciones'),
    ('write-settings', 'write', (SELECT id FROM resources WHERE name = 'settings'), 'Modificar configuraciones')
ON CONFLICT DO NOTHING;

-- Asignar permisos al rol admin (todos los permisos)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'),
    id
FROM permissions
ON CONFLICT DO NOTHING;

-- Asignar permisos al rol editor (solo posts)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'editor'),
    id
FROM permissions
WHERE resource_id = (SELECT id FROM resources WHERE name = 'posts')
ON CONFLICT DO NOTHING;

-- Asignar permisos al rol viewer (solo lectura de posts)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'viewer'),
    id
FROM permissions
WHERE name = 'read-posts'
ON CONFLICT DO NOTHING;

-- Asignar roles a usuarios
INSERT INTO user_roles (user_id, role_id)
VALUES
    ((SELECT id FROM users WHERE email = 'juan@example.com'), (SELECT id FROM roles WHERE name = 'admin')),
    ((SELECT id FROM users WHERE email = 'maria@example.com'), (SELECT id FROM roles WHERE name = 'editor')),
    ((SELECT id FROM users WHERE email = 'carlos@example.com'), (SELECT id FROM roles WHERE name = 'viewer'))
ON CONFLICT DO NOTHING;

