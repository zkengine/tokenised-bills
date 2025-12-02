type CashFlow = {
  amount: number;
  date: string;
};

function npv(cashFlows: CashFlow[], rate: number): number {
  const start = new Date(cashFlows[0].date).getTime();
  return cashFlows.reduce((acc, curr) => {
    const days =
      (new Date(curr.date).getTime() - start) / (1000 * 60 * 60 * 24);
    return acc + curr.amount / Math.pow(1 + rate, days / 365);
  }, 0);
}

function npvDerivative(cashFlows: CashFlow[], rate: number): number {
  const start = new Date(cashFlows[0].date).getTime();
  return cashFlows.reduce((acc, curr) => {
    const days =
      (new Date(curr.date).getTime() - start) / (1000 * 60 * 60 * 24);
    return (
      acc - (curr.amount * days) / 365 / Math.pow(1 + rate, days / 365 + 1)
    );
  }, 0);
}

function xirr(
  cashFlows: CashFlow[],
  guess = 0.1,
  maxIter = 100,
  tol = 1e-7
): number {
  let rate = guess;
  for (let i = 0; i < maxIter; i++) {
    const npvValue = npv(cashFlows, rate);
    const npvDeriv = npvDerivative(cashFlows, rate);
    const newRate = rate - npvValue / npvDeriv;
    if (Math.abs(newRate - rate) < tol) {
      return newRate;
    }
    rate = newRate;
  }
  throw new Error('XIRR calculation did not converge');
}

// Example usage
const cashFlows: CashFlow[] = [
  // { amount: -1000, date: '2023-01-01' },
  // { amount: -200, date: '2023-03-01' },
  // { amount: 0, date: '2023-07-01' },
  // { amount: 0, date: '2024-01-01' },
  // { amount: 25, date: '2024-02-01' },
  { amount: -4.554, date: '2024/06/13' },
  { amount: -9.9, date: '2024/06/12' },
  { amount: -8.1, date: '2024/06/12' },
  { amount: -9, date: '2024/06/13' },
  { amount: -264.69, date: '2024/06/13' },
  { amount: -1.8, date: '2024/06/13' },
  { amount: -0.9, date: '2024/06/14' },
  { amount: -9, date: '2024/06/13' },
  { amount: -2.7, date: '2024/06/12' },
  { amount: 5.06, date: '2024/09/11' },
  { amount: 11, date: '2024/07/07' },
  { amount: 9, date: '2024/06/12' },
  { amount: 10, date: '2024/07/31' },
  { amount: 294.1, date: '2024/07/07' },
  { amount: 2, date: '2025/03/13' },
  { amount: 1, date: '2024/06/27' },
  { amount: 10, date: '2024/09/11' },
  { amount: 3, date: '2024/08/09' },
];

const result = xirr(cashFlows);
console.log(`The XIRR is: ${(result * 100).toFixed(2)}%`, ':::', result);
