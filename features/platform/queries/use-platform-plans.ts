'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createPlatformPlan,
  deletePlatformPlan,
  getPlatformFeatureCatalog,
  getPlatformPlans,
  setPlatformPlanActive,
  updatePlatformPlan,
  type PlatformPlanFeature,
  type PlatformPlanInput,
} from '../api/plans';
import { platformPlanQueryKeys } from '../plan-query-keys';

export function usePlatformPlans() {
  return useQuery({
    queryKey: platformPlanQueryKeys.list(),
    queryFn: ({ signal }) => getPlatformPlans(signal),
    staleTime: 15_000,
  });
}

export function usePlatformFeatureCatalog() {
  return useQuery({
    queryKey: platformPlanQueryKeys.featureCatalog(),
    queryFn: ({ signal }) => getPlatformFeatureCatalog(signal),
    staleTime: 60_000,
  });
}

export function useSavePlatformPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, input }: { planId?: string; input: PlatformPlanInput }) =>
      planId ? updatePlatformPlan(planId, input) : createPlatformPlan(input),
    onSuccess: async (_plan, variables) => {
      await queryClient.invalidateQueries({ queryKey: platformPlanQueryKeys.all });
      toast.success(variables.planId ? 'Plan updated.' : 'Plan created.');
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Could not save the plan.'),
  });
}

export function useSetPlatformPlanActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, isActive }: { planId: string; isActive: boolean }) =>
      setPlatformPlanActive(planId, isActive),
    onSuccess: async (_plan, variables) => {
      await queryClient.invalidateQueries({ queryKey: platformPlanQueryKeys.all });
      toast.success(variables.isActive ? 'Plan activated.' : 'Plan deactivated.');
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Could not update the plan state.'),
  });
}

export function useDeletePlatformPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlatformPlan,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: platformPlanQueryKeys.all });
      toast.success('Plan deleted.');
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not delete the plan.'),
  });
}

export function useUpdatePlatformPlanFeatures() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, features }: { planId: string; features: PlatformPlanFeature[] }) =>
      updatePlatformPlan(planId, { features }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: platformPlanQueryKeys.all });
      toast.success('Plan features and quotas saved.');
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : 'Could not save plan features and quotas.'
      ),
  });
}
