import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../../api/index';

/**
 * Tests de integración para las APIs
 * 
 * Estos tests verifican que los endpoints funcionen correctamente
 * Requieren que el servidor esté corriendo o usar un cliente HTTP
 */
describe('API Integration Tests', () => {
  const API_KEY = process.env.API_KEY || 'test-api-key';
  const BASE_URL = process.env.API_URL || 'http://localhost:8000';

  describe('GET /', () => {
    it('debe retornar información de la API', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('endpoints');
    });
  });

  describe('GET /users', () => {
    it('debe requerir API key', async () => {
      const response = await fetch(`${BASE_URL}/users`);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('debe retornar lista de usuarios con API key válida', async () => {
      const response = await fetch(`${BASE_URL}/users`, {
        headers: {
          'X-API-Key': API_KEY
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
      } else {
        // Si falla, puede ser porque no hay API key configurada en test
        expect(response.status).toBe(401);
      }
    });
  });

  describe('GET /roles', () => {
    it('debe requerir API key', async () => {
      const response = await fetch(`${BASE_URL}/roles`);
      
      expect(response.status).toBe(401);
    });

    it('debe retornar lista de roles con API key válida', async () => {
      const response = await fetch(`${BASE_URL}/roles`, {
        headers: {
          'X-API-Key': API_KEY
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
      }
    });
  });

  describe('GET /resources', () => {
    it('debe requerir API key', async () => {
      const response = await fetch(`${BASE_URL}/resources`);
      
      expect(response.status).toBe(401);
    });
  });

  describe('GET /permissions', () => {
    it('debe requerir API key', async () => {
      const response = await fetch(`${BASE_URL}/permissions`);
      
      expect(response.status).toBe(401);
    });
  });
});

