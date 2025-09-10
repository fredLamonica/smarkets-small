import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CategoriaFornecimento,
  FornecedorInteressado,
  Ordenacao,
  PessoaJuridica,
  PlanoAcaoFornecedor,
  StatusPlanoAcaoFornecedor,
  TipoDocumentoFornecedor
} from '@shared/models';
import {
  AutenticacaoService,
  FornecedorService,
  PlanoAcaoFornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ManterPlanoAcaoFornecedorComponent } from '../manter-plano-acao-fornecedor/manter-plano-acao-fornecedor.component';

@Component({
  selector: 'plano-acao-admin',
  templateUrl: './plano-acao-admin.component.html',
  styleUrls: ['./plano-acao-admin.component.scss']
})
export class PlanoAcaoAdminComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  fornecedor: FornecedorInteressado;
  itensPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'IdPlanoAcaoFornecedor';
  ordenacao: Ordenacao = Ordenacao.DESC;
  idPessoaJuridicaFornecedor: number;
  planos: Array<PlanoAcaoFornecedor>;
  StatusPlanoAcaoFornecedor = StatusPlanoAcaoFornecedor;
  tipoDocumentoSelecionado: TipoDocumentoFornecedor;
  pessoaJuridica: PessoaJuridica;

  constructor(
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private planoAcaoFornecedorService: PlanoAcaoFornecedorService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fornecedorService: FornecedorService,
    private authService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.idPessoaJuridicaFornecedor = this.route.parent.snapshot.params.id;
    this.obterPessoaJuridicaFornecedor();
  }
  private obterPessoaJuridicaFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .ObterFornecedorRedeLocalPorIdPessoaJuridica(this.idPessoaJuridicaFornecedor)
      .subscribe(
        response => {
          if (response) {
            this.fornecedor = response;
            this.obterPlanosAcoes();
            if (this.fornecedor.possuiCategoriaFornecimentoInteresse)
              this.fornecedor.categoriasFornecimento.push(
                Object.assign(
                  {},
                  new CategoriaFornecimento(
                    0,
                    'Outras',
                    'Outras',
                    this.authService.usuario().permissaoAtual.idTenant
                  )
                )
              );
            if (response.cnpj.length > 14)
              this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cnpj;
            else {
              this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cpf;
            }
          }
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public abrirModalDePlanoDeAcao(plano: PlanoAcaoFornecedor = null) {
    const modalRef = this.modalService.open(ManterPlanoAcaoFornecedorComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.fornecedor = this.fornecedor;

    if (plano != null) {
      modalRef.componentInstance.planoAcaoFornecedor = plano;
    }

    modalRef.result.then(() => {
      this.obterPlanosAcoes();
    });
  }
  private obterPlanosAcoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService
      .listarPorIdFornecedor(
        this.itensPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
        this.fornecedor.idFornecedor
      )
      .subscribe(
        response => {
          if (response) {
            this.planos = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.planos = new Array<PlanoAcaoFornecedor>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }
  public paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterPlanosAcoes();
  }
}
