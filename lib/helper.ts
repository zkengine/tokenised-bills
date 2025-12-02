export function shortenAddress(value?: string, digits = 4): string {
  if (!value) return '';

  return value?.slice(0, digits + 2) + '...' + value?.slice(-digits);
}
