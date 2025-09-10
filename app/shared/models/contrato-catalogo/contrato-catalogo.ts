import { Fornecedor } from '@shared/models';
import { SituacaoContratoCatalogo } from "../enums/situacao-contrato-catalogo";
import { TipoContratoCatalogo } from '../enums/tipo-contrato-catalogo';
import { Estado } from "../estado";
import { ContratoCatalogoItem } from "./contrato-catalogo-item";
import { ContratoCatalogoParticipante } from "./contrato-catalogo-participante";

export class ContratoCatalogo {
  public idContratoCatalogo: number;
  public idTenant: number;
  public codigo: string;
  public titulo: string;
  public objeto: string
  public idUsuarioGestor: number;
  public idUsuarioResponsavel: number;
  public idFornecedor: number;
  public fornecedor: Fornecedor;
  public dataInicio: string;
  public dataFim: string;
  public dataFimTemporaria: string;
  public permiteColaboracao: boolean;
  public situacao: SituacaoContratoCatalogo;
  public itens: Array<ContratoCatalogoItem>;
  public estadosAtendimento: Array<Estado>;
  public empresasParticipantes: Array<ContratoCatalogoParticipante>;
  public quantidadeItens: number;
  public quantidadeParticipantes: number;
  public idContratoCatalogoPai: number;
  public ordemClone: number;
  public tipoContratoCatalogo: TipoContratoCatalogo;
  public saldoDisponivel: number;
  public saldoTotal: number;
  public saldoTemporario: number;
  public motivoRecusa: string;
  public validadeContrato: string;
  public dataFimSeller: string;

  constructor(init?: Partial<ContratoCatalogo>) {
    Object.assign(this, init);
  }
}

