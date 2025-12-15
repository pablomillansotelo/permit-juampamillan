import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rateLimit, RateLimitResult } from '@/lib/rate-limit';

interface RateLimitResponse {
  response: NextResponse | null;
  rateLimitResult: RateLimitResult;
}

/**
 * Helper para aplicar rate limiting en rutas API
 * Retorna null en response si pasa el rate limit, o una respuesta 429 si falla
 */
export async function applyRateLimit(
  request: NextRequest,
  type: 'get' | 'mutation' = 'get'
): Promise<RateLimitResponse> {
  const session = await auth();
  const identifier = session?.user?.email || request.ip || 'unknown';
  
  const rateLimitResult = type === 'get' 
    ? rateLimit.get(identifier)
    : rateLimit.mutation(identifier);

  if (!rateLimitResult.success) {
    const response = NextResponse.json(
      {
        error: 'Demasiadas solicitudes',
        message: 'Has excedido el límite de solicitudes. Intenta de nuevo más tarde.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    );
    return { response, rateLimitResult };
  }

  return { response: null, rateLimitResult };
}

/**
 * Agrega headers de rate limit a una respuesta
 */
export function addRateLimitHeaders(
  response: NextResponse,
  rateLimitResult: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString());
  return response;
}

