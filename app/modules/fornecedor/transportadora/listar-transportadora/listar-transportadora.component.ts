import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AuditoriaComponent,
  ConfirmacaoComponent,
  ModalConfirmacaoExclusao
} from '@shared/components';
import {
  BotaoCustomTable,
  ColunaComBotoes,
  CustomTableColumn,
  CustomTableColumnType,
  CustomTableSettings,
  Ordenacao,
  PerfilUsuario, Situacao,
  SituacaoPessoaJuridica
} from '@shared/models';
import { Transportadora } from '@shared/models/transportadora';
import {
  AutenticacaoService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { TransportadoraService } from '@shared/providers/transportadora.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import {
  StatusHomologacaoTransportadoraLabel
} from './../../../../shared/models/enums/status-homologacao-transportadora.enum';

@Component({
  selector: 'app-listar-transportadora',
  templateUrl: './listar-transportadora.component.html',
  styleUrls: ['./listar-transportadora.component.scss'],
})
export class ListarTransportadoraComponent implements OnInit {
  public get adminSmarketsLogado() {
    return this._adminSmarketsLogado;
  }
  @BlockUI() blockUI: NgBlockUI;

  public transportadorasSelecionadas: Array<Transportadora> = [];
  public transportadoras: Array<Transportadora>;
  public form: FormGroup;

  public settings: CustomTableSettings;

  public termo: string = '';
  public pagina: number = 1;
  public itensPorPagina: number = 5;
  public totalPaginas: number = 0;
  public ordenarPor: string = 'IdTransportadora';
  public ordenacao: Ordenacao = Ordenacao.DESC;
  isRegisterProfile: boolean = false;

  public colunasComBotoes = new Array<ColunaComBotoes>();

  private _adminSmarketsLogado: boolean;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private transportadoraService: TransportadoraService,
    private router: Router,
    private route: ActivatedRoute,
    private pessoaJuridicaService: PessoaJuridicaService,
    private modalService: NgbModal,
    private authService: AutenticacaoService
  ) { }

  ngOnInit() {
    this.verificarAdminSmarketsLogado();
    this.obterColunaAcoes();
    this.construirFormulario();
    this.configurarTabela();
    this.obterParametros();
  }

  public construirFormulario() {
    this.form = this.fb.group({
      termo: ['']
    });
  }

  public agruparSelecionados(selecionados: Array<Transportadora>) {
    this.transportadorasSelecionadas = selecionados;
  }

  public ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.obterTransportadoras();
  }

  public buscar(termo?) {
    this.termo = termo ? termo : '';
    this.pagina = 1;
    this.obterTransportadoras();
  }

  public paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterTransportadoras();
  }

  // public alterarTransportadora() {
  //   this.router.navigate(['/manter-fornecedor'], { relativeTo: this.route });
  //   // this.router.navigate();
  // }

  public solicitarExclusao(idTransportadora: number, idPessoaJuridica: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.excluir(idTransportadora, idPessoaJuridica),
        reason => { }
      );
  }

  public auditar(event) {
    const idPessoaJuridica = this.transportadoras[event.indexItem].pessoaJuridica.idPessoaJuridica;
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'PessoaJuridica';
    modalRef.componentInstance.idEntidade = idPessoaJuridica;
  }

  public ativar(event) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja ativar a empresa?';
    modalRef.result.then(result => {
      const idPessoaJuridica = this.transportadoras[event.indexItem].pessoaJuridica
        .idPessoaJuridica;
      if (result)
        this.alterarSituacao(idPessoaJuridica, SituacaoPessoaJuridica.Ativa, event.indexItem);
    });
  }

  public inativar(event) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja desativar a empresa?';
    modalRef.result.then(result => {
      const idPessoaJuridica = this.transportadoras[event.indexItem].pessoaJuridica
        .idPessoaJuridica;
      if (result)
        this.alterarSituacao(idPessoaJuridica, SituacaoPessoaJuridica.Inativa, event.indexItem);
    });
  }

  public realizarAcao(event) {
    switch (event.indexBotao) {
      case 0:
        const situacao = this.transportadoras[event.indexItem].pessoaJuridica.situacao;
        if (situacao == SituacaoPessoaJuridica.Ativa) this.inativar(event);
        else this.ativar(event);
        break;
      case 1:
        this.auditar(event);
        break;
    }
  }

  private obterParametros() {
    this.obterTransportadoras();
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('CNPJ', 'cnpj', CustomTableColumnType.text, null, null, null, 'cnpj'),
        new CustomTableColumn(
          'Razão Social',
          'razaoSocial',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'razaoSocial'
        ),
        new CustomTableColumn(
          'Homologação',
          'statusHomologacao',
          CustomTableColumnType.enum,
          null,
          null,
          StatusHomologacaoTransportadoraLabel
        ),
        new CustomTableColumn(
          'Status Plataforma',
          'situacao',
          CustomTableColumnType.enum,
          null,
          null,
          Situacao
        )
      ],
      'check',
      this.ordenarPor,
      this.ordenacao
    );
  }

  private obterTransportadoras() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.transportadoraService
      .filtrar(this.itensPorPagina, this.pagina, this.ordenarPor, Ordenacao.DESC, this.termo)
      .subscribe(
        response => {
          if (response) {
            this.transportadoras = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.transportadoras = new Array<Transportadora>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        () => {
          this.transportadoras = new Array<Transportadora>();
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  private excluir(idTransportadora: number, idPessoaJuridica: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.transportadoraService.excluir(idTransportadora, idPessoaJuridica).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.obterTransportadoras();
      },
      error => {
        this.toastr.error(error.error);
        this.blockUI.stop();
      }
    );
  }

  private alterarSituacao(
    idPessoaJuridica: number,
    situacao: SituacaoPessoaJuridica,
    indexItem: number
  ) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.alterarSituacao(idPessoaJuridica, situacao).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.obterTransportadoras();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private verificarAdminSmarketsLogado() {
    let permissaoAtual = this.authService.usuario().permissaoAtual;
    this._adminSmarketsLogado =
      permissaoAtual.perfil == PerfilUsuario.Administrador && permissaoAtual.idTenant == 1; // IdTenant Master(Smarkets)
    this.isRegisterProfile = permissaoAtual.perfil == PerfilUsuario.Cadastrador ? true : false;
  }

  private obterColunaAcoes() {
    if (this._adminSmarketsLogado || this.isRegisterProfile) {
      let colunaAcoes = new ColunaComBotoes();
      colunaAcoes.titulo = 'Ações';
      colunaAcoes.botoes = new Array<BotaoCustomTable>();

      const botaoAtivarDesativar = new BotaoCustomTable(
        '',
        'fas fa-toggle-off',
        'fas fa-toggle-on',
        'pessoaJuridica.situacao',
        SituacaoPessoaJuridica.Ativa.toString()
      );
      const botaoAuditoria = new BotaoCustomTable('', 'fas fa-history');
      colunaAcoes.botoes.push(botaoAtivarDesativar, botaoAuditoria);

      this.colunasComBotoes.push(colunaAcoes);
    }
  }
}
