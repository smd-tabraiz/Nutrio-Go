import { NextResponse } from 'next/server';
import { INITIAL_PAYMENTS } from '@/data/seedData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_PAYMENTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Payment registered',
      data: body,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
