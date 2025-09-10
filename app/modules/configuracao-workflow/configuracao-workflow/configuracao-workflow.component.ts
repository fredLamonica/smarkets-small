import { ListarMotivoDesclassificacaoComponent } from './../motivo-desclassificacao/listar-motivo-desclassificacao/listar-motivo-desclassificacao.component';
import { ListarTiposRequisicaoComponent } from './../tipo-requisicao/listar-tipos-requisicao/listar-tipos-requisicao.component';
import { OperacoesFiltro } from './../../../shared/utils/operacoes-filtro';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ListarSlaComponent } from '../sla/listar-sla/listar-sla.component';
import { ListarTiposPedidoComponent } from '../tipo-pedido/listar-tipos-pedido/listar-tipos-pedido.component';
import { AutenticacaoService } from '@shared/providers';
import { Usuario } from '@shared/models';

@Component({
  selector: 'configuracao-workflow',
  templateUrl: './configuracao-workflow.component.html',
  styleUrls: ['./configuracao-workflow.component.scss']
})
export class ConfiguracaoWorkflowComponent implements OnInit {
  @ViewChild('tipoRequisicao') tipoRequisicaoComponent: ListarTiposRequisicaoComponent;
  @ViewChild('sla') slaComponent: ListarSlaComponent;
  @ViewChild('tipoPedido') tipoPedidoComponent: ListarTiposPedidoComponent;
  @ViewChild('motivoDesclassificacao')
  motivoDesclassificacaoComponent: ListarMotivoDesclassificacaoComponent;

  public termo: string;
  public habilitarModuloCotacao: boolean = false;

  public tabAtiva: 'tipo-requisicao' | 'sla' | 'tipo-pedido' | 'motivo-desclassificacao';

  get componenteAtivo(): OperacoesFiltro {
    switch (this.tabAtiva) {
      case 'tipo-requisicao': {
        return this.tipoRequisicaoComponent;
      }
      case 'sla': {
        return this.slaComponent;
      }
      case 'tipo-pedido': {
        return this.tipoPedidoComponent;
      }
      case 'motivo-desclassificacao': {
        return this.motivoDesclassificacaoComponent;
      }
    }
  }

  constructor(private authService: AutenticacaoService) {}

  ngOnInit() {
    let usuario: Usuario = this.authService.usuario();
    this.habilitarModuloCotacao = usuario.permissaoAtual.pessoaJuridica.habilitarModuloCotacao;

    if (this.habilitarModuloCotacao) {
      this.tabAtiva = 'tipo-requisicao';
    } else {
      this.tabAtiva = 'tipo-pedido';
    }
  }

  public buscar(termo) {
    this.termo = termo;
    this.componenteAtivo.ResetPagination();
    this.componenteAtivo.Hydrate(this.termo);
  }

  public onScroll() {
    this.componenteAtivo.onScroll(this.termo);
  }

  public limparFiltro() {
    this.termo = '';
    this.componenteAtivo.ResetPagination();
    this.componenteAtivo.Hydrate(this.termo);
  }

  public selectTab(aba: 'tipo-requisicao' | 'sla' | 'tipo-pedido' | 'motivo-desclassificacao') {
    if (!aba) this.tabAtiva = 'tipo-requisicao';
    else this.tabAtiva = aba;
  }
}
