export default function formatCurrency(amount: number = 0): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
