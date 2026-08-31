export function formatBdt(priceMinor: string) {
  const normalized = priceMinor.replace(/^0+(?=\d)/, "");
  const whole = normalized.length > 2 ? normalized.slice(0, -2) : "0";
  const poisha = normalized.slice(-2).padStart(2, "0");
  return `৳${whole}.${poisha}`;
}

export function durationLabel(days: number) {
  if (days === 365) return "year";
  if (days === 30) return "month";
  return `${days} days`;
}
