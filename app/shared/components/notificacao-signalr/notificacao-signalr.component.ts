import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../../shared/models';
import { SituacaoNotificacao } from '../../../shared/models/enums/situacao-notificacao';
import { Notificacao } from '../../../shared/models/notificacao';
import { AutenticacaoService } from '../../../shared/providers';
import { NotificacaoService } from '../../../shared/providers/notificacao.service';

@Component({
  selector: 'smk-app-notificacao',
  templateUrl: './notificacao-signalr.component.html',
  styleUrls: ['./notificacao-signalr.component.scss'],
})
export class NotificacaoSignalRComponent implements OnInit {
  usuarioLogado: Usuario;
  notificacoes: Array<Notificacao> = new Array<Notificacao>();
  qtdNaoLidas: number = 0;

  constructor(
    private autenticacaoService: AutenticacaoService,
    private notificacaoService: NotificacaoService,
    private router: Router,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    if (!this.usuarioLogado) {
      this.obterUsuarioLogado();
      // this.startHubConnection();
    }
  }

  async startHubConnection() {
    this.notificacaoService.startHubConnection(this.usuarioLogado);
    this.atualizarNotificacao();
  }

  atualizarNotificacao() {
    this.notificacaoService.atualizarMensagens.subscribe((notificacoes: Array<Notificacao>) => {
      this.notificacoes = notificacoes;
      let oldValue = this.qtdNaoLidas;
      this.qtdNaoLidas = this.notificacoes.filter((notificacao) => notificacao.situacao == SituacaoNotificacao.NaoLida).length;
      if (oldValue !== this.qtdNaoLidas) {
        this.ref.detectChanges();
      }
    });
  }

  redirect(urlRedirect: string) {
    this.router.navigate([urlRedirect]);
  }

  selectNotification(event: any, notificacao: Notificacao) {
    event.preventDefault();
    if (notificacao.situacao === SituacaoNotificacao.NaoLida) {
      this.notificacaoService.alterarSituacao(notificacao, SituacaoNotificacao.Lida);
    }

    if (notificacao.urlRedirect) {
      this.redirect(notificacao.urlRedirect);
    }
  }

  naoLida(notificacao: Notificacao) {
    return notificacao.situacao === SituacaoNotificacao.NaoLida;
  }

  private obterUsuarioLogado() {
    this.usuarioLogado = this.autenticacaoService.usuario();
  }
}
