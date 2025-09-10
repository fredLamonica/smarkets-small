import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { Usuario } from '../../../shared/models';
import { Competencia } from '../../../shared/models/enums/competencia-relatorio-requisicao.enum';
import { SituacaoRequisicaoItem } from '../../../shared/models/enums/situacao-requisicao-item';
import { RelatorioRequisicaoFiltro } from '../../../shared/models/fltros/relatorio-requisicao-filtro';
import { PessoaJuridica } from '../../../shared/models/pessoa-juridica';
import { EnumToArrayPipe } from '../../../shared/pipes/enum-to-array.pipe';
import { ArquivoService } from '../../../shared/providers/arquivo.service';
import { AutenticacaoService } from '../../../shared/providers/autenticacao.service';
import { RelatoriosService } from '../../../shared/providers/relatorios.service';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  selector: 'smk-relatorio-requisicao',
  templateUrl: './relatorio-requisicao.component.html',
  styleUrls: ['./relatorio-requisicao.component.scss'],
})
export class RelatorioRequisicaoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  formFiltro: FormGroup;
  opcoesSituacaoRequisicaoItem: Array<any>;
  empresasLoading: boolean;
  usuariosLoading: boolean;
  empresas: PessoaJuridica[];
  responsaveis: Array<Usuario>;
  solicitantes: Array<Usuario>;

  tiposCompetencia: Array<Competencia> = new Array<Competencia>(
    Competencia.dataAprovacaoPedido,
    Competencia.dataAprovacaoRequisicao,
    Competencia.dataConfirmacaoFornecedor,
    Competencia.dataCriacaoPedido,
    Competencia.dataCriacaoRequisicao,
    Competencia.dataEntregaBaixaPedido,
  );

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private relatorioService: RelatoriosService,
    private errorService: ErrorService,
    private arquivoService: ArquivoService,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormularioFiltro();
    this.populeSituacoes();
    this.obterEmpresas();
    this.obterUsuarios();
  }

  populeSituacoes(): void {
    const situacoes = new EnumToArrayPipe().transform(SituacaoRequisicaoItem) as Array<any>;

    this.opcoesSituacaoRequisicaoItem = situacoes.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  }

  situacoesSearchFn(term: string, item: any) {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  customSearchCompetencia(term: string, item: any) {
    term = term.toLowerCase();
    return Competencia[item].toLowerCase().indexOf(term) > -1;
  }

  empresaSearchFn(term: string, item: PessoaJuridica) {
    term = term.toLowerCase();
    return item.razaoSocial.toLowerCase().indexOf(term) > -1 ||
      (item.nomeFantasia && item.nomeFantasia.toLowerCase().indexOf(term) > -1) ||
      item.cnpj.toLowerCase().indexOf(term) > -1;
  }

  customSearchUsuario(term: string, item: Usuario) {
    return item.pessoaFisica.nome.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  downloadRelatorioRequisicoes() {
    this.blockUI.start();

    const filtro: RelatorioRequisicaoFiltro = this.formFiltro.value;

    this.relatorioService.obterRelatorioRequisicao(filtro).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response.size > 0) {
            this.arquivoService.createDownloadElement(
              response,
              `Relatório de Requisições ${filtro.dataInicio} a ${filtro.dataFim}.xls`,
            );
            this.blockUI.stop();
          } else {
            this.toastr.warning('Nenhum registro encontrado.');
            this.blockUI.stop();
          }
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  obterUsuarios(): void {
    this.usuariosLoading = true;

    this.relatorioService.obterUsuarios(this.formFiltro.get('empresas').value).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.usuariosLoading = false))
      .subscribe((usuarios: Array<Usuario>) => {
        this.responsaveis = usuarios;
        this.solicitantes = usuarios;

        this.formFiltro.get('responsaveis').setValue([]);
        this.formFiltro.get('solicitantes').setValue([]);
      });
  }

  private construirFormularioFiltro() {

    this.formFiltro = this.fb.group({
      competencia: [Competencia.dataCriacaoRequisicao],
      dataInicio: [moment().startOf('month').format('YYYY-MM-DD')],
      dataFim: [moment().format('YYYY-MM-DD')],
      empresas: [[this.authService.usuario().permissaoAtual.pessoaJuridica.idTenant]],
      status: [[]],
      responsaveis: [[]],
      solicitantes: [[]],
    });

    this.formFiltro.get('empresas').valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(() => this.obterUsuarios());

  }

  private obterEmpresas() {
    this.empresasLoading = true;

    this.relatorioService.obterEmpresas()
      .pipe(takeUntil(this.unsubscribe), finalize(() => this.empresasLoading = false))
      .subscribe(
        (response) => {
          this.empresas = response;
        },
      );
  }

}
