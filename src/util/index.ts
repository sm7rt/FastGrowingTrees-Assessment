export function formatUSD(num: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

export const primaryRed = '#CD0100';
