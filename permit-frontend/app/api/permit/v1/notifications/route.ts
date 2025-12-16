import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const API_BASE_URL = process.env.PERMIT_API_URL || 'http://localhost:8000';
const API_KEY = process.env.PERMIT_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // TODO: Obtener userId del session cuando esté disponible
    // Por ahora, usar un userId temporal o del query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1'; // Temporal
    const unreadOnly = searchParams.get('unreadOnly');
    const limit = searchParams.get('limit');

    const url = new URL(`${API_BASE_URL}/v1/notifications`);
    url.searchParams.set('userId', userId);
    if (unreadOnly) url.searchParams.set('unreadOnly', unreadOnly);
    if (limit) url.searchParams.set('limit', limit);

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Error al obtener notificaciones' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error en GET /api/permit/v1/notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener notificaciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Error al crear notificación' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/permit/v1/notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear notificación' },
      { status: 500 }
    );
  }
}

