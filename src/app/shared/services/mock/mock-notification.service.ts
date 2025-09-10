import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockNotificationService {
  private notificacoesSubject = new BehaviorSubject<any[]>([]);
  private qtdNaoLidasSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.initializeNotifications();
  }

  private initializeNotifications() {
    const mockNotificacoes = [
      {
        idNotificacao: 1,
        titulo: 'Pedido Aprovado',
        mensagem: 'Seu pedido #12345 foi aprovado e está sendo processado',
        dataCriacao: new Date(),
        situacao: 1 // Não lida
      },
      {
        idNotificacao: 2,
        titulo: 'Nova Cotação Disponível',
        mensagem: 'Nova cotação #67890 disponível para análise',
        dataCriacao: new Date(Date.now() - 3600000), // 1 hora atrás
        situacao: 1 // Não lida
      },
      {
        idNotificacao: 3,
        titulo: 'Contrato Vencendo',
        mensagem: 'O contrato CT-001 vence em 30 dias',
        dataCriacao: new Date(Date.now() - 86400000), // 1 dia atrás
        situacao: 2 // Lida
      },
      {
        idNotificacao: 4,
        titulo: 'Fornecedor Homologado',
        mensagem: 'Fornecedor ABC LTDA foi homologado com sucesso',
        dataCriacao: new Date(Date.now() - 172800000), // 2 dias atrás
        situacao: 2 // Lida
      }
    ];

    this.notificacoesSubject.next(mockNotificacoes);
    this.updateQtdNaoLidas(mockNotificacoes);
  }

  getNotificacoes(): Observable<any[]> {
    return this.notificacoesSubject.asObservable();
  }

  getQtdNaoLidas(): Observable<number> {
    return this.qtdNaoLidasSubject.asObservable();
  }

  marcarComoLida(idNotificacao: number): Observable<any> {
    const notificacoes = this.notificacoesSubject.value;
    const notificacao = notificacoes.find(n => n.idNotificacao === idNotificacao);
    
    if (notificacao) {
      notificacao.situacao = 2; // Lida
      this.notificacoesSubject.next(notificacoes);
      this.updateQtdNaoLidas(notificacoes);
    }

    return of({ success: true }).pipe(delay(300));
  }

  private updateQtdNaoLidas(notificacoes: any[]) {
    const qtdNaoLidas = notificacoes.filter(n => n.situacao === 1).length;
    this.qtdNaoLidasSubject.next(qtdNaoLidas);
  }

  // Simular recebimento de nova notificação
  adicionarNotificacao(notificacao: any) {
    const notificacoes = this.notificacoesSubject.value;
    notificacoes.unshift({
      ...notificacao,
      idNotificacao: Math.max(...notificacoes.map(n => n.idNotificacao)) + 1,
      dataCriacao: new Date(),
      situacao: 1
    });
    
    this.notificacoesSubject.next(notificacoes);
    this.updateQtdNaoLidas(notificacoes);
  }
}