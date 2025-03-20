import { authFetch } from '@/lib/authFetch';
import { BACKEND_URL } from '@/lib/constants';
import { deleteSession } from '@/lib/session';
import { redirect, RedirectType } from 'next/navigation';

import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const response = await authFetch(`${BACKEND_URL}/auth/logout`, {
    method: 'POST',
  });
  if (response.ok) {
    await deleteSession();
    redirect('/', RedirectType.push);
  } else {
    console.error('Failed to sign out:', response.statusText);
  }
}
