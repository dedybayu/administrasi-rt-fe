export const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export const formatShortRupiah = (amount: number) => {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'jt';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'rb';
  return amount.toString();
};
