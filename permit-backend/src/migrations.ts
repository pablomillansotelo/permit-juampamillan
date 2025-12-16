import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as schema from './schema.js';

// Flag para asegurar que las migraciones solo se ejecuten una vez
let migrationsRun = false;
let migrationsPromise: Promise<void> | null = null;

/**
 * Ejecuta migraciones automáticas usando Drizzle Kit
 * Las migraciones se generan desde los schemas (única fuente de verdad)
 * 
 * Flujo:
 * 1. Intenta ejecutar migraciones generadas si existen
 * 2. Si no existen, muestra un mensaje indicando que se deben generar
 * 
 * En desarrollo: ejecuta `bun run db:push` para sincronizar directamente
 * En producción: ejecuta `bun run db:generate && bun run db:migrate` para migraciones versionadas
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
      const sql = neon(process.env.DATABASE_URL!);
      const db = drizzle(sql, { schema });

      // Verificar si existe la carpeta de migraciones
      const migrationsFolder = './drizzle';
      
      try {
        // Intentar ejecutar migraciones si existen
        console.log('🔄 Ejecutando migraciones desde schemas...');
        await migrate(db, { migrationsFolder });
        migrationsRun = true;
        console.log('✅ Migraciones ejecutadas correctamente desde schemas');
        return;
      } catch (error: any) {
        // Si no hay migraciones generadas, es normal en desarrollo
        if (error.message?.includes('ENOENT') || error.message?.includes('not found') || error.message?.includes('No such file')) {
          console.log('ℹ️ No se encontraron migraciones generadas.');
        } else {
          throw error;
        }
      }

      // Si no hay migraciones, solo loguear (no fallar)
      // El desarrollador debe ejecutar: bun run db:push o bun run db:generate
      console.log('ℹ️ No se encontraron migraciones generadas.');
      console.log('💡 Para sincronizar la BD con schemas, ejecuta:');
      console.log('   - Desarrollo: bun run db:push');
      console.log('   - Producción: bun run db:generate && bun run db:migrate');
      
      // En desarrollo, podemos continuar sin error
      // En producción, esto debería fallar para forzar migraciones explícitas
      migrationsRun = true;
      
    } catch (error: any) {
      console.error('❌ Error al ejecutar migraciones:', error);
      // En desarrollo, no fallar - permitir que la app continúe
      // En producción, esto debería fallar
      if (process.env.NODE_ENV === 'production') {
        migrationsRun = false;
        migrationsPromise = null;
        throw error;
      } else {
        console.warn('⚠️ Continuando sin migraciones (modo desarrollo)');
        migrationsRun = true;
      }
    }
  })();

  return migrationsPromise;
}
