import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok', 
      message: 'API Next.js fonctionnelle',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
} 