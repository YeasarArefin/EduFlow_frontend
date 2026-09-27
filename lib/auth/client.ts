'use client';

import { createAuthClient } from 'better-auth/react';

/** Shared Better Auth client using Vercel's same-origin /api/auth proxy. */
export const authClient = createAuthClient({
  fetchOptions: {
    credentials: 'include',
  },
});

export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const requestPasswordReset = authClient.requestPasswordReset;
export const resetPassword = authClient.resetPassword;
export const changePassword = authClient.changePassword;
export const updateUser = authClient.updateUser;
