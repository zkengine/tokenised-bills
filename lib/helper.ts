export function shortenAddress(value?: string, digits = 4): string {
  if (!value) return '';

  return value?.slice(0, digits + 2) + '...' + value?.slice(-digits);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (err: any, keepOriginal: boolean = false) => {
  if (!err) return undefined;

  if (
    err?.includes('InsufficientFunds') ||
    err?.message?.includes('InsufficientFunds')
  ) {
    return 'You have insufficient funds to execute the transaction2.';
  } else if (
    err?.includes('insufficient funds') ||
    err?.message?.includes('insufficient funds')
  ) {
    return 'Insufficient balance to cover the gas fee.';
  } else if (
    err?.includes('User rejected') ||
    err?.message?.includes('User rejected')
  ) {
    return 'You have rejected the transaction.';
  } else {
    return keepOriginal ? err : 'Something went wrong!';
  }
};
