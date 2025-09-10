import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockNotificationService } from '../../services/mock/mock-notification.service';

@Component({
  selector: 'smk-app-notificacao',
  templateUrl: './notificacao-signalr.component.html',
  styleUrls: ['./notificacao-signalr.component.scss']
})
export class NotificacaoSignalrComponent implements OnInit {
  notificacoes: any[] = [];
  qtdNaoLidas = 0;

  constructor(
    private router: Router,
    private mockNotificationService: MockNotificationService
  ) {}

  ngOnInit() {
    this.loadNotificacoes();
    this.loadQtdNaoLidas();
  }

  private loadNotificacoes() {
    this.mockNotificationService.getNotificacoes().subscribe(
      notificacoes => {
        this.notificacoes = notificacoes.slice(0, 5); // Mostrar apenas as 5 mais recentes
      }
    );
  }

  private loadQtdNaoLidas() {
    this.mockNotificationService.getQtdNaoLidas().subscribe(
      qtd => {
        this.qtdNaoLidas = qtd;
      }
    );
  }

  selectNotification(event: Event, notificacao: any) {
    event.stopPropagation();
    
    if (notificacao.situacao === 1) {
      this.mockNotificationService.marcarComoLida(notificacao.idNotificacao).subscribe();
    }

    // Simular navegação baseada no tipo de notificação
    if (notificacao.titulo.includes('Pedido')) {
      this.router.navigate(['/pedidos']);
    } else if (notificacao.titulo.includes('Cotação')) {
      this.router.navigate(['/cotacoes']);
    } else if (notificacao.titulo.includes('Contrato')) {
      this.router.navigate(['/contratos-catalogo']);
    }
  }

  naoLida(notificacao: any): boolean {
    return notificacao.situacao === 1;
  }
}