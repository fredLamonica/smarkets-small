import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { Usuario } from '../../../../shared/models';
import { AutenticacaoService, LocalStorageService, TranslationLibraryService } from '../../../../shared/providers';

@Component({
  selector: 'smk-area-usuario',
  templateUrl: './area-usuario.component.html',
  styleUrls: ['./area-usuario.component.scss'],
})
export class AreaUsuarioComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  configuracoes = new Array<{ icone: string, titulo: string, texto: string, rota?: Array<string>, acaoBotao: string, class: string, metodoAcao?: () => void }>();
  usuarioLogado: Usuario;

  private _backofficeLoginUrl = `${environment.backofficeAppUrl}login`;
  safeUrl: any;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private authService: AutenticacaoService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._backofficeLoginUrl);
  }

  ngOnInit() {
    this.inicializeConfiguracoes();
    if (!this.usuarioLogado) {
      this.obterUsuarioLogado();

    }
  }

  autenticarPainelOperacoesFUP() {
    this.authService.redirectPainelOperacoesFup(this.usuarioLogado).subscribe(
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private obterUsuarioLogado() {
    this.usuarioLogado = this.authService.usuario();
  }

  private navegueParaFup(): void {
    let token = this.localStorageService.get('accessToken');
    this.postCrossDomainMessage(token)
  }

  private postCrossDomainMessage(token) {
    let postURL = `${environment.backofficeAppUrl}`;
    let iframeId: any;
    const linkURL = this._backofficeLoginUrl;
    iframeId = 'backoffice';
    var iframe = document.getElementById(iframeId);
    if (iframe == null) return;

    var iWindow = (<HTMLIFrameElement>iframe).contentWindow;
    window.open(linkURL, '_blank');
    const storageData = token;
    iWindow.postMessage(storageData, postURL);
  }

  private inicializeConfiguracoes(): void {
    this.configuracoes.push(
      {
        icone: 'fas fa-server',
        titulo: 'Painel de Operações',
        texto: `Auto acesso ao Módulos Operações Smarkets.`,
        acaoBotao: 'Acessar Operações',
        class: 'btn btn-block  link-configuracoes-button',
        metodoAcao: () => this.navegueParaFup()
      },
      {
        icone: 'fas fa-address-card',
        titulo: 'Informações pessoais',
        rota: ['informacoes-pessoais'],
        texto: `Configure seu dados pessoais, informações básicas, contato e senha.`,
        acaoBotao: 'Configurar',
        class: 'link-configuracoes',
      },
      {
        icone: 'fas fa-heart',
        titulo: 'Favoritos',
        rota: ['favoritos'],
        texto: `Produtos ou serviços marcados como favoritos.`,
        acaoBotao: 'Acessar',
        class: 'link-configuracoes',
      },
      {
        icone: 'fas fa-history',
        titulo: 'Histórico de Compras',
        rota: ['historico-compras'],
        texto: `Histórico de compras e vendas na plataforma de forma simples.`,
        acaoBotao: 'Acessar',
        class: 'link-configuracoes',

      },
      // {
      //   icone: 'fas fa-notifications',
      //   titulo: 'Minhas Pendências',
      //   rota: '../favoritos',
      //   texto: `Configure e habilite os módulos para utilização da plataforma e experiência no fluxo de compras.`,
      //   acaoBotao:'Acessar',
      //   class: 'link-configuracoes'
      // },
      {
        icone: 'fas fa-solid fa-bell',
        titulo: 'Notificações',
        rota: ['notificacoes'],
        texto: `Área de notificações informativo e atualizações em processos.`,
        acaoBotao: 'Acessar',
        class: 'link-configuracoes',
      });
  }

}
