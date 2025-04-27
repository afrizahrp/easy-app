// src/utils/salesPersonColors.ts
export const salesPersonColorMap: Record<
  string,
  { from: string; to: string; border: string }
> = {
  'direct buyer': { from: '#1e3a8a', to: '#3b82f6', border: '#1e3a8a' },
  medi: { from: '#10b981', to: '#6ee7b7', border: '#10b981' },
  yoga: { from: '#e11d48', to: '#f472b6', border: '#e11d48' },
  sujud: { from: '#9333ea', to: '#c084fc', border: '#9333ea' },
  aji: { from: '#f59e0b', to: '#fcd34d', border: '#f59e0b' },
  risa: { from: '#0ea5e9', to: '#7dd3fc', border: '#0ea5e9' },
  saefudin: { from: '#4b5563', to: '#9ca3af', border: '#4b5563' },
  'amir h.': { from: '#7c3aed', to: '#a78bfa', border: '#7c3aed' },
  indro: { from: '#dc2626', to: '#f87171', border: '#dc2626' },
  angga: { from: '#059669', to: '#34d399', border: '#059669' },
  orit: { from: '#d97706', to: '#facc15', border: '#d97706' },
  rikhi: { from: '#6d28d9', to: '#a855f7', border: '#6d28d9' },
  dani: { from: '#1d4ed8', to: '#60a5fa', border: '#1d4ed8' },
  handoyo: { from: '#be123c', to: '#fb7185', border: '#be123c' },
  deni: { from: '#15803d', to: '#4ade80', border: '#15803d' },
  rizal: { from: '#7e22ce', to: '#c084fc', border: '#7e22ce' },
  // Tambahkan warna untuk salesperson lain secara manual atau gunakan generator di bawah
};

// Fallback untuk salesperson yang tidak ada di mapping
export const getFallbackColor = (
  salesPersonName: string
): { from: string; to: string; border: string } => {
  // Gunakan hash sederhana untuk konsistensi
  const hash = salesPersonName
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360; // Hue dari 0-359
  return {
    from: `hsl(${hue}, 70%, 30%)`,
    to: `hsl(${hue}, 70%, 70%)`,
    border: `hsl(${hue}, 70%, 30%)`,
  };
};
