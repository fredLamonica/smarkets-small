import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ItemMenu, PerfilUsuario, Usuario } from '@shared/models';
import { Menu } from '@shared/models/menu';
import { AutenticacaoService, MenuService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { SuporteComponent } from '../../suporte/suporte/suporte.component';
import { InfoUsuarioComponent } from '../info-usuario/info-usuario.component';

declare var jQuery: any;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent extends Unsubscriber implements OnInit {

  static atualizarMenu: Subject<any> = new Subject();
  static atualizarHome: Subject<any> = new Subject();

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('infoUsuario') infoUsuario: InfoUsuarioComponent;
  @ViewChild('accordion') accordion: NgbAccordion;

  usuario: Usuario;
  PerfilUsuario = PerfilUsuario;

  menu: Menu;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private translationLibrary: TranslationLibraryService,
    private translate: TranslateService,
    private authService: AutenticacaoService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.obterDadosAutenticacao();
    this.subscribe();
  }

  subscribe() {
    ContainerComponent.atualizarHome.subscribe((message) => {
      this.obterDadosAutenticacao();
    });
  }

  obterDadosAutenticacao() {
    this.usuario = this.authService.usuario();
    this.obterMenu();
  }

  navigateHome() {
    this.authService.navegueParaHome();
  }

  changeLanguage(language: string) {
    this.translate.use(language);
  }

  navigate(itemMenu: ItemMenu) {
    if (itemMenu.queryParams) {
      this.router.navigate([itemMenu.rota], { queryParams: itemMenu.queryParams });
    } else {
      this.router.navigate([itemMenu.rota]);
    }

    this.closeNav();
  }

  closeNav() {
    this.accordion.collapseAll();
    jQuery('.dropdown.open .dropdown-toggle').dropdown('toggle');
  }

  customBrand(): string {
    const empresa = this.usuario.permissaoAtual.pessoaJuridica;
    const name: any = empresa.nomeFantasia
      ? empresa.nomeFantasia
      : empresa.razaoSocial.toLowerCase().replace('ltda', '').replace('me', '');

    let initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials.toUpperCase();
  }

  abrirFormularioDeSuporte(): void {
    this.modalService.open(SuporteComponent, { centered: true, backdrop: 'static', size: 'lg', keyboard: false }).result.then(
      () => { },
      () => { },
    );
  }

  private obterMenu() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.menu = this.menuService.obterMenu();
    this.blockUI.stop();
  }
}
