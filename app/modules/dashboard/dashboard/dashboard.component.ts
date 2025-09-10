import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Arquivo, ItemMenu, PerfilUsuario, PerfilUsuarioLabel, StatusFornecedor, Usuario } from '@shared/models';
import { FornecedorInteressado } from '@shared/models/fornecedor-interessado';
import { ArquivoService, AutenticacaoService, FornecedorService, MenuService, PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { AceiteTermosComponent } from 'src/app/modules/dashboard/aceite-termos/aceite-termos.component';
import { DashboardAprovadorComponent } from '../dashboard-aprovador/dashboard-aprovador.component';
import { DashboardFornecedorComponent } from '../dashboard-fornecedor/dashboard-fornecedor.component';
import { DashboardGestorComponent } from '../dashboard-gestor/dashboard-gestor.component';
import { ConfiguracaoDash } from './../../../shared/models/enums/configuracao-dash';
import { Dashboard } from './../dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  get nomeUsuario(): string {
    if (this.usuario && this.usuario.pessoaFisica && this.usuario.pessoaFisica.nome) {
      const nomes = this.usuario.pessoaFisica.nome.split(' ');
      if (nomes && nomes.length) {
        return nomes[0];
      }
    }

    return null;
  }

  get dashboard(): Dashboard {
    switch (this.usuario.permissaoAtual.perfil) {
      case PerfilUsuario.Gestor:
      case PerfilUsuario.GestorDeFornecedores:
      case PerfilUsuario.Administrador: {
        return this.dashboardGestor;
      }
      case PerfilUsuario.Aprovador: {
        return this.dashboardAprovador;
      }
      default: {
        return null;
      }
    }
  }
  static atualizarDashboard: Subject<any> = new Subject();

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('dashboardGestor') dashboardGestor: DashboardGestorComponent;
  @ViewChild('dashboardAprovador') dashboardAprovador: DashboardAprovadorComponent;
  @ViewChild('dashboardPendenciaFornecedores')
  dashboardPendenciaFornecedores: DashboardFornecedorComponent;

  @ViewChild('aceiteDeTermos') aceiteDeTermos: AceiteTermosComponent;

  usuario: Usuario;
  fornecedor: FornecedorInteressado;
  acessoRapido: Array<ItemMenu>;
  PerfilUsuario = PerfilUsuario;
  mensagemDeAlertaDeclinado: string = null;
  mensagemDeAlertaHomologadoComPendencias: string = null;

  fornecedoresAguardandoAceite: Array<FornecedorInteressado> =
    new Array<FornecedorInteressado>();

  pdfs: Array<SafeUrl> = new Array<SafeUrl>();
  pospdf: number = 0;
  precisaAceitarTermo: boolean;

  configuracaoDash = ConfiguracaoDash;
  private arquivoEmBase64: string;
  private arquivo: Arquivo;
  private subscriptions: Subscription[] = [];
  private perfilUsuario = PerfilUsuario;

  constructor(
    private autenticacaoService: AutenticacaoService,
    private menuService: MenuService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fornecedorService: FornecedorService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private arquivoService: ArquivoService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (!this.route.snapshot.queryParams['noinitialize']) {
      this.initialize();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  initialize(): void {
    this.atualizarDashboard();
    this.subscribe();
    this.obterMensagemDeAlerta();
    DashboardComponent.atualizarDashboard.next();
  }

  atualizarDashboard() {
    this.usuario = this.autenticacaoService.usuario();
    this.acessoRapido = this.menuService.obterAcessoRapido();
    this.obterTermosBoasPraticasFornecedor(this.usuario);
  }

  subscribe() {
    this.subscriptions.push(
      DashboardComponent.atualizarDashboard.subscribe(() => {
        this.atualizarDashboard();
        if (this.dashboard) {
          this.dashboard.construirDashboard();
        }
      }),
    );
  }

  corAcessoRapido(index: number): string {
    return ['bg-purple', 'bg-indigo', ''][index];
  }

  obterTermosBoasPraticasFornecedor(usuario) {
    this.fornecedoresAguardandoAceite = new Array<FornecedorInteressado>();
    this.precisaAceitarTermo = false;
    this.pdfs = new Array<SafeUrl>();
    this.pospdf = 0;

    if (
      usuario.permissaoAtual.perfil == PerfilUsuario.Fornecedor &&
      usuario.permissaoAtual.pessoaJuridica.cnpj &&
      usuario.idUsuario == usuario.permissaoAtual.pessoaJuridica.idUsuarioPrincipal
    ) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      const cnpj = usuario.permissaoAtual.pessoaJuridica.cnpj;

      this.subscriptions.push(
        this.fornecedorService.obterPorCnpj(cnpj).subscribe(
          (response) => {
            this.blockUI.stop();
            const fornecedores = response.filter(
              (f) => f.pessoaJuridica.idTenant == this.usuario.permissaoAtual.idTenant,
            );
            fornecedores.forEach((fornecedor) => {
              if (fornecedor.aceitarTermo) {
                this.fornecedor = fornecedor;
                this.precisaAceitarTermo = true;
                this.fornecedoresAguardandoAceite.push(fornecedor);
              }
            });
            this.fornecedoresAguardandoAceite.forEach((fornecedor) => {
              this.obterArquivo(fornecedor);
            });
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        ),
      );
    }
  }

  finalizarAceiteDeTermos() {
    if (this.pospdf < this.pdfs.length - 1) {
      this.pospdf += 1;
    } else {
      this.precisaAceitarTermo = false;
    }
  }

  showAcessoRapido() {
    return (
      this.usuario.permissaoAtual.perfil == this.perfilUsuario.Fornecedor ||
      this.router.url === '/marketplace'
    );
  }

  getProfileEnum() {
    return PerfilUsuarioLabel.get(this.usuario.permissaoAtual.perfil);
  }

  private obterMensagemDeAlerta() {
    if (this.usuario.permissaoAtual.perfil == PerfilUsuario.Fornecedor) { this.obterFornecedor(); }
  }

  private obterFornecedor() {
    const cnpj = this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica.cnpj;
    const idTenant = this.autenticacaoService.usuario().permissaoAtual.idTenant;
    this.subscriptions.push(
      this.fornecedorService.obterPorCnpj(cnpj).subscribe((fornecedores) => {
        this.montarMensagemDeAlerta(
          fornecedores.filter((f) => f.pessoaJuridica.idTenant == idTenant),
        );
      }),
    );
  }

  private obterArquivo(fornecedor) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.subscriptions.push(
      this.arquivoService.obterPorIdFornecedor(fornecedor.idFornecedor).subscribe(
        (response) => {
          this.arquivo = response;
          this.obterBase64();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      ),
    );
  }

  private montarMensagemDeAlerta(fornecedores: Array<FornecedorInteressado>) {
    fornecedores.forEach((f) => {
      if (f.status == StatusFornecedor.Bloqueado) {
        this.subscriptions.push(
          this.pessoaJuridicaService.obterPorIdTenant(f.idTenant).subscribe((pessoaJuridica) => {
            this.adicionarRazaoSocinalNaMensagemDeclinado(pessoaJuridica.razaoSocial);
          }),
        );
      }

      if (f.status == StatusFornecedor.AtivoComPendencias) {
        this.subscriptions.push(
          this.pessoaJuridicaService.obterPorIdTenant(f.idTenant).subscribe((pessoaJuridica) => {
            this.adicionarRazaoSocialNaMensagemHomologadoComPendencias(pessoaJuridica.razaoSocial);
          }),
        );
      }
    });
  }

  private adicionarRazaoSocinalNaMensagemDeclinado(razaoSocial: string) {
    if (this.mensagemDeAlertaDeclinado == null) {
      this.mensagemDeAlertaDeclinado =
        'Seu acesso está limitado com o cliente . Favor entrar em contato com o gestor de fornecedor para mais informações.';
      this.mensagemDeAlertaDeclinado = this.mensagemDeAlertaDeclinado.replace(
        '. Favor entrar em contato com o gestor de fornecedor para mais informações.',
        razaoSocial + '. Favor entrar em contato com o gestor de fornecedor para mais informações.',
      );
    } else {
      this.mensagemDeAlertaDeclinado = this.mensagemDeAlertaDeclinado.replace(
        'o cliente',
        'os clientes',
      );
      this.mensagemDeAlertaDeclinado = this.mensagemDeAlertaDeclinado.replace(
        '. Favor entrar em contato com o gestor de fornecedor para mais informações.',
        ', ' +
        razaoSocial +
        '. Favor entrar em contato com o gestor de fornecedor para mais informações.',
      );
    }
  }

  private adicionarRazaoSocialNaMensagemHomologadoComPendencias(razaoSocial: string) {
    if (this.mensagemDeAlertaHomologadoComPendencias == null) {
      this.mensagemDeAlertaHomologadoComPendencias =
        'Você tem pendências com o cliente . Favor entrar em contato com o gestor de fornecedor para mais informações.';
      this.mensagemDeAlertaHomologadoComPendencias =
        this.mensagemDeAlertaHomologadoComPendencias.replace(
          '. Favor entrar em contato com o gestor de fornecedor para mais informações.',
          razaoSocial +
          '. Favor entrar em contato com o gestor de fornecedor para mais informações.',
        );
    } else {
      this.mensagemDeAlertaHomologadoComPendencias =
        this.mensagemDeAlertaHomologadoComPendencias.replace('o cliente', 'os clientes');
      this.mensagemDeAlertaHomologadoComPendencias =
        this.mensagemDeAlertaHomologadoComPendencias.replace(
          '. Favor entrar em contato com o gestor de fornecedor para mais informações.',
          ', ' +
          razaoSocial +
          '. Favor entrar em contato com o gestor de fornecedor para mais informações.',
        );
    }
  }

  private obterBase64() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.subscriptions.push(
      this.arquivoService.obterBase64(this.arquivo.idArquivo).subscribe(
        (response) => {
          this.arquivoEmBase64 = response;
          this.gerarPdf();
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      ),
    );
  }

  private gerarPdf() {
    this.pdfs.push(
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'data:application/pdf;base64,' + this.arquivoEmBase64,
      ),
    );
  }
}
