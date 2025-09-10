import { Component, OnInit, Input } from '@angular/core';
import {
  Cotacao,
  SituacaoCotacao,
  TipoRequisicao,
  PerfilUsuario,
  UnidadeMedidaTempo
} from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  TranslationLibraryService,
  CotacaoService,
  AutenticacaoService,
  FornecedorService,
  ArquivoService,
  CotacaoRodadaService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ConfirmacaoComponent } from '@shared/components';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { FornecedorInteressado } from '@shared/models/fornecedor-interessado';
import { AuditoriaCotacaoComponent } from '@shared/components/auditoria/auditoria-cotacao/auditoria-cotacao.component';

@Component({
  selector: 'cotacao',
  templateUrl: './cotacao.component.html',
  styleUrls: ['./cotacao.component.scss']
})
export class CotacaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() cotacao: Cotacao;
  @Input('envelopeFechadoHabilitado') envelopeFechadoHabilitado: boolean;

  public collapsed: boolean = true;

  public TipoRequisicao = TipoRequisicao;
  public SituacaoCotacao = SituacaoCotacao;
  public flagExibirBotoesGestor: boolean = false;
  public flagPermiteEdicao: boolean = false;
  public flagPermiteAgendar: boolean = false;
  public flagPermitirAnalise: boolean = false;
  public flagExibirBotoesFornecedor: boolean = false;
  public flagPermitirProposta: boolean = false;
  public flagPermitirRelatorioAnalise: boolean = false;

  public ultimoRegistroInicioSla: string | Date;
  public tempoSla: number;
  public unidadeMedidaTempoSla: UnidadeMedidaTempo;
  public tempoDecorrido: number;
  public flagPermitirExibirSla: boolean = false;

  private perfilUsuarioLogado: PerfilUsuario;
  public PerfilUsuario = PerfilUsuario;

  public get getPerfilUsuarioLogado() {
    return this.perfilUsuarioLogado;
  }

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoService: CotacaoService,
    private authService: AutenticacaoService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private fornecedorService: FornecedorService,
    private arquivoService: ArquivoService,
    private cotacaoRodadaService: CotacaoRodadaService,
  ) {}

  ngOnInit() {
    this.flagPermitirExibirSla = this.permitirExibirSla();
    this.definirParametrosSla();
    this.perfilUsuarioLogado = this.authService.perfil();
    this.carregaBotoesAcao();
  }

  private carregaBotoesAcao() {
    this.flagExibirBotoesGestor = this.exibirBotoesGestor();
    this.flagPermiteEdicao = this.permiteEdicao();
    this.flagPermiteAgendar = this.permiteAgendar();
    this.flagPermitirAnalise = this.permitirAnalise();
    this.flagExibirBotoesFornecedor = this.exibirBotoesFornecedor();
    this.flagPermitirProposta = this.permitirProposta();
    this.flagPermitirRelatorioAnalise = this.permitirRelatorioAnalise();
  }

  private permiteEdicao(): boolean {
    return this.cotacao.situacao == SituacaoCotacao['Em configuração'];
  }

  private permiteAgendar(): boolean {
    return this.cotacao.situacao == SituacaoCotacao['Em configuração'];
  }

  public carregarCotacao() {
    this.collapsed = !this.collapsed;
    if (
      this.cotacao.situacao != SituacaoCotacao.Cancelada &&
      !this.cotacao.flagCotacaoItemVisivel
    ) {
      this.blockUI.start();

      this.cotacaoService.obterPorId(this.cotacao.idCotacao).subscribe(
        response => {
          if (response) {
            this.cotacao = response;
            this.cotacao.flagCotacaoItemVisivel = true;
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  public agendar(idCotacao: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true
    });
    modalRef.componentInstance.confirmacao = `Deseja realizar o agendamento?`;
    modalRef.componentInstance.confirmarLabel = 'Agendar';
    modalRef.result.then(result => {
      if (result) {
        this.blockUI.start();
        this.cotacaoService.agendar(idCotacao).subscribe(
          rodadaCriada => {
            if (rodadaCriada) {
              this.cotacao.situacao = SituacaoCotacao.Agendada;
              this.cotacao.rodadaAtual = rodadaCriada;
            }

            this.carregaBotoesAcao();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
      }
    });
  }

  public cancelar(idCotacao: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true
    });
    modalRef.componentInstance.confirmacao = `Deseja cancelar a cotação?`;
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.result.then(result => {
      if (result) {
        this.cotacaoService.cancelar(idCotacao).subscribe(
          response => {
            this.cotacao.situacao = SituacaoCotacao.Cancelada;
            this.cotacao.itens = [];
            this.finalizarAnalise();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            if (error.status == 400) this.toastr.error(error.error);
            else
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
      }
    });
  }

  private finalizarAnalise() {
    this.cotacaoRodadaService.finalizar(this.cotacao.rodadaAtual.idCotacaoRodada).subscribe(
      () => {
        this.cotacao.rodadaAtual.finalizada = true;
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }



  public exibirBotaoCancelar(cotacao: Cotacao) {
    if (
      cotacao.situacao != SituacaoCotacao.Encerrada &&
      cotacao.situacao != SituacaoCotacao.Cancelada
    )
      return true;
    return false;
  }

  public situacao(): string {
    if (this.cotacao.situacao == SituacaoCotacao.Agendada) {
      if (
        this.cotacao.rodadaAtual &&
        moment().isBetween(
          moment(this.cotacao.rodadaAtual.dataInicio),
          moment(this.cotacao.rodadaAtual.dataEncerramento)
        )
      ) {
        return 'Em andamento';
      } else if (
        this.cotacao.rodadaAtual &&
        moment().isAfter(moment(this.cotacao.rodadaAtual.dataEncerramento))
      ) {
        return 'Em análise';
      } else {
        return 'Agendada';
      }
    } else {
      return SituacaoCotacao[this.cotacao.situacao];
    }
  }

  public auditar(idCotacao: number) {
    const modalRef = this.modalService.open(AuditoriaCotacaoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.nomeClasse = 'Cotacao';
    modalRef.componentInstance.idEntidade = idCotacao;
  }

  private exibirBotoesGestor(): boolean {
    return (
      [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador].includes(
        this.authService.perfil()
      ) && this.authService.usuario().permissaoAtual.idTenant == this.cotacao.idTenant
    );
  }

  private exibirBotoesFornecedor() {
    let usuario = this.authService.usuario();
    return (
      this.cotacao.participantes.findIndex(
        participante =>
          participante.idPessoaJuridica == usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica
      ) != -1
    );
  }

  private permitirProposta(): boolean {
    return (
      this.cotacao.situacao == SituacaoCotacao.Agendada &&
      moment().isAfter(moment(this.cotacao.dataInicio)) &&
      (this.situacao() === 'Em andamento' || this.situacao() === 'Em análise')
    );
  }

  private permitirRelatorioAnalise(): boolean {
    return !(this.rodadaEmAndamento() && this.envelopeFechadoHabilitado);
  }

  private rodadaEmAndamento(): boolean {
    return (
      this.cotacao.situacao == SituacaoCotacao.Agendada &&
      moment().isBetween(
        moment(this.cotacao.rodadaAtual.dataInicio),
        moment(this.cotacao.rodadaAtual.dataEncerramento)
      )
    );
  }

  private permitirAnalise(): boolean {
    let usuario = this.authService.usuario();
    return (
      usuario.permissaoAtual.idTenant == this.cotacao.idTenant &&
      (this.cotacao.situacao == SituacaoCotacao.Encerrada ||
        this.cotacao.situacao == SituacaoCotacao.Cancelada ||
        this.rodadaAtualEmAnalise() ||
        (this.rodadaAtualIniciada() && !this.envelopeFechadoHabilitado))
    );
  }

  private rodadaAtualIniciada(): boolean {
    return (
      this.cotacao.situacao == SituacaoCotacao.Agendada &&
      moment().isAfter(moment(this.cotacao.rodadaAtual.dataInicio))
    );
  }

  private rodadaAtualEmAnalise(): boolean {
    return (
      this.cotacao.situacao == SituacaoCotacao.Agendada &&
      moment().isAfter(moment(this.cotacao.rodadaAtual.dataEncerramento))
    );
  }

  public manterProposta() {
    this.verificarAceiteDeTermosDeBoasPraticas(this.cotacao);
  }

  private verificarAceiteDeTermosDeBoasPraticas(cotacao: Cotacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    var fornecedor: FornecedorInteressado;
    let idPessoaJuridica =
      this.authService.usuario().permissaoAtual.pessoaJuridica.idPessoaJuridica;

    this.fornecedorService
      .ObterFornecedorRedeLocalClientePorIdPessoaJuridica(this.cotacao.idTenant, idPessoaJuridica)
      .subscribe(
        response => {
          if (!response || (response && response.aceitarTermo)) {
            this.abrirModal(cotacao);
          } else {
            let participante = this.cotacao.participantes.find(
              participante =>
                participante.idPessoaJuridica ==
                this.authService.usuario().permissaoAtual.pessoaJuridica.idPessoaJuridica
            );
            if (
              !this.cotacao.possuiTermoConcordancia ||
              (participante && participante.aceitouTermos) ||
              !this.permitirProposta()
            ) {
              this.router.navigate(['cotacoes', this.cotacao.idCotacao, 'propostas'], {
                relativeTo: this.route
              });
            } else {
              this.router.navigate(['cotacoes', this.cotacao.idCotacao, 'aceite'], {
                relativeTo: this.route
              });
            }
          }

          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  private abrirModal(cotacao: Cotacao) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.cancelarLabel = 'none';
    modalRef.componentInstance.confirmarLabel = 'Voltar';

    modalRef.componentInstance.html = true;
    modalRef.componentInstance.confirmacao = `
      <p>Não foi possível prosseguir com esta ação pois os termos de boas práticas exigido por <b>${cotacao.razaoSocial}</b> não foram aceitos.</p>
      `;
  }

  public cotacaoItemVisivel(cotacao: Cotacao): boolean {
    if (
      cotacao.situacao == SituacaoCotacao.Cancelada ||
      (cotacao.itens != null && cotacao.flagCotacaoItemVisivel)
    ) {
      return true;
    }

    return false;
  }

  public gerarRelatorioAnalise(idCotacao: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.gerarRelatorioAnalise(idCotacao).subscribe(
      response => {
        this.arquivoService.createDownloadElement(
          response,
          `Relatório Análise Cotação ${idCotacao} - ${moment().format('YYYY_MM_DD-HH_mm')}.xls`
        );
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private definirParametrosSla() {
    if (this.cotacao.itens[0] && this.cotacao.itens[0].requisicaoItem) {
      if (this.cotacao.itens[0].requisicaoItem.dataHoraSla) {
        this.ultimoRegistroInicioSla = this.cotacao.itens[0].requisicaoItem.dataHoraSla;
      }

      if (
        this.cotacao.itens[0].requisicaoItem.itemSolicitacaoCompra &&
        this.cotacao.itens[0].requisicaoItem.itemSolicitacaoCompra.slaItem
      ) {
        this.tempoSla = this.cotacao.itens[0].requisicaoItem.itemSolicitacaoCompra.slaItem.tempo;
        this.unidadeMedidaTempoSla =
          this.cotacao.itens[0].requisicaoItem.itemSolicitacaoCompra.slaItem.unidadeMedidaTempo;
      } else {
        this.tempoSla = this.cotacao.itens[0].requisicaoItem.tempoSla;
        this.unidadeMedidaTempoSla = this.cotacao.itens[0].requisicaoItem.unidadeMedidaTempoSla;
      }

      this.tempoDecorrido = this.cotacao.itens[0].requisicaoItem.duracaoSla;
    } else {
      this.tempoSla = 0;
      this.unidadeMedidaTempoSla = 0;
      this.tempoDecorrido = 0;
    }
  }

  private permitirExibirSla() {
    if (this.authService.perfil() != PerfilUsuario.Fornecedor) return true;

    return false;
  }
}
