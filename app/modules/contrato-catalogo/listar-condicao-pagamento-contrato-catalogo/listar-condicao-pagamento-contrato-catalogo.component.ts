import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { CondicaoPagamento, ContratoCatalogoCondicaoPagamento, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, Situacao } from '@shared/models';
import { AutenticacaoService, CondicaoPagamentoService, TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ContratoCatalogoCondicaoPagamentoFiltro } from '../../../shared/models/fltros/contrato-catalogo-condicao-pagamento-filtro';
import { ContratoCatalogoService } from '../../../shared/providers/contrato-catalogo.service';

@Component({
  selector: 'listar-condicao-pagamento-contrato-catalogo',
  templateUrl: './listar-condicao-pagamento-contrato-catalogo.component.html',
  styleUrls: ['./listar-condicao-pagamento-contrato-catalogo.component.scss'],
})
export class ListarCondicaoPagamentoContratoCatalogoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input('id-contrato') idContrato: number;

  form: FormGroup;
  condicoesPagamentoSelecionaveis = new Array<CondicaoPagamento>();
  condicoesPagamento = new Array<CondicaoPagamento>();
  selecionadas = new Array<ContratoCatalogoCondicaoPagamento>();
  Situacao = Situacao;

  contratoCatalogoCondicoesPagamentos = new Array<ContratoCatalogoCondicaoPagamento>();
  @Output() possuiAprovacao: EventEmitter<boolean> = new EventEmitter();

  settings: CustomTableSettings;
  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenacao: Ordenacao = Ordenacao.ASC;
  itemOrdenar: string = 'cccp.IdContratoCatalogoCondicaoPagamento';
  contratoCatalogoCondicaoPagamentoFiltro: ContratoCatalogoCondicaoPagamentoFiltro = new ContratoCatalogoCondicaoPagamentoFiltro();

  constructor(
    private formBuilder: FormBuilder,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private modalService: NgbModal,
    private autenticacaoService: AutenticacaoService,
    private contratoCatalogoService: ContratoCatalogoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private errorService: ErrorService,
  ) { }

  ngOnInit() {
    this.construirFormulario();
    this.obterCondicoesPagamento();
    this.construirTabelas();
    this.obterContratoCatalogoCondicoesPagamento();
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn(
          'Descrição',
          'condicaoPagamento.descricao',
          CustomTableColumnType.text,
        ),
        new CustomTableColumn(
          'Situação',
          'situacao',
          CustomTableColumnType.enum,
          null,
          null,
          Situacao,
        ),
      ],
      'check',
    );
  }

  obterCondicoesPagamento() {
    const idTenant = this.autenticacaoService.usuario().permissaoAtual.idTenant;
    this.condicaoPagamentoService.listarPorTenant(idTenant).subscribe((response) => {
      this.condicoesPagamento = response;
    });
  }

  obterContratoCatalogoCondicoesPagamento() {

    this.contratoCatalogoCondicaoPagamentoFiltro.itensPorPagina = this.itensPorPagina;
    this.contratoCatalogoCondicaoPagamentoFiltro.pagina = this.pagina;
    this.contratoCatalogoCondicaoPagamentoFiltro.itemOrdenar = this.itemOrdenar;
    this.contratoCatalogoCondicaoPagamentoFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoCondicaoPagamentoFiltro.idContratoCatalogo = this.idContrato;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoCatalogoService
      .filtrarCondicaoPagamento(
        this.contratoCatalogoCondicaoPagamentoFiltro,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.contratoCatalogoCondicoesPagamentos = response.itens;
            this.totalPaginas = response.numeroPaginas;
            this.possuiAprovacaoCondicoesPagamento();
          } else {
            this.contratoCatalogoCondicoesPagamentos = new Array<
              ContratoCatalogoCondicaoPagamento
            >();
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

  possuiAprovacaoCondicoesPagamento(){
    let CondicoesPagamentoEmAprovacao = this.contratoCatalogoCondicoesPagamentos.filter(x => ([Situacao['Aguardando Exclusão'],Situacao['Aguardando Inclusão']].includes(x.situacao)))

    if(CondicoesPagamentoEmAprovacao.length == 0){
      this.possuiAprovacao.emit(false)
    }
  }

  construirFormulario() {
    this.form = this.formBuilder.group({
      idCondicaoPagamento: [null, Validators.required],
    });
  }

  termoJaInserido() {
    return this.contratoCatalogoCondicoesPagamentos.find(
      (f) => f.idCondicaoPagamento === this.form.value.idCondicaoPagamento,
    );
  }

  incluir() {
    if (this.termoJaInserido()) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.PAYMENT_TERMS_ALREADY_REGISTERED,
      );
      return;
    }

    const contratoCatalogoCondicaoPagamento = new ContratoCatalogoCondicaoPagamento(
      this.idContrato,
      this.form.value.idCondicaoPagamento,
    );

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoCatalogoService
      .inserirCondicaoPagamento(this.idContrato, contratoCatalogoCondicaoPagamento)
      .subscribe(
        (response) => {
          this.condicoesPagamentoSelecionaveis = this.condicoesPagamentoSelecionaveis.filter(
            (condicaoPagamento) =>
              condicaoPagamento.idCondicaoPagamento !==
              contratoCatalogoCondicaoPagamento.idCondicaoPagamento,
          );
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.obterContratoCatalogoCondicoesPagamento();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  solicitarExclusao() {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(),
        (reason) => { },
      );
  }

  alterarSituacao(situacao: Situacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoCatalogoService
      .alterarSituacaoCondicaoPagamentoBatch(this.idContrato, this.selecionadas, situacao)
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.pagina = 1;
          this.obterContratoCatalogoCondicoesPagamento();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  selecao(codicoesPagamento: Array<ContratoCatalogoCondicaoPagamento>) {
    this.selecionadas = codicoesPagamento;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterContratoCatalogoCondicoesPagamento();
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoCatalogoService
      .deletarCondicaoPagamentoBatch(this.idContrato, this.selecionadas)
      .subscribe(
        (resultado) => {
          if (resultado) {
            this.selecionadas.forEach((s) =>
              this.condicoesPagamentoSelecionaveis.push(s.condicaoPagamento),
            );
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.pagina = 1;
          this.obterContratoCatalogoCondicoesPagamento();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }
}
