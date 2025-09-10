import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CartaResponsabilidadeFornecedor, Ordenacao, SituacaoCartaResponsabilidadeFornecedor
} from '@shared/models';
import { FornecedorInteressado } from '@shared/models/fornecedor-interessado';
import {
  CartaResponsabilidadeFornecedorService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CartaResponsabilidadeFornecedorFiltro } from '../../../../shared/models/fltros/carta-responsabilidade-fornecedor-filtro';
import { EnviarCartaResponsabilidadeFornecedorComponent } from '../../enviar-carta-responsabilidade-fornecedor/enviar-carta-responsabilidade-fornecedor.component';

@Component({
  selector: 'historico-cartas-responsabilidade',
  templateUrl: './historico-cartas-responsabilidade.component.html',
  styleUrls: ['./historico-cartas-responsabilidade.component.scss'],
})
export class HistoricoCartasResponsabilidadeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() fornecedor: FornecedorInteressado;

  // Lista de carta de responsabilidadde
  historicoDeCartasDeResponsabilidade: Array<CartaResponsabilidadeFornecedor> = new Array<
    CartaResponsabilidadeFornecedor
  >();

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenarPor: string = 'dataCriacao';
  ordenacao: Ordenacao = Ordenacao.DESC;
  cartaResponsabilidadeFornecedorFiltro: CartaResponsabilidadeFornecedorFiltro = new CartaResponsabilidadeFornecedorFiltro();

  SituacaoCartaDeResponsabilidade = SituacaoCartaResponsabilidadeFornecedor;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cartaResponsabilidadeFornecedorService: CartaResponsabilidadeFornecedorService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.obterHistoricoCartasDeResponsabilidade();
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterHistoricoCartasDeResponsabilidade();
  }

  obterHistoricoCartasDeResponsabilidade() {

    this.cartaResponsabilidadeFornecedorFiltro.idFornecedor = this.fornecedor.idFornecedor;
    this.cartaResponsabilidadeFornecedorFiltro.itensPorPagina = this.itensPorPagina;
    this.cartaResponsabilidadeFornecedorFiltro.pagina = this.pagina;
    this.cartaResponsabilidadeFornecedorFiltro.itemOrdenar = this.ordenarPor;
    this.cartaResponsabilidadeFornecedorFiltro.ordenacao = this.ordenacao;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cartaResponsabilidadeFornecedorService
      .obterHistorico(this.cartaResponsabilidadeFornecedorFiltro)
      .subscribe(
        (response) => {
          if (response) {
            this.historicoDeCartasDeResponsabilidade = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.historicoDeCartasDeResponsabilidade = new Array<CartaResponsabilidadeFornecedor>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  visualizarCarta(carta) {
    const modalRef = this.modalService.open(EnviarCartaResponsabilidadeFornecedorComponent, {
      centered: true,
    });
    modalRef.componentInstance.form.patchValue(carta);
  }
}
