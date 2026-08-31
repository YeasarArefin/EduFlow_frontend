"use client";
import { useRouter } from "next/navigation";
import { signOut } from "./client";
export function useSignOut() { const router = useRouter(); return async () => { const result = await signOut(); if (result.error) return; router.replace("/"); router.refresh(); }; }
