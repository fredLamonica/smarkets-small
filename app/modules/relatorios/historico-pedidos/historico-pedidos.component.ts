import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PessoaJuridica, TipoDataRelatorioPedido, Usuario } from '@shared/models';
import { ArquivoService, AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { RelatoriosService } from '@shared/providers/relatorios.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-historico-pedidos',
  templateUrl: './historico-pedidos.component.html',
  styleUrls: ['./historico-pedidos.component.scss'],
})
export class HistoricoPedidosComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  tiposDataRelatorioPedido = TipoDataRelatorioPedido;
  opcoesTipoDataFiltro: any[];
  formFiltro: FormGroup;
  empresas: Array<PessoaJuridica>;
  empresasLoading: boolean;
  usuarioAtual: Usuario;

  constructor(
    private relatorioService: RelatoriosService,
    private arquivoService: ArquivoService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private fb: FormBuilder,
    private authService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
    this.opcoesTipoDataFiltro = Object.keys(this.tiposDataRelatorioPedido).filter(Number);
    this.construirFormularioFiltro();
    this.obterEmpresas();
  }

  downloadRelatorioPedidos() {
    if (this.validarFiltro()) {
      this.blockUI.start();
      const filtro = this.formFiltro.value;

      this.relatorioService.obterHistoricoPedidos(filtro).subscribe(
        (response) => {
          if (response.size > 0) {
            this.arquivoService.createDownloadElement(
              response,
              `Relatório de pedido ${moment(filtro.dataInicio).format('DD-MM-YYYY')} a ${moment(
                filtro.dataFim,
              ).format('DD-MM-YYYY')}.xls`,
            );
            this.blockUI.stop();
          } else {
            this.toastr.warning('Nenhum registro encontrado.');
            this.blockUI.stop();
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    }
  }

  empresaSearchFn(term: string, item: PessoaJuridica) {
    term = term.toLowerCase();
    return item.razaoSocial.toLowerCase().indexOf(term) > -1 ||
      (item.nomeFantasia && item.nomeFantasia.toLowerCase().indexOf(term) > -1) ||
      item.cnpj.toLowerCase().indexOf(term) > -1;
  }

  customSearchCompetencia(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return TipoDataRelatorioPedido[item].toLocaleLowerCase().indexOf(term) > -1;
  }

  private construirFormularioFiltro() {
    this.formFiltro = this.fb.group({
      empresas: [[this.usuarioAtual.permissaoAtual.pessoaJuridica.idTenant]],
      tipoDataRelatorio: [TipoDataRelatorioPedido['Data de criação de pedido']],
      dataInicio: [moment().add('months', -1).startOf('month').format('YYYY-MM-DD')],
      dataFim: [moment().add('months', -1).endOf('month').format('YYYY-MM-DD')],
    });
  }

  private validarFiltro(): boolean {
    const filtro = this.formFiltro.value;

    if (filtro.tipoDataRelatorio == null || filtro.tipoDataRelatorio.toString() === '') {
      this.toastr.warning('Selecione uma competência de data para o filtro');
      return false;
    }

    if (filtro.dataInicio == null || filtro.dataInicio.toString() === '') {
      this.toastr.warning('Data Inicio do filtro não pode ser vazia');
      return false;
    }
    if (filtro.dataFim == null || filtro.dataFim.toString() === '') {
      this.toastr.warning('Data Fim do filtro não pode ser vazia');
      return false;
    }

    if (filtro.dataInicio > filtro.dataFim) {
      this.toastr.warning('Data de Inicio do filtro não pode ser maior que Data do Fim');
      return false;
    }

    return true;
  }

  private obterEmpresas() {
    this.empresasLoading = true;
    this.relatorioService.obterEmpresas()
      .pipe(takeUntil(this.unsubscribe), finalize(() => this.empresasLoading = false))
      .subscribe(
        (response) => {
          this.empresas = response;
        },
      );
  }

}
