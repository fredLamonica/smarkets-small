import { SituacaoNotificacao } from './enums/situacao-notificacao';

export class Notificacao {
  idNotificacao: number;
  idTenant: number;
  idUsuario: number;
  titulo: string;
  mensagem: string;
  dataCriacao: Date;
  situacao: SituacaoNotificacao;
  urlRedirect: string;
}
