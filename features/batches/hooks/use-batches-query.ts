"use client";
import { useQuery } from "@tanstack/react-query";
import { getBatch, getBatches, type BatchListParams } from "../api/batches";
import { batchKeys } from "../batch-query-keys";
export const useBatchesQuery = (workspaceId: string, params: BatchListParams) => useQuery({ queryKey: batchKeys.list(workspaceId, params), queryFn: ({ signal }) => getBatches(workspaceId, params, signal), enabled: Boolean(workspaceId), staleTime: 30_000 });
export const useBatchQuery = (workspaceId: string, id: string) => useQuery({ queryKey: batchKeys.detail(workspaceId, id), queryFn: ({ signal }) => getBatch(workspaceId, id, signal), enabled: Boolean(workspaceId && id), staleTime: 30_000 });
