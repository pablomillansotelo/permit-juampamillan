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
    const url = new URL(`${API_BASE_URL}/v1/audit-logs`);
    
    if (searchParams.get('userId')) {
      url.searchParams.set('userId', searchParams.get('userId')!);
    }
    if (searchParams.get('action')) {
      url.searchParams.set('action', searchParams.get('action')!);
    }
    if (searchParams.get('entityType')) {
      url.searchParams.set('entityType', searchParams.get('entityType')!);
    }
    if (searchParams.get('entityId')) {
      url.searchParams.set('entityId', searchParams.get('entityId')!);
    }
    if (searchParams.get('startDate')) {
      url.searchParams.set('startDate', searchParams.get('startDate')!);
    }
    if (searchParams.get('endDate')) {
      url.searchParams.set('endDate', searchParams.get('endDate')!);
    }
    if (searchParams.get('limit')) {
      url.searchParams.set('limit', searchParams.get('limit')!);
    }
    if (searchParams.get('offset')) {
      url.searchParams.set('offset', searchParams.get('offset')!);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Error al obtener logs de auditoría' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error en GET /api/permit/v1/audit-logs:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener logs de auditoría' },
      { status: 500 }
    );
  }
}

