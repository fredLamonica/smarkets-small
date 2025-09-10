import { PeriodoFiltroDashboard } from '../enums/periodo-filtro-dashboard';

export class IndicadorGmvFast {
  totalPedidosEmCarrinho: number;
  valorTotalPedidosCarrinho: number;
  totalPedidosConcluidos: number;
  valorTotalPedidosConcluidos: number;
  totalPedidosCancelados: number;
  valorTotalPedidosCancelados: number;
  totalPedidos: number;
  valorTotalPedidos: number;
  periodo: PeriodoFiltroDashboard;
}
