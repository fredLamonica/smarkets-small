import { IndicadorFornecedorHomologadoCategoriaDto } from './indicadores-fornecedor-homologado-categoria';

export class IndicadoresFornecedorDto {
  qtdTotalFornecedores: number;
  qtdTotalFornecedoresHomologados: number;
  qtdTotalFornecedoresNaoHomologados: number;
  qtdTotalTotalFornecedoresInteressados: number;
  qtdTotalFornecedoresComCategoria: number;

  indicadorFornecedorHomologadoCategoriaDto: IndicadorFornecedorHomologadoCategoriaDto[];
}
