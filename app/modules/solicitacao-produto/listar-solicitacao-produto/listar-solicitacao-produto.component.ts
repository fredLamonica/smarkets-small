import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ConfirmacaoComponent } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Moeda, PerfilUsuario, PessoaJuridica, SituacaoSolicitacaoProduto, SolicitacaoProduto, SolicitacaoProdutoComentario, Usuario } from '@shared/models';
import { AprovarSolicitacaoProdutoDto } from '@shared/models/dto/aprovar-solicitacao-produto-dto';
import { OrigemSolicitacao } from '@shared/models/enums/origem-solicitacao.enum';
import { AutenticacaoService, SolicitacaoProdutoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { ManterSolicitacaoProdutoComponent } from '../manter-solicitacao-produto/manter-solicitacao-produto.component';
import { ModalMotivoCancelamentoSolicitacaoProdutoComponent } from './modal-motivo-cancelamento-solicitacao-produto/modal-motivo-cancelamento-solicitacao-produto.component';
import { ModalObservacoesComponent } from './modal-observacoes/modal-observacoes.component';

@Component({
  selector: 'app-listar-solicitacao-produto',
  templateUrl: './listar-solicitacao-produto.component.html',
  styleUrls: ['./listar-solicitacao-produto.component.scss'],
})
export class ListarSolicitacaoProdutoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  tabAtiva: 'solicitacoesProduto' | 'requisicoes' | 'produtos' = 'solicitacoesProduto';
  Moeda = Moeda;
  SituacaoSolicitacaoProduto = SituacaoSolicitacaoProduto;
  solicitacoesProduto: Array<SolicitacaoProduto>;
  usuarioLogado: Usuario;
  empresaSolicitante: PessoaJuridica;
  hasActiveComents = false;

  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'DataCriacao';
  private termo: string = '';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private solicitacaoProdutoService: SolicitacaoProdutoService,
    private route: ActivatedRoute,
    private authService: AutenticacaoService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.resetPaginacao();
    this.obterSolicitacoesProduto();

    if (!this.usuarioLogado) {
      this.obterUsuarioLogado();
    }

    this.route.queryParams.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        const idSolicitacaoEdit = params['idSolicitacaoProduto'];

        if (idSolicitacaoEdit) {
          this.editarItem(idSolicitacaoEdit);
        }
      });
  }

  buscar(termo) {
    this.termo = termo;
    this.resetPaginacao();
    this.obterSolicitacoesProduto(termo);
  }

  limparFiltro() {
    this.termo = '';
    this.resetPaginacao();
    this.obterSolicitacoesProduto();
  }

  resetPaginacao() {
    this.solicitacoesProduto = new Array<SolicitacaoProduto>();
    this.pagina = 1;
  }

  onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterSolicitacoesProduto();
    }
  }

  obterSolicitacoesProduto(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoProdutoService.obterAcompanhamento(16, this.pagina, this.itemOrdenacao, termo).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.solicitacoesProduto = this.solicitacoesProduto.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
            this.totalResultados = response.total;
          } else {
            this.solicitacoesProduto = new Array<SolicitacaoProduto>();
            this.totalPaginas = 1;
            this.totalResultados = 0;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(
            this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR,
          );
          this.blockUI.stop();
        },
      );
  }

  editarItem(idSolicitacaoProduto: number) {
    this.blockUI.start();
    const modalRef = this.modalService.open(ManterSolicitacaoProdutoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    if (idSolicitacaoProduto) {
      modalRef.componentInstance.idSolicitacaoProduto = idSolicitacaoProduto;
    }

    modalRef.result.then((result) => {
      if (result) {
        this.resetPaginacao();
        this.obterSolicitacoesProduto();
      }
    });
  }

  exibeBtnAssumir(index: number): boolean {
    const user = this.authService.usuario();
    const perfil = user.permissaoAtual.perfil;
    const exibirBtnAssumir = !this.solicitacoesProduto[index].idUsuarioResponsavel &&
      this.solicitacoesProduto[index].situacao === SituacaoSolicitacaoProduto.Solicitado &&
      [PerfilUsuario.Gestor, PerfilUsuario.Administrador, PerfilUsuario.Cadastrador].includes(perfil);

    if (user.permissaoAtual.isSmarkets) {
      return exibirBtnAssumir;
    }

    if (user.permissaoAtual.pessoaJuridica.idPessoaJuridicaHoldingPai === user.permissaoAtual.pessoaJuridica.idPessoaJuridica) {
      return this.solicitacoesProduto[index].idUsuarioSolicitante !== user.permissaoAtual.idUsuario && exibirBtnAssumir;
    }

    return this.solicitacoesProduto[index].idEmpresaSolicitante !== user.permissaoAtual.pessoaJuridica.idPessoaJuridica &&
      user.permissaoAtual.pessoaJuridica.holding &&
      exibirBtnAssumir;
  }

  exibeBtnAnalise(index: number): boolean {
    const idUsuario = this.authService.usuario().idUsuario;
    const perfil = this.authService.usuario().permissaoAtual.perfil;
    const user = this.authService.usuario();

    return (
      this.solicitacoesProduto[index].idUsuarioResponsavel
      && (this.solicitacoesProduto[index].idUsuarioResponsavel === idUsuario
        || [PerfilUsuario.Gestor, PerfilUsuario.Administrador, PerfilUsuario.Cadastrador].includes(perfil))
      && (user.permissaoAtual.isSmarkets
        || user.permissaoAtual.pessoaJuridica.holding
        || user.permissaoAtual.pessoaJuridica.idPessoaJuridicaHoldingPai === user.permissaoAtual.pessoaJuridica.idPessoaJuridica)
      && this.solicitacoesProduto[index].situacao === SituacaoSolicitacaoProduto.Solicitado);
  }

  exibeBtnCancelar(index: number): boolean {
    const perfil = this.authService.usuario().permissaoAtual.perfil;

    return [SituacaoSolicitacaoProduto.Solicitado, SituacaoSolicitacaoProduto.Reprovado].includes(this.solicitacoesProduto[index].situacao) &&
      (this.isUsuarioSolicitante(index) || [PerfilUsuario.Gestor, PerfilUsuario.Administrador, PerfilUsuario.Cadastrador].includes(perfil));
  }

  onAssumirClick(index: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza de que deseja assumir essa solicitação?`;
    modalRef.result.then((result) => {
      if (result) {
        this.assumir(index);
      }
    });
  }

  assumir(index: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoProdutoService.assumir(this.solicitacoesProduto[index].idSolicitacaoProduto).pipe(
      finalize(() => this.blockUI.stop()),
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.solicitacoesProduto[index].idUsuarioResponsavel = response.idUsuarioResponsavel;
          }

          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  onAprovarClick(index: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza de que deseja aprovar essa solicitação?`;
    modalRef.result.then((result) => {
      if (result) {
        this.aprovar(index);
      }
    });
  }

  aprovar(index: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const aprovarSolicitacaoProdutoDto: AprovarSolicitacaoProdutoDto = new AprovarSolicitacaoProdutoDto({ origem: OrigemSolicitacao.MarketPlace });

    this.solicitacaoProdutoService.aprovar(this.solicitacoesProduto[index].idSolicitacaoProduto, aprovarSolicitacaoProdutoDto).pipe(
      finalize(() => this.blockUI.stop()),
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.solicitacoesProduto[index].situacao = response.situacao;
          }

          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR));
  }

  onReprovarClick(index: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza de que deseja reprovar essa solicitação?`;
    modalRef.result.then((result) => {
      if (result) {
        this.reprovar(index);
      }
    });
  }

  reprovar(index: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoProdutoService.reprovar(this.solicitacoesProduto[index].idSolicitacaoProduto).pipe(
      finalize(() => this.blockUI.stop()),
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.solicitacoesProduto[index].situacao = SituacaoSolicitacaoProduto.Reprovado;
          }

          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR));
  }

  onCancelarClick(index: number) {
    const modalRef = this.modalService.open(ModalMotivoCancelamentoSolicitacaoProdutoComponent, { centered: true, backdrop: 'static' });

    modalRef.componentInstance.idSolicitacaoProduto = this.solicitacoesProduto[index].idSolicitacaoProduto;

    modalRef.result.then((result) => {
      if (result) {
        this.solicitacoesProduto[index].situacao = SituacaoSolicitacaoProduto.Cancelado;
      }
    });
  }

  obterComentarios(index: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoProdutoService.obterComentariosPorSolicitacao(this.solicitacoesProduto[index].idSolicitacaoProduto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.solicitacoesProduto[index].comentarios = response;
            this.openModalObservacoes(index, response);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  openModalObservacoes(index: number, comentarios: Array<SolicitacaoProdutoComentario>) {
    const modalRef = this.modalService.open(ModalObservacoesComponent, {
      centered: true,
    });

    const ehSolicitadoOuReprovado =
      this.solicitacoesProduto[index].situacao === SituacaoSolicitacaoProduto.Solicitado ||
      this.solicitacoesProduto[index].situacao === SituacaoSolicitacaoProduto.Reprovado;

    modalRef.componentInstance.comentarios = comentarios;
    modalRef.componentInstance.readOnly = !ehSolicitadoOuReprovado;
    modalRef.componentInstance.idSolicitacao = this.solicitacoesProduto[index].idSolicitacaoProduto;
  }

  auditar(idSolicitacaoProduto: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.nomeClasse = 'SolicitacaoProduto';
    modalRef.componentInstance.idEntidade = idSolicitacaoProduto;
  }

  usuarioPodeIncluirSolicitacao(): boolean {
    return this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Comprador || this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Requisitante;
  }

  private obterUsuarioLogado() {
    this.blockUI.start();
    this.usuarioLogado = this.authService.usuario();
  }

  private isUsuarioSolicitante(index: number): boolean {
    return this.solicitacoesProduto[index].idUsuarioSolicitante === this.authService.usuario().idUsuario;
  }

}
