"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";
import { getPlatformActivity, type ActivityListParams } from "../api/activity";

export function usePlatformActivity(params: ActivityListParams) {
  return useQuery(queryOptions({
    queryKey: ["platform", "activity", params] as const,
    queryFn: ({ signal }) => getPlatformActivity(params, signal),
    staleTime: 15_000
  }));
}
