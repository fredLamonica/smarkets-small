import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { CondicaoPagamento, CustomTableSettings, Ordenacao, Situacao, Usuario } from '@shared/models';
import { AutenticacaoService, CondicaoPagamentoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CondicaoPagamentoFiltro } from '../../../shared/models/fltros/condicao-pagamento-filtro';
import { ManterCondicaoPagamentoComponent } from '../manter-condicao-pagamento/manter-condicao-pagamento.component';

@Component({
  selector: 'app-listar-condicoes-pagamento',
  templateUrl: './listar-condicoes-pagamento.component.html',
  styleUrls: ['./listar-condicoes-pagamento.component.scss'],
})
export class ListarCondicoesPagamentoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;

  condicoesPagamento: Array<CondicaoPagamento>;
  Situacao = Situacao;
  usuarioLogado: Usuario;

  settings: CustomTableSettings;
  selecionadas: Array<CondicaoPagamento>;

  registrosPorPagina: number = 16;
  pagina: number = 1;
  totalResultados: number;
  totalPaginas: number = 0;
  ordenarPor: string = 'idCondicaoPagamento';
  ordenacao: Ordenacao = Ordenacao.DESC;
  idTenantUsuario: number;
  condicaoPagamentoFiltro: CondicaoPagamentoFiltro = new CondicaoPagamentoFiltro();
  private termo: string = '';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private authService: AutenticacaoService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.resetPaginacao();
    this.obterCondicoesPagamento();

    if (!this.usuarioLogado) {
      this.obterUsuarioLogado();
    }

    this.route.queryParams.subscribe((params) => {
      const idCondicaoEdit = params['idCondicaoPagamento'];
      if (idCondicaoEdit) {
        this.editarItem(idCondicaoEdit);
      }
    });
  }

  editarItem(idCondicaoPagamento?: number) {
    const modalRef = this.modalService.open(ManterCondicaoPagamentoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    if (idCondicaoPagamento) {
      modalRef.componentInstance.idCondicaoPagamento = idCondicaoPagamento;
    }

    modalRef.result.then((result) => {
      if (result) {
        this.resetPaginacao();
        this.obterCondicoesPagamento();
      }
    });
  }

  buscar(termo) {
    this.termo = termo;
    this.resetPaginacao();
    this.obterCondicoesPagamento(termo);
  }

  onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterCondicoesPagamento();
    }
  }

  limparFiltro() {
    this.termo = '';
    this.resetPaginacao();
    this.obterCondicoesPagamento();
  }

  resetPaginacao() {
    this.condicoesPagamento = new Array<CondicaoPagamento>();
    this.pagina = 1;
  }

  // CALLBACK de ordenação
  ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.obterCondicoesPagamento();
  }

  obter(termo?: string) {
    this.termo = termo;
    this.obterCondicoesPagamento(this.termo);
  }

  onAuditoriaClick(idCondicaoPagamento: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'CondicaoPagamento';
    modalRef.componentInstance.idEntidade = idCondicaoPagamento;
  }

  onExcluirClick(idCondicaoPagamento: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(idCondicaoPagamento),
        (reason) => { });
  }

  selecao(condicoesPagamento: Array<CondicaoPagamento>) {
    this.selecionadas = condicoesPagamento;
  }

  // #region paginacao

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterCondicoesPagamento(this.form.value.termo);
  }

  private obterUsuarioLogado() {
    this.blockUI.start();
    this.usuarioLogado = this.authService.usuario();
    this.idTenantUsuario = this.usuarioLogado.permissaoAtual.idTenant;
  }

  private obterCondicoesPagamento(termo: string = '') {

    this.condicaoPagamentoFiltro.termo = termo;
    this.condicaoPagamentoFiltro.itemOrdenar = this.ordenarPor;
    this.condicaoPagamentoFiltro.pagina = this.pagina;
    this.condicaoPagamentoFiltro.ordenacao = this.ordenacao;
    this.condicaoPagamentoFiltro.itensPorPagina = this.registrosPorPagina;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.condicaoPagamentoService.filtrar(this.condicaoPagamentoFiltro).subscribe(
      (response) => {
        if (response) {
          this.condicoesPagamento = this.condicoesPagamento.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.condicoesPagamento = new Array<CondicaoPagamento>();
          this.totalPaginas = 1;
          this.totalResultados = 0;
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(
          this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private excluir(idCondicaoPagamento) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.condicaoPagamentoService
      .excluir(idCondicaoPagamento)
      .subscribe(
        (resultado) => {
          if (resultado) {
            this.resetPaginacao();
            this.obter('');
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        }, (responseError) => {
          this.blockUI.stop();
          if (responseError.status === 400) {
            this.toastr.warning(responseError.error);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        },
      );
  }
  //#endregion

}
