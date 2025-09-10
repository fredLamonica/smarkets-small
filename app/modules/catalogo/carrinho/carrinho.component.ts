import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CarrinhoResumo, Usuario } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { CarrinhoService } from '../../../shared/providers/carrinho.service';
import { ResumoCarrinhoComponent } from '../../container/resumo-carrinho/resumo-carrinho.component';
import { CarrinhoRegularizacaoComponent } from '../carrinho-regularizacao/carrinho-regularizacao.component';
import { CarrinhoRequisicaoComponent } from '../carrinho-requisicao/carrinho-requisicao.component';
import { TabCarrinho } from '../models/tab-carrinho.enum';
import { CarrinhoCatalogoComponent } from './../carrinho-catalogo/carrinho-catalogo.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss'],
})
export class CarrinhoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild(CarrinhoCatalogoComponent) carrinhoCatalogo: CarrinhoCatalogoComponent;
  @ViewChild(CarrinhoRequisicaoComponent) carrinhoRequisicao: CarrinhoRequisicaoComponent;
  @ViewChild(CarrinhoRegularizacaoComponent) carrinhoRegulazacao: CarrinhoRegularizacaoComponent;

  tabCarrinho = TabCarrinho;
  tabAtiva: TabCarrinho = TabCarrinho.catalogo;
  resumo: CarrinhoResumo;
  usuarioAtual: Usuario;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private router: Router,
    private carrinhoService: CarrinhoService,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() {
    ResumoCarrinhoComponent.carrinhoAtualizadoObserver.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((resumoCarrinho) => this.resumo = resumoCarrinho);

    this.usuarioAtual = this.authService.usuario();
    this.obterResumo();
  }

  obterResumo() {
    setTimeout(() => ResumoCarrinhoComponent.atualizarCarrinho.next(), 100);
  }

  buscar(termo) {
    this.router.navigate(['/marketplace'], { queryParams: { termo: termo } });
  }

  continuarComprando() {
    this.router.navigate(['/marketplace']);
  }

  podeEsvaizarCarrinho(): boolean {
    return this.resumo &&
      ((this.resumo.quantidadeItensCatalogo && this.tabAtiva === TabCarrinho.catalogo) ||
        (this.resumo.quantidadeItensRequisicao && this.tabAtiva === TabCarrinho.requisicao) ||
        (this.resumo.quantidadeItensRegularizacao && this.tabAtiva === TabCarrinho.regularizacao));
  }

  solicitarEsvaziarCarrinho() {
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => {
        switch (this.tabAtiva) {
          case TabCarrinho.catalogo:
            this.esvaziarCatalogo();
            break;

          case TabCarrinho.requisicao:
            this.esvaziarRequisicao();
            break;

          case TabCarrinho.regularizacao:
            this.esvaziarRegularizacao();
            break;
        }
      },
      (reason) => { },
    );
  }

  onTabSelected(tabSelecionada: TabCarrinho) {
    this.tabAtiva = tabSelecionada;
  }

  exibirRequisicoes(): boolean {
    if (this.usuarioAtual) {
      return this.usuarioAtual.permissaoAtual.pessoaJuridica.habilitarModuloCotacao;
    }

    return false;
  }

  exibirRegularizacoes(): boolean {
    return this.usuarioAtual && this.usuarioAtual.permissaoAtual.pessoaJuridica.habilitarRegularizacao;
  }

  private esvaziarCatalogo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.carrinhoService.esvaziarCatalogo().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            ResumoCarrinhoComponent.atualizarCarrinho.next();
            this.carrinhoCatalogo.esvaziarCarrinho();
            this.obterResumo();
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private esvaziarRequisicao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.carrinhoService.esvaziarRequisicao().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            ResumoCarrinhoComponent.atualizarCarrinho.next();
            this.carrinhoRequisicao.esvaziarCarrinho();
            this.obterResumo();
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private esvaziarRegularizacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.carrinhoService.esvaziarRegularizacao().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            ResumoCarrinhoComponent.atualizarCarrinho.next();
            this.carrinhoRegulazacao.esvaziarCarrinho();
            this.obterResumo();
          }

          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

}
