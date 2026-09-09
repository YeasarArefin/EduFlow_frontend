export const platformPlanQueryKeys = {
  all: ['platform', 'plans'] as const,
  list: () => [...platformPlanQueryKeys.all, 'list'] as const,
  featureCatalog: () => [...platformPlanQueryKeys.all, 'feature-catalog'] as const,
};
