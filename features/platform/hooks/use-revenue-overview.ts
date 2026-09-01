"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRevenueOverview } from "../api/revenue";

export function useRevenueOverview(params: { from?: string; to?: string }) {
  return useQuery(queryOptions({ queryKey: ["platform", "revenue", params] as const, queryFn: ({ signal }) => getRevenueOverview(params, signal) }));
}
