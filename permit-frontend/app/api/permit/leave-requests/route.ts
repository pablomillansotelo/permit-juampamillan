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
    const queryParams = new URLSearchParams();
    if (searchParams.get('user_id')) queryParams.set('user_id', searchParams.get('user_id')!);
    if (searchParams.get('status')) queryParams.set('status', searchParams.get('status')!);
    if (searchParams.get('start_date')) queryParams.set('start_date', searchParams.get('start_date')!);
    if (searchParams.get('end_date')) queryParams.set('end_date', searchParams.get('end_date')!);

    const url = `${API_BASE_URL}/v1/leave-requests/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Error al obtener solicitudes de ausencia' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error en GET /api/permit/leave-requests:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener solicitudes de ausencia' },
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

    const response = await fetch(`${API_BASE_URL}/v1/leave-requests/`, {
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
        { error: errorData.message || 'Error al crear solicitud de ausencia' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/permit/leave-requests:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear solicitud de ausencia' },
      { status: 500 }
    );
  }
}

