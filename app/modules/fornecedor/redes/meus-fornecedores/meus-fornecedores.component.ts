import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ConfirmacaoComponent } from '@shared/components';
import { SdkIncluirDocumentoModalComponent } from '@shared/components/sdk-incluir-documento-modal/sdk-incluir-documento-modal.component';
import {
  FornecedorInteressado,
  Ordenacao,
  SituacaoPessoaJuridica,
  SituacaoQuestionarioFornecedor,
  StatusFornecedor,
  StatusPendenciaFornecedor,
  StatusPlanoAcaoFornecedor
} from '@shared/models';
import { StatusDocumentoFornecedor } from '@shared/models/enums/status-documento-fornecedor';
import {
  DynamicFilter,
  DynamicFilterType,
  EnumKeyValue
} from '@shared/models/fltros/dynamic-filter';
import { FilterResult } from '@shared/models/fltros/filter-result';
import { GenericFilter } from '@shared/models/fltros/generic-filter';
import {
  AutenticacaoService,
  FornecedorService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs-compat';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'meus-fornecedores',
  templateUrl: './meus-fornecedores.component.html',
  styleUrls: ['./meus-fornecedores.component.scss'],
})
export class MeusFornecedoresComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  tipoRede: string = 'local';

  fornecedores: Array<FornecedorInteressado> = [];
  fornecedoresSelecionados: Array<FornecedorInteressado> = [];
  loadingFornecedores: boolean;

  registrosPorPagina: number = 5;
  pagina: number = 1;
  ordenarPor: string = 'IdFornecedor';
  ordenacao: Ordenacao = Ordenacao.DESC;
  totalPaginas: number = 0;

  sessionStorageFilterKey = 'rede-fornecedora-filters';
  filters = new Array<DynamicFilter>();
  filter: FilterResult[];

  termo: string = '';
  private fornecedoresSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private authService: AutenticacaoService,
    private fornecedorService: FornecedorService,
    private pessoaJuridicaService: PessoaJuridicaService,
  ) {
    super();
    this.construirFiltro();
  }

  ngOnInit() {
    this.obterParametros();
  }

  incluirFornecedor() {
    const modalRef = this.modalService.open(SdkIncluirDocumentoModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'md' as 'sm',
    });
    modalRef.result.then((result) => {
      if (result) {
        if (result.existentDocument) {
          this.buscarFornecedor(result.document);
        } else {
          this.cadastrarNovoFornecedor(result.document);
        }
      }
    });
  }

  buscarFornecedor(documento: string) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.obterPorCnpj(documento).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.blockUI.stop();
          this.tratarFornecedores(response, documento);
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  navigateFor(page: string) {
    this.router.navigate([`${this.router.url}/${page}`]);
  }

  filtrar(filters: FilterResult[], onScroll: boolean = false) {
    if (filters) {
      this.filter = filters;
    }

    const tipoRede = new FilterResult('tipoRede', [this.tipoRede]);
    filters = filters.concat(tipoRede);

    const filter = new GenericFilter(
      this.ordenarPor,
      this.ordenacao,
      this.registrosPorPagina,
      this.pagina,
      filters,
    );

    if (!onScroll) {
      this.fornecedores = new Array<FornecedorInteressado>();
      this.pagina = 1;
    }

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.filtrarAvancadoGenerico(filter).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.fornecedores = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.fornecedores = new Array<FornecedorInteressado>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(error);
          this.blockUI.stop();
        },
      );
  }

  solicitarRemoverRedeLocal() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Tem certeza que deseja remover os fornecedores da sua rede local?';
    modalRef.result.then((result) => {
      if (result) { this.removerRedeLocal(); }
    });
  }

  ativarFornecedor(idPessoaJuridicaFornecedor: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja ativar a empresa?';
    modalRef.result.then((result) => {
      if (result) {
        this.alterarSituacao(
          idPessoaJuridicaFornecedor,
          SituacaoPessoaJuridica.Ativa,
          this.fornecedores.findIndex(
            (f) => f.idPessoaJuridicaFornecedor === idPessoaJuridicaFornecedor,
          ),
        );
      }
    });
  }

  auditarFornecedor(idFornecedor: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'Fornecedor';
    modalRef.componentInstance.idEntidade = idFornecedor;
  }

  inativarFornecedor(idPessoaJuridicaFornecedor: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja desativar a empresa?';
    modalRef.result.then((result) => {
      if (result) {
        this.alterarSituacao(
          idPessoaJuridicaFornecedor,
          SituacaoPessoaJuridica.Inativa,
          this.fornecedores.findIndex(
            (f) => f.idPessoaJuridicaFornecedor === idPessoaJuridicaFornecedor,
          ),
        );
      }
    });
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    if (this.filter) { this.filtrar(this.filter, true); } else { this.obterFornecedores(); }
  }

  private obterFornecedores() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.loadingFornecedores = true;
    this.fornecedoresSub = this.fornecedorService
      .filtrar(
        this.tipoRede,
        this.registrosPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
        this.termo,
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.loadingFornecedores = false;
            this.fornecedores = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.loadingFornecedores = false;
            this.fornecedores = new Array<FornecedorInteressado>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.fornecedores = new Array<FornecedorInteressado>();
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private cadastrarNovoFornecedor(document: string) {
    this.fornecedorService.alterarDocumento(document);
    this.router.navigate(['novo/dados-gerais'], { relativeTo: this.route });
  }

  private tratarFornecedores(fornecedores: FornecedorInteressado[], documento: string) {
    const idTenant = this.authService.usuario().permissaoAtual.idTenant;
    const fornecedorRedeLocal = fornecedores.find((fornecedor) => fornecedor.idTenant === idTenant);
    if (fornecedorRedeLocal) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, {
        centered: true,
        backdrop: 'static',
        windowClass: 'modal-confirmar-cadastro',
      });
      modalRef.componentInstance.confirmacao = `Fornecedor já se encontra em Meus Fornecedores`;
      modalRef.componentInstance.confirmarLabel = 'none';
      modalRef.componentInstance.cancelarLabel = 'Fechar';
      modalRef.result.then(() => {
        this.navigateFor(
          fornecedorRedeLocal.idPessoaJuridicaFornecedor.toString() + '/dados-gerais',
        );
      });
    } else {
      const fornecedorSmarkets = fornecedores.find((fornecedor) => fornecedor.idTenant === 1); // IdTenant Master(Smarkets)
      if (fornecedorSmarkets) {
        const modalRef = this.modalService.open(ConfirmacaoComponent, {
          centered: true,
          windowClass: 'modal-confirmar-cadastro',
        });
        modalRef.componentInstance.confirmacao = `Fornecedor já cadastrado! Gostaria de adicionar à sua empresa?`;
        modalRef.componentInstance.confirmarLabel = 'Sim';
        modalRef.componentInstance.cancelarLabel = 'Não';
        modalRef.result.then((result) => {
          if (result) {
            this.router.navigate(['./../smarkets', fornecedorSmarkets.idPessoaJuridicaFornecedor, 'dados-gerais', fornecedorSmarkets.idTenant], {
              relativeTo: this.route,
            });
          }
        });
      } else {
        this.cadastrarNovoFornecedor(documento);
      }
    }
  }

  private removerRedeLocal() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.removerRedeLocal(this.fornecedoresSelecionados).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.pagina = 1;
          this.obterFornecedores();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private alterarSituacao(
    idPessoaJuridica: number,
    situacao: SituacaoPessoaJuridica,
    indexItem: number,
  ) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.alterarSituacao(idPessoaJuridica, situacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.obterFornecedores();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private obterParametros() {
    if (!this.hasFilterSeted()) {
      this.obterFornecedores();
    }
  }

  private hasFilterSeted(): boolean {
    const filterKey = sessionStorage.getItem(this.sessionStorageFilterKey);
    return filterKey != null && filterKey !== undefined;
  }

  private construirFiltro() {
    //#region Filter List Option

    const enumStatusFornecedor = [
      <EnumKeyValue>{
        name: 'statusFornecedor',
        value: StatusFornecedor.Bloqueado,
        label: 'Bloqueado',
      },

      <EnumKeyValue>{
        name: 'statusFornecedor',
        value: StatusFornecedor.Novo,
        label: 'Novo',
      },

      <EnumKeyValue>{
        name: 'statusFornecedor',
        value: StatusFornecedor.AtivoComPendencias,
        label: 'Ativo com Pendências',
      },

      <EnumKeyValue>{
        name: 'statusFornecedor',
        value: StatusFornecedor.EmAnalise,
        label: 'Em análise',
      },

      <EnumKeyValue>{ name: 'statusFornecedor', value: StatusFornecedor.Ativo, label: 'Ativo' },

      <EnumKeyValue>{
        name: 'statusFornecedor',
        value: StatusFornecedor.Inativo,
        label: 'Inativo',
      },
    ];

    const enumStatusDocumentos = [
      <EnumKeyValue>{
        name: 'statusDocumento',
        value: StatusDocumentoFornecedor.Aprovados,
        label: 'Aprovados',
      },

      <EnumKeyValue>{
        name: 'statusDocumento',
        value: StatusDocumentoFornecedor.Vencer,
        label: 'A vencer em 30 dias',
      },

      <EnumKeyValue>{
        name: 'statusDocumento',
        value: StatusDocumentoFornecedor.Vencidos,
        label: 'Vencidos',
      },

      <EnumKeyValue>{
        name: 'statusDocumento',
        value: StatusDocumentoFornecedor.NaoEnviados,
        label: 'Não enviados',
      },

      <EnumKeyValue>{
        name: 'statusDocumento',
        value: StatusDocumentoFornecedor.Recusados,
        label: 'Recusados',
      },
      <EnumKeyValue>{
        name: 'statusDocumento',
        value: StatusDocumentoFornecedor.Novo,
        label: 'Novo',
      },
    ];

    const enumStatusQuestionarios = [
      <EnumKeyValue>{
        name: 'situacaoQuestionario',
        value: SituacaoQuestionarioFornecedor.Pendente,
        label: 'Pendentes',
      },

      <EnumKeyValue>{
        name: 'situacaoQuestionario',
        value: SituacaoQuestionarioFornecedor['Em Andamento'],
        label: 'Em andamento',
      },
    ];

    const enumStatusPlanoAcao = [
      <EnumKeyValue>{
        name: 'statusPlanoAcao',
        value: StatusPlanoAcaoFornecedor.Pendente,
        label: 'Pendentes',
      },

      <EnumKeyValue>{
        name: 'statusPlanoAcao',
        value: StatusPlanoAcaoFornecedor['Em Andamento'],
        label: 'Em Andamento',
      },

      <EnumKeyValue>{
        name: 'statusPlanoAcao',
        value: StatusPlanoAcaoFornecedor.Atrasado,
        label: 'Atrasados',
      },
    ];

    const enumStatusPendencias = [
      <EnumKeyValue>{
        name: 'statusPendencia',
        value: StatusPendenciaFornecedor.Resolvido,
        label: 'Resolvidas',
      },

      <EnumKeyValue>{
        name: 'statusPendencia',
        value: StatusPendenciaFornecedor.Pendente,
        label: 'Pendentes',
      },

      <EnumKeyValue>{
        name: 'statusPendencia',
        value: StatusPendenciaFornecedor.Excluído,
        label: 'Excluídos',
      },
    ];

    this.filters = [
      new DynamicFilter(
        'statusFornecedor',
        DynamicFilterType.Select,
        'Status Fornecedor',
        2,
        'label',
        'value',
        enumStatusFornecedor,
      ),

      new DynamicFilter('documento', DynamicFilterType.Text, 'CNPJ/CPF', 2, null, null),

      new DynamicFilter('razaoSocial', DynamicFilterType.Text, 'Razão Social', 2),

      new DynamicFilter('codigoErp', DynamicFilterType.Text, 'Código ERP', 2),

      new DynamicFilter(
        'statusDocumento',
        DynamicFilterType.Select,
        'Status Documento',
        2,
        'label',
        'value',
        enumStatusDocumentos,
      ),

      new DynamicFilter(
        'situacaoQuestionario',
        DynamicFilterType.Select,
        'Status Questionário',
        2,
        'label',
        'value',
        enumStatusQuestionarios,
      ),

      new DynamicFilter(
        'statusPlanoAcao',
        DynamicFilterType.Select,
        'Status Plano Ação',
        2,
        'label',
        'value',
        enumStatusPlanoAcao,
      ),

      new DynamicFilter(
        'statusPendencia',
        DynamicFilterType.Select,
        'Status Pendência',
        2,
        'label',
        'value',
        enumStatusPendencias,
      ),
    ];

    //#endregion Filter List Option
  }
}
