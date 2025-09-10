export enum TipoEndereco {
  "Institucional"   = 1,
  "Cobrança"        = 2,
  "Entrega"         = 3,
  "Faturamento"     = 4
}

export const TipoEnderecoLabel = new Map<number,string>([
  [1, "Institucional"],
  [2, "Cobrança"],
  [3,"Entrega"],
  [4,"Faturamento"]
  ]);