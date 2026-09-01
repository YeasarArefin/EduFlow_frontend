import { apiListRequest } from "@/lib/api/client";
import type { PaginationMeta } from "./workspaces";

export type PlatformActivity = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  actor: { id: string; name: string; email: string } | null;
  workspace: { id: string; name: string | null; slug: string | null } | null;
  metadataSummary: Array<{ key: string; value: string }> | null;
};

export type ActivityListParams = {
  page: number;
  limit: number;
  search?: string;
  category?: "payment" | "plan" | "entitlement" | "lifecycle";
};

export function getPlatformActivity(params: ActivityListParams, signal?: AbortSignal) {
  const search = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) search.set("search", params.search);
  if (params.category) search.set("category", params.category);
  return apiListRequest<PlatformActivity[], PaginationMeta>(`/activity?${search}`, { signal });
}
