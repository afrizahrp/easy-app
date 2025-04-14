export function getStatusColor(status: string) {
  // if (status.toLowerCase() === 'active') {
  if (status === 'Active' || status === 'PAID') {
    return 'bg-green-600';
  } else {
    return 'bg-gray-400';
  }
}

export function getDisplayStatus(showedStatus: string): string {
  if (showedStatus === 'SHOW') {
    return 'Shown';
  } else {
    return 'Hidden';
  }
}
