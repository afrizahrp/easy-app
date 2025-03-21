'use server';

import { redirect } from 'next/navigation';
import { BACKEND_URL } from './constants';
import { FormState } from './type';
import { createSession, updateTokens } from './session';

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    }),
  });

  if (response.ok) {
    redirect('/auth/signin');
  } else {
    return {
      message:
        response.status === 409
          ? 'The user is already existed!'
          : response.statusText,
    };
  }
}

export async function signIn(
  name: string,
  password: string,
  company_id: string
): Promise<{
  ok: boolean;
  error?: string;
  user?: {
    name: string;
    role_id: string;
    company_id: string;
    image: string;
    email: string;
  };
}> {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      password,
      company_id,
    }),
  });

  if (response.ok) {
    const result = await response.json();

    await createSession({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        image: result.user.image,
        company_id: result.user.company.company_id,
        branch_id: result.user.company.branch_id,
        role_id: result.user.company.role_id,
        role_name: result.user.company.role_name,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    return {
      ok: true,
      user: {
        name: result.user.name,
        role_id: result.user.company.role_id,
        company_id: result.user.company.company_id,
        image: result.user.image,
        email: result.user.email,
      },
    };
  } else {
    const errorResult = await response.json();

    return {
      ok: false,
      error: errorResult.message || response.statusText,
    };
  }
}

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token' + response.statusText);
    }

    const { accessToken, refreshToken } = await response.json();
    // update session with new tokens
    const updateRes = await fetch('http://localhost:3000/api/auth/update', {
      method: 'POST',
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });
    if (!updateRes.ok) throw new Error('Failed to update the tokens');

    return accessToken;
  } catch (err) {
    console.error('Refresh Token failed:', err);
    return null;
  }
};
