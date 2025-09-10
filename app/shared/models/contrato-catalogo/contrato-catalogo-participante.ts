import { SituacaoContratoCatalogoItem } from '@shared/models';
import { PessoaJuridica } from './../pessoa-juridica';

export class ContratoCatalogoParticipante {
  public idContratoCatalogoParticipante: number;
  public idContratoCatalogo: number;
  public idTenant: number;
  public idPessoaJuridica: number;
  public pessoaJuridica: PessoaJuridica;
  public situacao: SituacaoContratoCatalogoItem;
  public idContratoCatalogoItem: number;

  constructor(
    idContratoCatalogoParticipante: number,
    idContratoCatalogo: number,
    idTenant: number,
    idPessoaJuridica: number,
    situacao: SituacaoContratoCatalogoItem
  ) {
    this.idContratoCatalogoParticipante = idContratoCatalogoParticipante;
    this.idContratoCatalogo = idContratoCatalogo;
    this.idTenant = idTenant;
    this.idPessoaJuridica = idPessoaJuridica;
    this.situacao = situacao;
  }
}
