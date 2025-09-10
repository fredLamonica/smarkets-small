import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Moeda, SubItemSolicitacaoCompra, Arquivo, SubItemSolicitacaoCompraComentario, SituacaoSolicitacaoItemCompra } from '@shared/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslationLibraryService, ArquivoService, SolicitacaoCompraService, MaskService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manter-sub-item-solicitacao-compra',
  templateUrl: './manter-sub-item-solicitacao-compra.component.html',
  styleUrls: ['./manter-sub-item-solicitacao-compra.component.scss']
})
export class ManterSubItemSolicitacaoCompraComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  public Moeda = Moeda;

  public idSolicitacaoCompra: number;
  public subItemSolicitacaoCompra: SubItemSolicitacaoCompra;

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private arquivoService: ArquivoService,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private maskService: MaskService
  ) { }

  ngOnInit() {
    this.construirFormulario();
    this.preencherFormulario(this.subItemSolicitacaoCompra);
  }

  public construirFormulario() {
    this.form = this.formBuilder.group({
      idSubItemSolicitacaoCompra: [],
      idItemSolicitacaoCompra: [],
      idTenant: [],
      idSubItemSap: [],
      numeroPacoteServico: [],
      nomeServico: [],
      numeroServico: [],
      quantidade: [],
      siglaUnidadeMedida: [],
      precoBruto: [],
      precoLiquido: [],
      codigoCategoria: [],
      valorReferencia: [],
      codigoTarifaFiscal: [],
      situacao: SituacaoSolicitacaoItemCompra,
      comentarios: [new Array<SubItemSolicitacaoCompraComentario>()],
      anexos: [new Array<Arquivo>()]
    });
  }

  public preencherFormulario(subItemSolicitacaoCompra: SubItemSolicitacaoCompra) {
    this.form.patchValue(subItemSolicitacaoCompra);
    this.form.patchValue({
      quantidade: this.maskService.addDecimalMask(subItemSolicitacaoCompra.quantidade)
    });
    this.obterAnexos();
    this.form.disable();
  }

  public obterAnexos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService.obterArquivosPorSubItem(this.idSolicitacaoCompra, this.subItemSolicitacaoCompra.idItemSolicitacaoCompra, this.subItemSolicitacaoCompra.idSubItemSolicitacaoCompra).subscribe(
      response => {
        if (response)
          this.form.patchValue({ anexos: response });
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  // #region Arquivos
  public async incluirArquivos(arquivos) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      await this.solicitacaoCompraService.inserirArquivosSubItem(this.idSolicitacaoCompra, this.subItemSolicitacaoCompra.idItemSolicitacaoCompra, this.subItemSolicitacaoCompra.idSubItemSolicitacaoCompra, arquivos).toPromise();
      this.form.patchValue({
        anexos: this.form.controls.anexos.value.concat(arquivos)
      });
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public async excluirArquivo(arquivo) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService.deletarArquivoSubItem(this.idSolicitacaoCompra, this.subItemSolicitacaoCompra.idItemSolicitacaoCompra, this.subItemSolicitacaoCompra.idSubItemSolicitacaoCompra, this.form.controls.anexos.value[arquivo.index].idArquivo).subscribe(
      response => {
        let anexos = this.form.controls.anexos.value;
        anexos.splice(arquivo.index, 1);
        this.form.patchValue({
          anexos: anexos
        });
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  // #endregion

  public fechar() {
    this.activeModal.close();
  }
}
