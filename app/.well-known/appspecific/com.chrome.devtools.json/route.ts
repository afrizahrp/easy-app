import { NextResponse } from 'next/server';

export async function GET() {
  // Return empty response for Chrome DevTools request
  return new NextResponse(null, { status: 204 });
}
