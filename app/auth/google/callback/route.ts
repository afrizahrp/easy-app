// app/auth/callback/route.ts
import { createSession } from '@/lib/session';
import { Role } from '@/lib/type';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const userId = searchParams.get('userId');
  const company_id = searchParams.get('company_id') || 'BIS';
  const name = searchParams.get('name');
  const image = searchParams.get('image') || '';
  const email = searchParams.get('email') || '';
  const role_id = searchParams.get('role_id');
  const role_name = searchParams.get('role_name') || 'ADMINISTRATOR';

  console.log('Query Params:', {
    accessToken,
    refreshToken,
    userId,
    company_id,
    name,
    email,
    image,
    role_id,
    role_name,
  });

  if (!accessToken || !refreshToken || !userId || !name || !role_id) {
    throw new Error('Google Auth Failed! Missing required parameters');
  }

  try {
    const sessionData = {
      user: {
        id: userId,
        name,
        image,
        email,
        company_id,
        branch_id: 'BIS',
        role_id,
        role_name,
      },
      accessToken,
      refreshToken,
    };
    // console.log('Creating session with data:', sessionData); // Tambahkan log
    await createSession(sessionData);
  } catch (error) {
    console.error('Create Session Error:', error);
    throw new Error('Failed to create session');
  }

  redirect('/dashboard');
}
