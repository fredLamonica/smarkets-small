export enum Moeda {
    Real = 1,
    "Dólar Americano" = 2,
    "Libra Esterlina"= 3,
    Euro = 4,
    "Iene Japonês" = 5,
    "Franco Suiço" = 6,
    "Dólar Australiano" = 7,
    "Dólar Canadense" = 8,
    "Iuane Chinês" = 9,
    Peso = 10
}

export const MoedaLocale = new Map<Moeda, string>([
  [Moeda.Real, 'BRL'],
  [Moeda["Dólar Americano"], 'USD'],
  [Moeda["Libra Esterlina"], 'GBP'],
  [Moeda.Euro, 'EUR'],
  [Moeda["Iene Japonês"], 'JPY'],
  [Moeda["Franco Suiço"], 'CHF'],
  [Moeda["Dólar Australiano"], 'AUD'],
  [Moeda["Dólar Canadense"], 'CAD'],
  [Moeda["Iuane Chinês"], 'CNY'],
  [Moeda.Peso, 'ARS']
]);
