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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let endpoint = '/v1/org-chart';
    if (userId) {
      endpoint = `/v1/org-chart/${userId}`;
    } else if (searchParams.get('flat') === 'true') {
      endpoint = '/v1/org-chart/flat';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Error al obtener organigrama' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error en GET /api/permit/org-chart:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener organigrama' },
      { status: 500 }
    );
  }
}

