import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent } from '@shared/components';
import { Ordenacao, PessoaJuridica } from '@shared/models';
import { PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'listar-empresas',
  templateUrl: './listar-empresas.component.html',
  styleUrls: ['./listar-empresas.component.scss'],
})
export class ListarEmpresasComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  empresas: Array<PessoaJuridica> = new Array<PessoaJuridica>();

  private totalPaginas: number;
  private pagina: number;
  private itemOrdenacao: string = 'IdPessoaJuridica';
  private termo: string = '';

  constructor(private pessoaJuridicaService: PessoaJuridicaService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.resetPaginacao();
    this.obterEmpresas();
  }

  buscar(termo) {
    this.termo = termo;
    this.resetPaginacao();
    this.obterEmpresas(termo);
  }

  limparFiltro() {
    this.termo = '';
    this.resetPaginacao();
    this.obterEmpresas();
  }

  resetPaginacao() {
    this.empresas = new Array<PessoaJuridica>();
    this.pagina = 1;
  }

  onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterEmpresas();
    }
  }

  obter(termo?: string) {
    this.termo = termo;
    this.obterEmpresas(this.termo);
  }

  onEditarClick(idPessoaJuridica: number, idTenant: number) {
    this.router.navigate([idPessoaJuridica], {
      relativeTo: this.route,
    });

  }

  onAuditoriaClick(idPessoaJuridica: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'ConfiguracoesDto';
    modalRef.componentInstance.idEntidade = idPessoaJuridica;
  }

  private obterEmpresas(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.filtrar(24, this.pagina, this.itemOrdenacao, Ordenacao.ASC, this.termo, '', '').subscribe(
      (response) => {
        if (response) {
          this.empresas = this.empresas.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.empresas = new Array<PessoaJuridica>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, (responseError) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      });
  }
}
