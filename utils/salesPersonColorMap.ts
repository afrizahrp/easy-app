// src/utils/salesPersonColors.ts
export const salesPersonColorMap: Record<
  string,
  { from: string; to: string; border: string }
> = {
  // BIS
  DIRECT: { from: '#15803d', to: '#4ade80', border: '#15803d' }, // Hijau
  MEDI: { from: '#10b981', to: '#6ee7b7', border: '#10b981' }, // Emerald
  YOGA: { from: '#e11d48', to: '#f472b6', border: '#e11d48' }, // Rose
  SUJUD: { from: '#c026d3', to: '#f0abfc', border: '#c026d3' }, // Magenta (diperbarui)
  'AMIR H.': { from: '#7c3aed', to: '#a78bfa', border: '#7c3aed' }, // Violet
  INDRO: { from: '#dc2626', to: '#f87171', border: '#dc2626' }, // Red
  ANGGA: { from: '#059669', to: '#34d399', border: '#059669' }, // Green
  RIKHI: { from: '#6d28d9', to: '#a855f7', border: '#6d28d9' }, // Purple-800
  DANI: { from: '#1d4ed8', to: '#60a5fa', border: '#1d4ed8' }, // Blue
  HANDOYO: { from: '#be123c', to: '#fb7185', border: '#be123c' }, // Rose-700
  DENI: { from: '#047857', to: '#6ee7b7', border: '#047857' }, // Emerald-600
  RIZAL: { from: '#5b21b6', to: '#a78bfa', border: '#5b21b6' }, // Deep Indigo-Purple (diperbarui)
  RIFKAH: { from: '#fbbf24', to: '#fef08a', border: '#fbbf24' }, // Amber-400
  TONI: { from: '#eab308', to: '#fef08a', border: '#eab308' }, // Yellow
  HARYADI: { from: '#6366f1', to: '#a5b4fc', border: '#6366f1' }, // Indigo
  YUDI: { from: '#22d3ee', to: '#7dd3fc', border: '#22d3ee' }, // Cyan
  SETIADI: { from: '#3f3f46', to: '#d1d5db', border: '#3f3f46' }, // Gray-700
  TARYONO: { from: '#ef4444', to: '#f87171', border: '#ef4444' }, // Red-500
  RONNY: { from: '#f97316', to: '#fdba74', border: '#f97316' }, // Orange
  'INDRO/SUJUD': { from: '#6b21a8', to: '#d8b4fe', border: '#6b21a8' }, // Purple-900
  SARYUDI: { from: '#ea580c', to: '#fdba74', border: '#ea580c' }, // Orange-600
  ARMAN: { from: '#c026d3', to: '#f0abfc', border: '#c026d3' }, // Fuchsia
  'UDIN MIO': { from: '#9f1239', to: '#fb7185', border: '#9f1239' }, // Rose-900
  BOWO: { from: '#4c1d95', to: '#a78bfa', border: '#4c1d95' }, // Violet-900
  ARIQ: { from: '#800000', to: '#b22222', border: '#800000' }, // Merah marun
  RISA: { from: '#0ea5e9', to: '#7dd3fc', border: '#0ea5e9' }, // Cyan-600
  'DIRECT/DEFVI': { from: '#d97706', to: '#facc15', border: '#d97706' }, // Amber-600
  'DANI PAKAI YG SATUNYA': {
    from: '#7f1d1d',
    to: '#f87171',
    border: '#7f1d1d',
  }, // Red-900
  DIMAS: { from: '#b91c1c', to: '#f87171', border: '#b91c1c' }, // Red-700
  'DIRECT/YETTY': { from: '#3b0764', to: '#c084fc', border: '#3b0764' }, // Purple-950
  SLAMET: { from: '#1c1917', to: '#d1d5db', border: '#1c1917' }, // Stone-900
  HERMAN: { from: '#9d174d', to: '#e11d48', border: '#9d174d' }, // Rose-800
  IWAN: { from: '#1e40af', to: '#93c5fd', border: '#1e40af' }, // Blue-800
  HANS: { from: '#7c2d12', to: '#fed7aa', border: '#7c2d12' }, // Orange-900
  SETA: { from: '#1e3a8a', to: '#3b82f6', border: '#1e3a8a' }, // Blue-200

  // NON BIS
  AJI: { from: '#d97706', to: '#facc15', border: '#d97706' }, // Gold/Saffron
  ORIT: { from: '#f472b6', to: '#f9a8d4', border: '#f472b6' }, // Peach
  INDAH: { from: '#ec4899', to: '#f472b6', border: '#ec4899' }, // Pink
  JEFRI: { from: '#10b981', to: '#6ee7b7', border: '#10b981' }, // Emerald
  HUSNI: { from: '#0ea5e9', to: '#7dd3fc', border: '#0ea5e9' }, // Cyan
  FEBBY: { from: '#9333ea', to: '#c084fc', border: '#9333ea' }, // Purple
  'PT. ANUGERAH PUTERA ALFATHAN': {
    from: '#eab308',
    to: '#fef08a',
    border: '#eab308',
  }, // Yellow
  BIGKO: { from: '#6366f1', to: '#a5b4fc', border: '#6366f1' }, // Indigo
  RACHMAT: { from: '#ef4444', to: '#f87171', border: '#ef4444' }, // Red
  RHIO: { from: '#c026d3', to: '#f0abfc', border: '#c026d3' }, // Fuchsia
  'SETIADI ELM': { from: '#4b5563', to: '#9ca3af', border: '#4b5321' }, //
  'SAEFUDIN. BPK': { from: '#9ca3af', to: '#d1d5db', border: '#9ca3af' }, // Gray
  SAEFUDIN: { from: '#9ca3af', to: '#d1d5db', border: '#9ca3af' }, // Gray
};

// Fallback untuk salesperson yang tidak ada di mapping

export const getFallbackColor = (
  salesPersonName: string | undefined
): { from: string; to: string; border: string } => {
  // Jika salespersonName undefined atau kosong, gunakan string default
  if (!salesPersonName) {
    salesPersonName = 'default';
  }
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
