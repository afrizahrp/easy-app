import { createSession } from '@/lib/session';
import { Role } from '@/lib/type';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const userId = searchParams.get('id');
  const name = searchParams.get('name');
  const Image = searchParams.get('image') || '';
  const email = searchParams.get('email');
  const role = searchParams.get('role');

  if (!accessToken || !refreshToken || !userId || !name || !role)
    throw new Error('Google Auth Failed!');

  await createSession({
    user: {
      id: userId,
      name: name,
      image: Image,
      company_id: '',
      branch_id: '',
      role_id: parseInt(role, 10),
      role_name: role as Role,
    },
    accessToken,
    refreshToken,
  });

  redirect('/');
}
