import { NextResponse } from 'next/server';
import { NUTRI_PACKAGES } from '@/data/packages';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: NUTRI_PACKAGES,
  });
}
