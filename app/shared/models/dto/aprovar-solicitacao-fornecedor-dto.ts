import { OrigemSolicitacao } from '../enums/origem-solicitacao.enum';

export class AprovarSolicitacaoFornecedorDto {
  codigoErp: string;
  origem: OrigemSolicitacao;

  constructor(init?: Partial<AprovarSolicitacaoFornecedorDto>) {
    Object.assign(this, init);
  }
}
