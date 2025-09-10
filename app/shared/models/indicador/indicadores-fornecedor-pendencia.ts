import { PendenciasPorHorasDto } from './indicadores-fornecedor-pendencia-por-hora';

export class IndicadoresPendenciaDto {
  pendentes: number;
  resolvidas: number;
  pendenciasPorHorasDto: Array<PendenciasPorHorasDto>;
}
