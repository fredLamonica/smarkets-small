import { OrigemSolicitacao } from '../enums/origem-solicitacao.enum';

export class AprovarSolicitacaoProdutoDto {
  codigoErp: string;
  origem: OrigemSolicitacao;

  constructor(init?: Partial<AprovarSolicitacaoProdutoDto>) {
    Object.assign(this, init);
  }

}
