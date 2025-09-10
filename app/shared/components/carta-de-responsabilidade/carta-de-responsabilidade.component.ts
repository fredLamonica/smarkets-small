import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaResponsabilidadeFornecedor, Ordenacao } from '@shared/models';
import {
  CartaResponsabilidadeFornecedorService,
  FornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { EnviarCartaResponsabilidadeFornecedorComponent } from 'src/app/modules/fornecedor/enviar-carta-responsabilidade-fornecedor/enviar-carta-responsabilidade-fornecedor.component';
import { CartaResponsabilidadeFornecedorFiltro } from '../../models/fltros/carta-responsabilidade-fornecedor-filtro';
const MAX_SAFE_INT_32: number = 2147483647; // Esse valor é o Number.MAX_SAFE_INTEGER para int32, limitado pelo SQL Server;

@Component({
  selector: 'app-carta-de-responsabilidade',
  templateUrl: './carta-de-responsabilidade.component.html',
  styleUrls: ['./carta-de-responsabilidade.component.scss'],
})
export class CartaDeResponsabilidadeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  fornecedor;
  idPessoaJuridica;
  historicoDeCartasDeResponsabilidade: Array<CartaResponsabilidadeFornecedor> =
    new Array<CartaResponsabilidadeFornecedor>();
  itensPorPagina: number = MAX_SAFE_INT_32;
  totalPaginas: number;
  pagina: number = 1;
  ordenarPor: string = 'dataCriacao';
  load: boolean = false;
  ordenacao: Ordenacao = Ordenacao.DESC;
  cartaResponsabilidadeFornecedorFiltro: CartaResponsabilidadeFornecedorFiltro = new CartaResponsabilidadeFornecedorFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private cartaResponsabilidadeFornecedorService: CartaResponsabilidadeFornecedorService,
    private fornecedorService: FornecedorService,
  ) { }

  async ngOnInit() {
    this.idPessoaJuridica = this.route.parent.snapshot.params.id;
    this.obterFornecedor();
  }

  abrirModalDeEnvioDeCartaDeResponsabilidadeFornecedor() {
    const modalRef = this.modalService.open(EnviarCartaResponsabilidadeFornecedorComponent, {
      centered: true,
    });
    modalRef.componentInstance.fornecedor = this.fornecedor;
    modalRef.result.then((result) => {
      if (result) {
        this.obterHistoricoCartasDeResponsabilidade();
      }
    });
  }

  abrirModalDeEdicao(event: CartaResponsabilidadeFornecedor) {
    const modalRef = this.modalService.open(EnviarCartaResponsabilidadeFornecedorComponent, {
      centered: true,
    });

    modalRef.componentInstance.ViewLatter = event;
    modalRef.result.then((result) => {
      if (result) {
        this.obterHistoricoCartasDeResponsabilidade();
      }
    });
  }

  obterHistoricoCartasDeResponsabilidade() {

    this.cartaResponsabilidadeFornecedorFiltro.idFornecedor = this.fornecedor.idFornecedor;
    this.cartaResponsabilidadeFornecedorFiltro.itensPorPagina = this.itensPorPagina;
    this.cartaResponsabilidadeFornecedorFiltro.pagina = this.pagina;
    this.cartaResponsabilidadeFornecedorFiltro.itemOrdenar = this.ordenarPor;
    this.cartaResponsabilidadeFornecedorFiltro.ordenacao = this.ordenacao;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.load = true;
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
          this.load = false;
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
          this.load = false;
        },
      );
  }

  private obterFornecedor() {
    this.fornecedorService
      .ObterFornecedorRedeLocalPorIdPessoaJuridica(this.idPessoaJuridica)
      .subscribe(
        (response) => {
          if (response) {
            this.fornecedor = response;
            this.obterHistoricoCartasDeResponsabilidade();
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }
}
