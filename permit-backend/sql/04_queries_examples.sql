-- Script SQL de referencia con consultas de ejemplo
-- Estas consultas muestran cómo obtener información del sistema RBAC

-- Obtener todos los roles de un usuario
SELECT 
    ur.id,
    ur.user_id,
    u.name AS user_name,
    u.email AS user_email,
    ur.role_id,
    r.name AS role_name,
    r.description AS role_description,
    ur.created_at
FROM user_roles ur
JOIN users u ON ur.user_id = u.id
JOIN roles r ON ur.role_id = r.id
WHERE ur.user_id = 1;

-- Obtener todos los permisos de un usuario (a través de sus roles)
SELECT DISTINCT
    p.id AS permission_id,
    p.name AS permission_name,
    p.action AS permission_action,
    p.resource_id,
    res.name AS resource_name,
    r.id AS role_id,
    r.name AS role_name
FROM user_roles ur
JOIN role_permissions rp ON ur.role_id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
JOIN resources res ON p.resource_id = res.id
JOIN roles r ON ur.role_id = r.id
WHERE ur.user_id = 1;

-- Obtener todos los permisos de un rol
SELECT 
    rp.id,
    rp.role_id,
    r.name AS role_name,
    rp.permission_id,
    p.name AS permission_name,
    p.action AS permission_action,
    p.resource_id,
    res.name AS resource_name,
    rp.created_at
FROM role_permissions rp
JOIN roles r ON rp.role_id = r.id
JOIN permissions p ON rp.permission_id = p.id
JOIN resources res ON p.resource_id = res.id
WHERE rp.role_id = 1;

-- Obtener todos los usuarios que tienen un rol específico
SELECT 
    ur.id,
    ur.user_id,
    u.name AS user_name,
    u.email AS user_email,
    ur.role_id,
    r.name AS role_name,
    ur.created_at
FROM user_roles ur
JOIN users u ON ur.user_id = u.id
JOIN roles r ON ur.role_id = r.id
WHERE ur.role_id = 1;

-- Obtener todos los roles que tienen un permiso específico
SELECT 
    rp.id,
    rp.role_id,
    r.name AS role_name,
    rp.permission_id,
    p.name AS permission_name,
    rp.created_at
FROM role_permissions rp
JOIN roles r ON rp.role_id = r.id
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.permission_id = 1;

-- Obtener todos los permisos de un recurso
SELECT 
    p.id,
    p.name,
    p.action,
    p.resource_id,
    res.name AS resource_name,
    p.description,
    p.created_at,
    p.updated_at
FROM permissions p
JOIN resources res ON p.resource_id = res.id
WHERE p.resource_id = 1;

-- Verificar si un usuario tiene un permiso específico
SELECT EXISTS(
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = 1 
    AND p.name = 'read-posts'
) AS has_permission;

-- Contar cuántos usuarios tienen cada rol
SELECT 
    r.id AS role_id,
    r.name AS role_name,
    COUNT(ur.user_id) AS user_count
FROM roles r
LEFT JOIN user_roles ur ON r.id = ur.role_id
GROUP BY r.id, r.name
ORDER BY user_count DESC;

-- Contar cuántos permisos tiene cada rol
SELECT 
    r.id AS role_id,
    r.name AS role_name,
    COUNT(rp.permission_id) AS permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.name
ORDER BY permission_count DESC;

