"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, getOnboardingState, type CreateWorkspaceInput } from "../api/onboarding";
import { SELECTED_WORKSPACE_COOKIE } from "@/lib/workspace";
export const onboardingKeys = { state: (id: string) => ["workspace-onboarding", id] as const };
export function useOnboardingState(id: string | null) { return useQuery({ queryKey: onboardingKeys.state(id ?? "none"), queryFn: () => getOnboardingState(id!), enabled: Boolean(id), staleTime: 15_000 }); }
export function useCreateWorkspace() { const client = useQueryClient(); return useMutation({ mutationFn: (input: CreateWorkspaceInput) => createWorkspace(input), onSuccess: (workspace) => { window.localStorage.setItem(SELECTED_WORKSPACE_COOKIE, workspace.id); document.cookie = `${SELECTED_WORKSPACE_COOKIE}=${encodeURIComponent(workspace.id)}; Path=/; SameSite=Lax`; client.invalidateQueries({ queryKey: onboardingKeys.state(workspace.id) }); } }); }
