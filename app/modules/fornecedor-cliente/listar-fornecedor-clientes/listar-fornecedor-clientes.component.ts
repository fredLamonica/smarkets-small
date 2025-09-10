import { HistoricoAceiteTermosComponent } from './../../../shared/components/modals/historico-aceite-termos/historico-aceite-termos.component';
import { HistoricoDeAceiteDeTermo } from './../../../shared/models/historico-de-aceite-de-termo';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PessoaJuridica, CustomTableSettings, CustomTableColumn, CustomTableColumnType, SituacaoPessoaJuridica } from '@shared/models';
import { TranslationLibraryService, PessoaJuridicaService, FornecedorService, AutenticacaoService, ConfiguracaoTermosBoasPraticasService } from '@shared/providers';
import { ConfirmacaoComponent } from '@shared/components';
import * as moment from 'moment';

@Component({
  selector: 'app-listar-fornecedor-clientes',
  templateUrl: './listar-fornecedor-clientes.component.html',
  styleUrls: ['./listar-fornecedor-clientes.component.scss']
})
export class ListarFornecedorClientesComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public pessoasJuridicas: Array<PessoaJuridica>;
  
  public settings: CustomTableSettings;
  public selecionadas: Array<PessoaJuridica>;

  public registrosPorPagina: number = 5;
  public pagina: number = 1;
  public totalPaginas: number = 0;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private fornecedorService: FornecedorService,
    private autenticacaoService: AutenticacaoService,
    private configuracaoTermosBoasPraticasService: ConfiguracaoTermosBoasPraticasService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.configurarTabela();
    this.obterClientes();
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn("#", "idPessoaJuridica", CustomTableColumnType.text),
        new CustomTableColumn("CNPJ", "cnpj", CustomTableColumnType.text),
        new CustomTableColumn("Razão Social", "razaoSocial", CustomTableColumnType.text),        
        new CustomTableColumn("Nome Fantasia", "nomeFantasia", CustomTableColumnType.text),
        new CustomTableColumn("Situação", "situacao", CustomTableColumnType.enum, null, null, SituacaoPessoaJuridica),
      ], "check"
    );
  }

  private obterClientes(termo: string = "") {
    let idPessoaJuridica = this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica.idPessoaJuridica;
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.FiltrarClientes(idPessoaJuridica, this.registrosPorPagina, this.pagina, termo).subscribe(
      response => {
        if (response) {
          this.pessoasJuridicas = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.pessoasJuridicas = new Array<PessoaJuridica>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public solicitarHistoricoDeAceiteDeTermos() {
    var fornecedor = this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica;

    this.configuracaoTermosBoasPraticasService.obterHistoricoDeAceitesParaFornecedor(fornecedor.idPessoaJuridica, this.selecionadas[0].idTenant).subscribe(
      (result) => {
        if (result.length > 0)
          this.abrirModal(result);
        else
          this.abrirModal(null);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );

  }

  private abrirModal(historicoDeAceitesDeTermos: HistoricoDeAceiteDeTermo[]){
    var modalRef = this.modalService.open(HistoricoAceiteTermosComponent, { centered: true, size: "lg" });
    modalRef.componentInstance.historicoDeAceitesDeTermos = historicoDeAceitesDeTermos;
  }

  public selecao(empresas: Array<PessoaJuridica>) {
    this.selecionadas = empresas;
  }

  public paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterClientes();
  }

}
