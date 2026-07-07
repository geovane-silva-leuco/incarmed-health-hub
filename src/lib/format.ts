export const formatBRL = (v: number): string =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

export const formatBRLLong = (v: number): string =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 5, maximumFractionDigits: 5 });

export const formatNumber = (v: number): string => v.toLocaleString("pt-BR");
