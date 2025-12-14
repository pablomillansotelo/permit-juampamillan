import { neon } from '@neondatabase/serverless';

// Flag para asegurar que las migraciones solo se ejecuten una vez
let migrationsRun = false;
let migrationsPromise: Promise<void> | null = null;

/**
 * Ejecuta migraciones automáticas de forma lazy
 * Crea las tablas si no existen basándose en los schemas definidos
 * En Vercel, esto se ejecuta en el primer request
 */
export async function runMigrations(): Promise<void> {
  // Si ya se ejecutaron, retornar inmediatamente
  if (migrationsRun) {
    return;
  }

  // Si ya hay una ejecución en curso, esperar a que termine
  if (migrationsPromise) {
    return migrationsPromise;
  }

  // Ejecutar migraciones
  migrationsPromise = (async () => {
    try {
      const client = neon(process.env.DATABASE_URL!);
      
      console.log('🔄 Verificando estado de las tablas...');

      // Verificar si la tabla de usuarios existe (usamos esta como indicador)
      let usersTableCheck;
      try {
        usersTableCheck = await client`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
          ) as exists;
        `;
      } catch (error) {
        console.error('Error al verificar tablas:', error);
        throw error;
      }

      // Si las tablas ya existen, marcar como completado y retornar
      if (usersTableCheck && usersTableCheck[0]?.exists) {
        migrationsRun = true;
        console.log('✅ Tablas ya existen, saltando migraciones');
        return;
      }

      console.log('🔄 Tablas no encontradas, ejecutando migraciones...');

      // Crear tabla de migraciones si no existe
      await client`
        CREATE TABLE IF NOT EXISTS drizzle_migrations (
          id SERIAL PRIMARY KEY,
          hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;

      // Crear tablas una por una para mejor manejo de errores
      console.log('📦 Creando tabla de usuarios...');
      await client`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;

      console.log('📦 Creando tabla de roles...');
      await client`
        CREATE TABLE IF NOT EXISTS roles (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;

      console.log('📦 Creando tabla de recursos...');
      await client`
        CREATE TABLE IF NOT EXISTS resources (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;

      console.log('📦 Creando tabla de permisos...');
      await client`
        CREATE TABLE IF NOT EXISTS permissions (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          action TEXT NOT NULL,
          resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
          description TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;

      console.log('📦 Creando tabla de role_permissions...');
      await client`
        CREATE TABLE IF NOT EXISTS role_permissions (
          id SERIAL PRIMARY KEY,
          role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
          permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(role_id, permission_id)
        );
      `;

      console.log('📦 Creando tabla de user_roles...');
      await client`
        CREATE TABLE IF NOT EXISTS user_roles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(user_id, role_id)
        );
      `;

      console.log('📦 Creando índices...');
      await client`
        CREATE INDEX IF NOT EXISTS idx_permissions_resource_id ON permissions(resource_id);
        CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
        CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
        CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
      `;

      migrationsRun = true;
      console.log('✅ Migraciones ejecutadas correctamente');
    } catch (error) {
      console.error('❌ Error al ejecutar migraciones:', error);
      // Resetear el flag para permitir reintentos
      migrationsRun = false;
      migrationsPromise = null;
      throw error;
    }
  })();

  return migrationsPromise;
}

