import { Component, OnInit } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { PessoaJuridica, SituacaoPessoaJuridica, Ordenacao, PerfilUsuario } from '@shared/models';
import {
  TranslationLibraryService,
  PessoaJuridicaService,
  AutenticacaoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ConfirmacaoComponent,
  ModalConfirmacaoExclusao,
  AuditoriaComponent
} from '@shared/components';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'listar-pessoa-juridica-smarkets',
  templateUrl: './listar-pessoa-juridica-smarkets.component.html',
  styleUrls: ['./listar-pessoa-juridica-smarkets.component.scss']
})
export class ListarPessoaJuridicaSmarketsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public tipoPerfilUsuario = PerfilUsuario;

  public termo: string;

  public Situacao = SituacaoPessoaJuridica;

  public pessoasJuridicas: Array<PessoaJuridica>;

  public perfilUsuario: PerfilUsuario;
  public enumPerfilUsuario = PerfilUsuario;

  public registrosPorPagina: number = 16;
  public pagina: number = 1;
  public totalPaginas: number = 0;
  public ordenarPor: string = 'idPessoaJuridica';
  public ordenacao: Ordenacao = Ordenacao.DESC;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private autenticacaoService: AutenticacaoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.termo = '';
    this.perfilUsuario = this.autenticacaoService.perfil();
    this.resetPaginacao();
    this.obterPessoasJuridicas();
  }

  public buscar(termo: string) {
    this.termo = termo;
    this.resetPaginacao();
    this.obterPessoasJuridicas();
  }

  public onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterPessoasJuridicas();
    }
  }

  public resetPaginacao() {
    this.pessoasJuridicas = new Array<PessoaJuridica>();
    this.pagina = 1;
  }

  private obterPessoasJuridicas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService
      .filtrar(
        this.registrosPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
        this.termo,
        '',
        '',
        null,
        this.perfilUsuario != PerfilUsuario.Fornecedor ? true : null
      )
      .subscribe(
        response => {
          if (response) {
            this.pessoasJuridicas = this.pessoasJuridicas.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.pessoasJuridicas = new Array<PessoaJuridica>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  // #region Ações

  public solicitarExclusao(idPessoaJuridica: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.excluir(idPessoaJuridica),
        reason => {}
      );
  }

  private excluir(idPessoaJuridica: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.excluir(idPessoaJuridica).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.resetPaginacao();
        this.obterPessoasJuridicas();
      },
      error => {
        this.toastr.error(error.error);
        this.blockUI.stop();
      }
    );
  }

  public auditar(idPessoaJuridica: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'PessoaJuridica';
    modalRef.componentInstance.idEntidade = idPessoaJuridica;
  }

  public ativar(pessoaJuridica: PessoaJuridica) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja ativar a empresa?';
    modalRef.result.then(result => {
      if (result) this.alterarSituacao(pessoaJuridica, SituacaoPessoaJuridica.Ativa);
    });
  }

  public inativar(pessoaJuridica: PessoaJuridica) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja desativar a empresa?';
    modalRef.result.then(result => {
      if (result) this.alterarSituacao(pessoaJuridica, SituacaoPessoaJuridica.Inativa);
    });
  }

  private alterarSituacao(pessoaJuridica: PessoaJuridica, situacao: SituacaoPessoaJuridica) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.alterarSituacaoBatch([pessoaJuridica], situacao).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        if (this.termo == '') pessoaJuridica.situacao = situacao;
        else {
          this.pessoasJuridicas = new Array<PessoaJuridica>();
          this.obterPessoasJuridicas();
        }
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  // #endregion

  public navigateToDadosGerais(idPessoaJuridica: number) {
    this.router.navigate([idPessoaJuridica.toString().concat('/dados-gerais')], {
      relativeTo: this.route
    });
  }
}
