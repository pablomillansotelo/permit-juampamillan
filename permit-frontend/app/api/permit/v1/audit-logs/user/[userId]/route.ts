import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const API_BASE_URL = process.env.PERMIT_API_URL || 'http://localhost:8000';
const API_KEY = process.env.PERMIT_API_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const url = new URL(`${API_BASE_URL}/v1/audit-logs/user/${userId}`);
    
    if (searchParams.get('limit')) {
      url.searchParams.set('limit', searchParams.get('limit')!);
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
        { error: errorData.message || 'Error al obtener logs de usuario' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error en GET /api/permit/v1/audit-logs/user/[userId]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener logs de usuario' },
      { status: 500 }
    );
  }
}

