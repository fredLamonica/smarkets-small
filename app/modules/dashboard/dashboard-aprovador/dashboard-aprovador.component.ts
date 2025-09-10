import { Component, OnInit } from '@angular/core';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, Pedido, SituacaoPedido } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from '../../../shared/providers/pedido.service';
import { Dashboard } from '../dashboard';

@Component({
  selector: 'dashboard-aprovador',
  templateUrl: './dashboard-aprovador.component.html',
  styleUrls: ['./dashboard-aprovador.component.scss'],
})
export class DashboardAprovadorComponent implements OnInit, Dashboard {

  @BlockUI() blockUI: NgBlockUI;

  settings: CustomTableSettings;
  atualizadoEm: string;
  pedidos: Array<Pedido>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private pedidoService: PedidoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.construirDashboard();
  }

  construirDashboard() {
    this.atualizadoEm = moment().toISOString();
    this.configurarTabela();
    this.obterPedidos();
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('#', 'idPedido', CustomTableColumnType.text),
        new CustomTableColumn('Comprador', 'usuario.pessoaFisica.nome', CustomTableColumnType.text),
        new CustomTableColumn('Fornecedor', 'fornecedor.razaoSocial', CustomTableColumnType.text),
        new CustomTableColumn('Situação', 'situacao', CustomTableColumnType.enum, null, null, SituacaoPedido),
        new CustomTableColumn('Data de criação', 'dataConfirmacao', CustomTableColumnType.text, 'date', 'dd/MM/yyyy HH:mm'),
        new CustomTableColumn('Última atualização', 'dataUltimaAtualizacao', CustomTableColumnType.text, 'date', 'dd/MM/yyyy HH:mm'),
        new CustomTableColumn('Valor', 'valor', CustomTableColumnType.text, 'currency', 'BRL:symbol:1.2:pt-BR'),
      ], 'none',
    );
  }

  private obterPedidos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pedidoService.filtrar('dataConfirmacao', Ordenacao.DESC, 5, 1, '').subscribe(
      (response) => {
        if (response) {
          this.pedidos = response.itens;
        } else {
          this.pedidos = new Array<Pedido>();
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
