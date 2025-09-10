import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { SituacaoFiltroContratoFornecedor } from '../../../shared/models/enums/situacao-filtro-contrato-fornecedor';
import { EnumToArrayPipe } from '../../../shared/pipes';
import { ArquivoService, AutenticacaoService, TranslationLibraryService } from '../../../shared/providers';
import { RelatoriosService } from '../../../shared/providers/relatorios.service';

@Component({
  selector: 'smk-relatorio-catalogos-fornecedor',
  templateUrl: './relatorio-catalogos-fornecedor.component.html',
  styleUrls: ['./relatorio-catalogos-fornecedor.component.scss'],
})

export class RelatorioCatalogosFornecedorComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  formFiltro: FormGroup;

  opcoesSituacaoContrato: Array<any>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public authService: AutenticacaoService,
    private relatorioService: RelatoriosService,
    private arquivoService: ArquivoService,
  ) {
    super();
  }

  ngOnInit() {
    this.opcoesSituacaoContrato = new EnumToArrayPipe().transform(SituacaoFiltroContratoFornecedor) as Array<any>;

    this.construirFormularioFiltro();
  }

  downloadRelatorio() {
    this.blockUI.start();

    if (this.formFiltro.controls.situacaoContrato.invalid) {
      this.toastr.warning(
        'O campo situação não pode ser vazio.',
      );
      this.blockUI.stop();
    } else {
      const ativos: boolean = this.formFiltro.value.situacaoContrato === SituacaoFiltroContratoFornecedor.Ativo;

      this.relatorioService
        .obtenhaRelatorioContratoCatalagoFornecedor(ativos)
        .pipe(
          takeUntil(this.unsubscribe),
          finalize(() => this.blockUI.stop()))
        .subscribe(
          (response) => {
            this.arquivoService.createDownloadElement(
              response,
              `Relatório de Contrato Catalago.xlsx`,
            );
            this.blockUI.stop();

          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  private construirFormularioFiltro() {
    this.formFiltro = this.fb.group({
      situacaoContrato: [SituacaoFiltroContratoFornecedor.Ativo, Validators.required],
    });
  }

}
