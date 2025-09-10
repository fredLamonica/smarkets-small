import { EventEmitter, Injectable, Output } from '@angular/core';
import * as signalr from '@microsoft/signalr';
import { Usuario } from '@shared/models';
import { environment } from 'src/environments/environment';
import { SituacaoNotificacao } from '../models/enums/situacao-notificacao';
import { Notificacao } from '../models/notificacao';

@Injectable()
export class NotificacaoService {

  @Output() atualizarMensagens: EventEmitter<any> = new EventEmitter();

  connection = new signalr.HubConnectionBuilder()
    .withUrl(`${environment.apiUrl}notificacao`)
    .build();

  constructor() { }

  async startHubConnection(usuarioLogado: Usuario) {
    this.connection.on('ObterNotificacoes', (message: any) => {
      this.atualizarMensagens.emit(message);
    });

    await this.connection.start();
    this.obterNotificacoes(usuarioLogado);
  }

  alterarSituacao(notificacao: Notificacao, situacaoNotificacao: SituacaoNotificacao) {
    this.connection.send('AlterarSituacaoNotificacao', notificacao, situacaoNotificacao);
  }

  private obterNotificacoes(usuarioLogado: Usuario) {
    this.connection.send('ObterNotificacoes', usuarioLogado);

    setInterval(() => {
      this.connection.send('ObterNotificacoes', usuarioLogado);
    }, 5000);
  }
}
