export function teacherTakaFromMinor(minor: string) {
  const value = Number(minor || 0);
  return !Number.isFinite(value) || value === 0
    ? '0'
    : (value / 100).toFixed(2).replace(/\.00$/, '');
}

export function teacherMinorFromTaka(taka: string) {
  const value = Number(taka.trim());
  return !Number.isFinite(value) || value < 0 ? '0' : Math.round(value * 100).toString();
}

export function formatTeacherSalaryMinor(minor: string) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(minor || 0) / 100);
}

export function formatTeacherTakaPreview(taka: string) {
  const value = Number(taka.trim() || 0);
  return !Number.isFinite(value) || value < 0
    ? '৳ 0.00'
    : new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
}
