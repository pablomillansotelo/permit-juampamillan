# Guía de Tests - Permit Backend

Esta guía explica cómo ejecutar y escribir tests para el backend.

## 🧪 Framework de Testing

El proyecto usa **Bun's built-in test runner**, que es rápido y no requiere configuración adicional.

## 📁 Estructura de Tests

```
permit-backend/
├── src/
│   ├── roles/
│   │   ├── service.ts
│   │   └── service.test.ts      # Tests unitarios
│   ├── users/
│   │   ├── service.ts
│   │   └── service.test.ts      # Tests unitarios
│   └── ...
└── tests/
    └── integration/
        └── api.test.ts          # Tests de integración
```

## 🚀 Ejecutar Tests

### Todos los tests

```bash
cd permit-backend
bun test
```

### Tests específicos

```bash
# Tests de un servicio específico
bun test src/roles/service.test.ts

# Tests de integración
bun test tests/integration/
```

### Con cobertura

```bash
bun test --coverage
```

## ✍️ Escribir Tests

### Estructura básica

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { RolesService } from './service';

describe('RolesService', () => {
  beforeEach(() => {
    // Setup antes de cada test
  });

  afterEach(() => {
    // Cleanup después de cada test
  });

  describe('createRole', () => {
    it('debe crear un rol', async () => {
      const role = await RolesService.createRole({
        name: 'test-role',
        description: 'Test'
      });

      expect(role).toBeDefined();
      expect(role.name).toBe('test-role');
    });
  });
});
```

### Helpers disponibles

- `describe` - Agrupar tests
- `it` / `test` - Test individual
- `expect` - Assertions
- `beforeEach` - Setup antes de cada test
- `afterEach` - Cleanup después de cada test
- `beforeAll` - Setup una vez antes de todos los tests
- `afterAll` - Cleanup una vez después de todos los tests

## 🔧 Configuración

### Variables de Entorno para Tests

Crea un archivo `.env.test`:

```env
DATABASE_URL=postgresql://user:password@localhost/permit_test
API_KEY=test-api-key
```

### Base de Datos de Test

**Recomendación:** Usa una base de datos separada para tests:

1. Crea una base de datos de test en Neon/PostgreSQL
2. Configura `DATABASE_URL` en `.env.test`
3. Las migraciones se ejecutarán automáticamente

## 📝 Ejemplos de Tests

### Test Unitario

```typescript
import { describe, it, expect } from 'bun:test';
import { RolesService } from './service';

describe('RolesService', () => {
  it('debe crear un rol', async () => {
    const role = await RolesService.createRole({
      name: 'admin',
      description: 'Administrador'
    });

    expect(role.name).toBe('admin');
  });
});
```

### Test de Integración

```typescript
import { describe, it, expect } from 'bun:test';

describe('API /roles', () => {
  it('debe retornar lista de roles', async () => {
    const response = await fetch('http://localhost:3000/roles', {
      headers: { 'X-API-Key': 'test-key' }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
```

## ✅ Mejores Prácticas

1. **Aislamiento**: Cada test debe ser independiente
2. **Cleanup**: Limpia datos de test después de cada test
3. **Nombres descriptivos**: Usa nombres claros para tests
4. **Arrange-Act-Assert**: Estructura tus tests claramente
5. **Tests rápidos**: Mantén los tests unitarios rápidos

## 🐛 Troubleshooting

### Error: "Cannot find module"

Asegúrate de estar en el directorio correcto:
```bash
cd permit-backend
bun test
```

### Error: "Database connection failed"

Verifica que `DATABASE_URL` esté configurado correctamente en `.env.test`.

### Tests lentos

- Usa una base de datos de test separada
- Limpia datos después de cada test
- Evita tests que dependan de otros tests

## 📚 Referencias

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [Testing Best Practices](https://testingjavascript.com/)

