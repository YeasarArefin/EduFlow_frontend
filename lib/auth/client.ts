"use client";

import { createAuthClient } from "better-auth/react";
import { env } from "@/config/env";

/** Shared Better Auth client for the backend's /api/auth endpoint. */
export const authClient = createAuthClient({
  baseURL: env.authBaseUrl,
  fetchOptions: {
    credentials: "include",
  },
});

export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
