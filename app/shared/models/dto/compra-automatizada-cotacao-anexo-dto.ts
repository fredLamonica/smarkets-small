import { Arquivo } from '../arquivo';

export class CompraAutomatizadaCotacaoAnexoDto {
  idCompraAutomatizadaCotacaoAnexo: number;
  idConfiguracaoModuloCompraAutomatizada: number;
  idUsuario: number;
  arquivo: Arquivo;
  idArquivo: number;
  permiteExcluir: boolean = true;
}
