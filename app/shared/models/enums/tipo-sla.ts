export enum TipoSla {
  Pedido        = 1,
  "Solicitação" = 2,
  "Cotação"     = 3,
  "Requisição"  = 4
}

export const TipoSlaLabel = new Map<number, string>([
  [1, "Pedido"],
  [2, "Solicitação"],
  [3, "Cotação"],
  [4 ,"Requisição"]
]);
