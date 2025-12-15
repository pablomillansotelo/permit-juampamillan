# Guía de Tests - Permit Frontend

Esta guía explica cómo ejecutar y escribir tests para el frontend.

## 🧪 Framework de Testing

El proyecto usa **Jest** con **React Testing Library** para tests unitarios y de componentes.

## 📁 Estructura de Tests

```
permit-frontend/
├── components/
│   ├── __tests__/
│   │   └── table-pagination.test.tsx
│   └── ...
├── lib/
│   ├── utils.test.ts
│   └── ...
└── jest.config.js
```

## 🚀 Ejecutar Tests

### Todos los tests

```bash
cd permit-frontend
npm test
# o
pnpm test
```

### Modo watch (desarrollo)

```bash
npm test -- --watch
```

### Con cobertura

```bash
npm test -- --coverage
```

### Tests específicos

```bash
npm test -- table-pagination
```

## ✍️ Escribir Tests

### Test de Componente

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('debe renderizar correctamente', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Test de Utilidad

```typescript
import { describe, it, expect } from '@jest/globals';
import { myUtility } from './utils';

describe('myUtility', () => {
  it('debe funcionar correctamente', () => {
    const result = myUtility('input');
    expect(result).toBe('expected-output');
  });
});
```

## 🔧 Configuración

### Jest Config

El archivo `jest.config.js` está configurado para:
- Usar Next.js test environment
- Mapear imports `@/` a la raíz del proyecto
- Configurar setup files

### Setup Files

`jest.setup.js` incluye:
- `@testing-library/jest-dom` para matchers adicionales

## ✅ Mejores Prácticas

1. **Testing Library**: Usa queries accesibles (`getByRole`, `getByLabelText`)
2. **No testear implementación**: Testea comportamiento, no detalles internos
3. **Tests aislados**: Cada test debe ser independiente
4. **Nombres descriptivos**: Usa nombres claros que describan qué testea
5. **Arrange-Act-Assert**: Estructura tus tests claramente

## 📝 Ejemplos

### Test de Componente con Interacción

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('debe llamar onClick al hacer clic', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test con Contexto

```typescript
import { render } from '@testing-library/react';
import { PermissionsProvider } from '@/lib/permissions';

describe('Component with Context', () => {
  it('debe funcionar con contexto', () => {
    render(
      <PermissionsProvider userId={1}>
        <MyComponent />
      </PermissionsProvider>
    );
    // ... assertions
  });
});
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@testing-library/react'"

Instala las dependencias:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Error: "SyntaxError: Cannot use import statement"

Asegúrate de que `jest.config.js` esté configurado correctamente con Next.js.

### Tests lentos

- Usa `--watch` solo cuando desarrolles
- Ejecuta tests específicos durante desarrollo
- Usa `--coverage` solo cuando sea necesario

## 📚 Referencias

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

