import { env } from "@/config/env";

export type PublicPlan = {
  id: string;
  name: string;
  slug: string;
  priceMinor: string;
  durationDays: number;
  trial: { included: boolean; days: number };
  features: Array<{ key: string; name: string; description: string | null; defaultLimit: string | null }>;
  quotas: Record<string, string | null>;
};

type PublicPlansResponse = { data: PublicPlan[] };

export async function getPublicPlans(): Promise<PublicPlan[] | null> {
  try {
    const response = await fetch(`${env.apiBaseUrl}/public/plans`, { next: { revalidate: 300 }, headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    const payload = (await response.json()) as PublicPlansResponse;
    return Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  }
}
