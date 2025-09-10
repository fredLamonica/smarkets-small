import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { CatalogoItem, TipoCatalogoItem } from '@shared/models';
import { CatalogoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { VinculoProdutoFiltro } from '../../../shared/models/fltros/vinculo-produto-filtro';

@Component({
  selector: 'app-vincular-produto-existente',
  templateUrl: './vincular-produto-existente.component.html',
  styleUrls: ['./vincular-produto-existente.component.scss'],
})
export class VincularProdutoExistenteComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  codigo: any;
  idFornecedor: number;
  vinculoProdutoFiltro: VinculoProdutoFiltro = new VinculoProdutoFiltro();
  @Input('tipo-vinculo-sub-item') tipoVinculoSubItens?: TipoCatalogoItem;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private catalogoService: CatalogoService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  vincular() {
    if (this.buscaValida) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.filtrarCatalogos().subscribe(
        (response) => {
          this.blockUI.stop();
          if (response && this.tipoVinculoSubItens === TipoCatalogoItem.Requisicao) {
            response = response.filter((item) => item.tipo === TipoCatalogoItem.Requisicao);
          } else if (response && this.tipoVinculoSubItens === TipoCatalogoItem.Catalogo) {
            response = response.filter((item) => item.tipo === TipoCatalogoItem.Catalogo);
          }

          if (response && response.length) {
            this.itensEncontrados(response);
          } else {
            this.itensNaoEncontrados();
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    }
  }

  filtrarCatalogos(): any {

    this.vinculoProdutoFiltro.idFornecedor = this.idFornecedor;
    this.vinculoProdutoFiltro.descricao = null;
    this.vinculoProdutoFiltro.idProduto = this.codigo;
    this.vinculoProdutoFiltro.tipoCatalogoItem = this.tipoVinculoSubItens;

    return this.catalogoService.filtrarCatalogosVinculoProduto(this.vinculoProdutoFiltro);
  }

  private get buscaValida(): boolean {
    if (this.codigo) {
      return true;
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
  }

  itensEncontrados(itens: Array<CatalogoItem>) {
    const itemCatalogo = itens.find((item) => item.tipo === TipoCatalogoItem.Catalogo);
    const itemRequisicao = itens.find((item) => item.tipo === TipoCatalogoItem.Requisicao);
    if (itemCatalogo) {
      this.activeModal.close({ item: itemCatalogo, quantidade: itemCatalogo.contratoCatalogoItem.loteMinimo });
    } else {
      this.activeModal.close({ item: itemRequisicao, quantidade: 1 });
    }
  }

  itensNaoEncontrados() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Nenhum produto encontrato com o código informado.`;
    modalRef.componentInstance.confirmarLabel = 'none';
    modalRef.componentInstance.cancelarLabel = 'Ok';
    modalRef.result.then((result) => { });
  }

  fechar() {
    this.activeModal.close();
  }

}
