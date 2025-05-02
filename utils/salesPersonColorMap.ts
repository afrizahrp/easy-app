// src/utils/salesPersonColors.ts
export const salesPersonColorMap: Record<
  string,
  { from: string; to: string; border: string }
> = {
  // BIS
  'direct buyer': { from: '#15803d', to: '#4ade80', border: '#15803d' }, // Hijau
  'direct bip': { from: '#15803d', to: '#4ade80', border: '#15803d' }, // Hijau
  medi: { from: '#10b981', to: '#6ee7b7', border: '#10b981' }, // Emerald
  yoga: { from: '#e11d48', to: '#f472b6', border: '#e11d48' }, // Rose
  sujud: { from: '#9333ea', to: '#c084fc', border: '#9333ea' }, // Purple
  'amir h.': { from: '#7c3aed', to: '#a78bfa', border: '#7c3aed' }, // Violet
  indro: { from: '#dc2626', to: '#f87171', border: '#dc2626' }, // Red
  angga: { from: '#059669', to: '#34d399', border: '#059669' }, // Green
  rikhi: { from: '#6d28d9', to: '#a855f7', border: '#6d28d9' }, // Purple-800
  dani: { from: '#1d4ed8', to: '#60a5fa', border: '#1d4ed8' }, // Blue
  handoyo: { from: '#be123c', to: '#fb7185', border: '#be123c' }, // Rose-700
  deni: { from: '#047857', to: '#6ee7b7', border: '#047857' }, // Emerald-600
  rizal: { from: '#7e22ce', to: '#d8b4fe', border: '#7e22ce' }, // Purple-700
  rifkah: { from: '#fbbf24', to: '#fef08a', border: '#fbbf24' }, // Amber-400
  toni: { from: '#eab308', to: '#fef08a', border: '#eab308' }, // Yellow
  haryadi: { from: '#6366f1', to: '#a5b4fc', border: '#6366f1' }, // Indigo
  yudi: { from: '#22d3ee', to: '#7dd3fc', border: '#22d3ee' }, // Cyan
  setiadi: { from: '#3f3f46', to: '#d1d5db', border: '#3f3f46' }, // Gray-700
  taryono: { from: '#ef4444', to: '#f87171', border: '#ef4444' }, // Red-500
  ronny: { from: '#f97316', to: '#fdba74', border: '#f97316' }, // Orange
  'indro/sujud': { from: '#6b21a8', to: '#d8b4fe', border: '#6b21a8' }, // Purple-900
  saryudi: { from: '#ea580c', to: '#fdba74', border: '#ea580c' }, // Orange-600
  arman: { from: '#c026d3', to: '#f0abfc', border: '#c026d3' }, // Fuchsia
  'udin mio': { from: '#9f1239', to: '#fb7185', border: '#9f1239' }, // Rose-900
  bowo: { from: '#4c1d95', to: '#a78bfa', border: '#4c1d95' }, // Violet-900
  orit: { from: '#fb923c', to: '#fde68a', border: '#fb923c' }, // Orange-400
  ariq: { from: '#a21caf', to: '#f472b6', border: '#a21caf' }, // Violet-800
  risa: { from: '#0ea5e9', to: '#7dd3fc', border: '#0ea5e9' }, // Cyan-600
  'direct/defvi': { from: '#d97706', to: '#facc15', border: '#d97706' }, // Amber-600
  'dani pakai yg satunya': {
    from: '#7f1d1d',
    to: '#f87171',
    border: '#7f1d1d',
  }, // Red-900
  dimas: { from: '#b91c1c', to: '#f87171', border: '#b91c1c' }, // Red-700
  'direct/yetty': { from: '#3b0764', to: '#c084fc', border: '#3b0764' }, // Purple-950
  slamet: { from: '#1c1917', to: '#d1d5db', border: '#1c1917' }, // Stone-900
  herman: { from: '#9d174d', to: '#e11d48', border: '#9d174d' }, // Rose-800
  iwan: { from: '#1e40af', to: '#93c5fd', border: '#1e40af' }, // Blue-800
  hans: { from: '#7c2d12', to: '#fed7aa', border: '#7c2d12' }, // Orange-900
  seta: { from: '#1e3a8a', to: '#3b82f6', border: '#1e3a8a' }, // Blue-900

  // NON BIS
  'aji nugraha': { from: '#f59e0b', to: '#fcd34d', border: '#f59e0b' }, // Amber
  aji: { from: '#f59e0b', to: '#fcd34d', border: '#f59e0b' }, // Amber

  indah: { from: '#ec4899', to: '#f472b6', border: '#ec4899' }, // Pink
  jefri: { from: '#10b981', to: '#6ee7b7', border: '#10b981' }, // Emerald
  husni: { from: '#0ea5e9', to: '#7dd3fc', border: '#0ea5e9' }, // Cyan
  febby: { from: '#9333ea', to: '#c084fc', border: '#9333ea' }, // Purple
  'pt. anugerah putera alfathan': {
    from: '#eab308',
    to: '#fef08a',
    border: '#eab308',
  }, // Yellow
  bigko: { from: '#6366f1', to: '#a5b4fc', border: '#6366f1' }, // Indigo
  rachmat: { from: '#ef4444', to: '#f87171', border: '#ef4444' }, // Red
  rhio: { from: '#c026d3', to: '#f0abfc', border: '#c026d3' }, // Fuchsia
  'setiadi elm': { from: '#4b5563', to: '#9ca3af', border: '#4b5563' }, // Gray
  'saefudin. bpk': { from: '#9ca3af', to: '#d1d5db', border: '#9ca3af' }, // Gray-400
  saefudin: { from: '#9ca3af', to: '#d1d5db', border: '#9ca3af' }, // Gray
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
