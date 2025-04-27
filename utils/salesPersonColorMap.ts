// src/utils/salesPersonColors.ts
export const salesPersonColorMap: Record<
  string,
  { from: string; to: string; border: string }
> = {
  // BIS

  'direct buyer': { from: '#1e3a8a', to: '#3b82f6', border: '#1e3a8a' },
  'direct bip': { from: '#1e3a8a', to: '#3b82f6', border: '#1e3a8a' },

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
  rifkah: { from: '#fbbf24', to: '#fcd34d', border: '#fbbf24' },
  toni: { from: '#eab308', to: '#fcd34d', border: '#eab308' },
  haryadi: { from: '#6366f1', to: '#a5b4fc', border: '#6366f1' },
  yudi: { from: '#22d3ee', to: '#38bdf8', border: '#22d3ee' },
  setiadi: { from: '#9ca3af', to: '#d1d5db', border: '#9ca3af' },
  taryono: { from: '#ef4444', to: '#f87171', border: '#ef4444' },
  ronny: { from: '#f97316', to: '#fdba74', border: '#f97316' },
  'indro/sujud': { from: '#9333ea', to: '#c084fc', border: '#9333ea' },
  saryudi: { from: '#f59e0b', to: '#fcd34d', border: '#f59e0b' },
  arman: { from: '#9333ea', to: '#c084fc', border: '#9333ea' },
  'udin mio': { from: '#6b7280', to: '#9ca3af', border: '#6b7280' },
  bowo: { from: '#4ade80', to: '#34d399', border: '#4ade80' },
  ariq: { from: '#9d174d', to: '#e11d48', border: '#9d174d' },
  'direct/defvi': { from: '#d97706', to: '#facc15', border: '#d97706' },
  'dani pakai yg satunya': {
    from: '#1d4ed8',
    to: '#60a5fa',
    border: '#1d4ed8',
  },
  dimas: { from: '#fbbf24', to: '#fcd34d', border: '#fbbf24' },
  'direct/yetty': { from: '#f97316', to: '#fdba74', border: '#f97316' },
  slamet: { from: '#ef4444', to: '#f87171', border: '#ef4444' },
  herman: { from: '#6366f1', to: '#a5b4fc', border: '#6366f1' },
  iwan: { from: '#22d3ee', to: '#38bdf8', border: '#22d3ee' },
  hans: { from: '#1e3a8a', to: '#3b82f6', border: '#1e3a8a' },
  seta: { from: '#9333ea', to: '#c084fc', border: '#9333ea' },

  // NON BIS
  'aji nugraha': { from: '#f59e0b', to: '#fcd34d', border: '#f59e0b' }, // Aji Nugraha = Aji
  indah: { from: '#ec4899', to: '#f472b6', border: '#ec4899' },
  //   'direct bip': { from: '#fb923c', to: '#f97316', border: '#fb923c' },  // Same as BIS
  jefri: { from: '#10b981', to: '#6ee7b7', border: '#10b981' },
  husni: { from: '#0ea5e9', to: '#7dd3fc', border: '#0ea5e9' },
  febby: { from: '#9333ea', to: '#c084fc', border: '#9333ea' },
  'pt. anugerah putera alfathan': {
    from: '#eab308',
    to: '#fcd34d',
    border: '#eab308',
  },
  bigko: { from: '#6366f1', to: '#a5b4fc', border: '#6366f1' },
  rachmat: { from: '#ef4444', to: '#f87171', border: '#ef4444' },
  //   ariq: { from: '#9d174d', to: '#e11d48', border: '#9d174d' },  // Same as BIS
  rhio: { from: '#9333ea', to: '#c084fc', border: '#9333ea' },
  'setiadi elm': { from: '#9ca3af', to: '#d1d5db', border: '#9ca3af' },
  'saefudin. bpk': { from: '#4b5563', to: '#9ca3af', border: '#4b5563' },
  // Add additional mappings as necessary for all the unique names
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
