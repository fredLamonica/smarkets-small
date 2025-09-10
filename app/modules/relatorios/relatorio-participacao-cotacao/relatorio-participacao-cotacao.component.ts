import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { PessoaJuridica } from '@shared/models';
import {
  ArquivoService,
  AutenticacaoService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { RelatoriosService } from '@shared/providers/relatorios.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-relatorio-participacao-cotacao',
  templateUrl: './relatorio-participacao-cotacao.component.html',
  styleUrls: [],
})
export class RelatorioParticipacaoCotacaoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  formFiltro: FormGroup;
  clientes: Array<PessoaJuridica>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private pessoaJuridicaService: PessoaJuridicaService,
    public authService: AutenticacaoService,
    private relatorioService: RelatoriosService,
    private arquivoService: ArquivoService,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormularioFiltro();
    this.obterClientes();
  }

  downloadRelatorio() {
    this.blockUI.start();
    const form = this.formFiltro.value;
    const idTenant = (form.cliente === undefined || form.cliente == null) ? '' : form.cliente.idTenant;
    this.relatorioService
      .ObterRelatorioParticipacaoCotacao(form.dataInicio, form.dataFim, idTenant).pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response.size > 0) {
            this.arquivoService.createDownloadElement(
              response,
              `Relatório de Participação em Cotação de ${form.dataInicio} até ${form.dataFim}.xlsx`,
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

  obterClientes() {
    this.pessoaJuridicaService
      .ObterCompradores()
      .subscribe((response) => {
        if (response) {
          this.clientes = response;
        }
      });
  }

  private construirFormularioFiltro() {
    this.formFiltro = this.fb.group({
      dataInicio: [moment().startOf('month').format('YYYY-MM-DD')],
      dataFim: [moment().format('YYYY-MM-DD')],
      cliente: this.fb.control(undefined),
    });
  }
}
