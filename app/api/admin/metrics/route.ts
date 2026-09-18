import { NextResponse } from 'next/server';
import { getAdminKPIs } from '@/lib/dal/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const kpis = await getAdminKPIs();
    return NextResponse.json({
      success: true,
      data: kpis
    });
  } catch (err: any) {
    console.error('Failed to get admin KPIs:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
