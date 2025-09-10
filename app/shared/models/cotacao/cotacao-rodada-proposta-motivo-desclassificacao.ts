import { MotivoDesclassificacao } from '@shared/models/cotacao/motivo-desclassificacao';
import { CotacaoRodadaProposta, Usuario, Situacao } from '@shared/models';

export class CotacaoRodadaPropostaMotivoDesclassificacao {
  idCotacaoRodadaPropostaMotivoDesclassificacao: number;
  idMotivoDesclassificacao: number;
  motivoDesclassificacao: MotivoDesclassificacao;
  idTenant: number;
  idUsuario: number;
  usuario: Usuario;
  idCotacaoRodadaProposta: number;
  cotacaoRodadaProposta: CotacaoRodadaProposta;
  justificativa: string;
  dataInclusao: string;
  dataAlteracao: string;
  situacao: boolean;
}
