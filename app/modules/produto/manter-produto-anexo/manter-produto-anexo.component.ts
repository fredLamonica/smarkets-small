import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

import { Arquivo, CustomTableSettings, CustomTableColumnType, CustomTableColumn } from '@shared/models';
import { ProdutoService, ArquivoService, TranslationLibraryService } from '@shared/providers';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'manter-produto-anexo',
  templateUrl: './manter-produto-anexo.component.html',
  styleUrls: ['./manter-produto-anexo.component.scss']
})
export class ManterProdutoAnexoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input("id-produto") idProduto: number; 
  @Input("anexos") anexos: Array<Arquivo>;
  @Output() atualizacao = new EventEmitter();

  public anexosSelecionados: Array<Arquivo>;

  public settings: CustomTableSettings = new CustomTableSettings(
    [
      new CustomTableColumn("#", "idArquivo", CustomTableColumnType.text, null, null),
      new CustomTableColumn("Anexo", "nome", CustomTableColumnType.text, null, null)
    ], "check"
  );

  constructor(
    private translationLibrary: TranslationLibraryService,
    private produtoService: ProdutoService,
    private arquivoService: ArquivoService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  //#region Inclusao
  public async arquivosSelecionados(arquivos: Array<Arquivo>) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING)
      for(let i = 0; i < arquivos.length; i++) { 
        arquivos[i] = await this.inserirArquivo(arquivos[i]);
      }
      this.inserirProdutoArquivos(arquivos);
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  private inserirProdutoArquivos(arquivos: Array<Arquivo>) {
    this.produtoService.inserirArquivos(this.idProduto, arquivos).subscribe(
      response => {
        if(response) {
          this.anexos = this.anexos.concat(arquivos);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private inserirArquivo(arquivo: Arquivo): Promise<Arquivo> { 
    return this.arquivoService.inserir(arquivo).toPromise();
  }
  //#endregion

  //#region Exclusão
  public selecaoExclusao(arquivos: Array<Arquivo>) {
    this.anexosSelecionados = arquivos;
  }

  public solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(), 
      reason => {}
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.deletarArquivos(this.idProduto, this.anexosSelecionados).subscribe(
      response => {
        let ids = this.anexosSelecionados.map(a => { return a.idArquivo });
        this.anexos = this.anexos.filter(a => !ids.find(i => i == a.idArquivo));
        this.atualizacao.emit(this.anexos);
        this.anexosSelecionados = new Array<Arquivo>();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  //#endregion

  //#region Downloads
  public download(){
    for (var i = 0; i < this.anexosSelecionados.length; i++) {
      <any>window.open(this.anexosSelecionados[i].url);
    }
  }
  //#endregion
}
