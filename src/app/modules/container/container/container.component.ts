import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockAuthService } from '../../../shared/services/mock/mock-auth.service';
import { MockMenuService } from '../../../shared/services/mock/mock-menu.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  usuario: any;
  menu: any = { menuPrincipal: [], menuLateral: [] };
  acessoRapido: any[] = [];

  constructor(
    private router: Router,
    private mockAuthService: MockAuthService,
    private mockMenuService: MockMenuService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadMenu();
    this.loadAcessoRapido();
  }

  private loadUserData() {
    this.mockAuthService.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });
  }

  private loadMenu() {
    this.mockMenuService.getMenu().subscribe(menu => {
      this.menu = menu;
    });
  }

  private loadAcessoRapido() {
    this.mockMenuService.getAcessoRapido().subscribe(acesso => {
      this.acessoRapido = acesso;
    });
  }

  navigateHome() {
    this.router.navigate(['/dashboard']);
  }

  navigate(item: any) {
    if (item.rota) {
      this.router.navigate([item.rota]);
    }
  }

  customBrand(): string {
    if (this.usuario?.permissaoAtual?.pessoaJuridica?.nomeFantasia) {
      const words = this.usuario.permissaoAtual.pessoaJuridica.nomeFantasia.split(' ');
      return words.map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    }
    return 'SM';
  }

  corAcessoRapido(index: number): string {
    const cores = ['btn-primary', 'btn-success', 'btn-warning', 'btn-info'];
    return cores[index % cores.length];
  }

  showAcessoRapido(): boolean {
    return this.acessoRapido && this.acessoRapido.length > 0;
  }

  abrirFormularioDeSuporte() {
    // Simular abertura de formulário de suporte
    alert('Formulário de suporte aberto (simulado)');
  }

  obterDadosAutenticacao() {
    this.loadUserData();
  }
}