import { Component, OnInit } from '@angular/core';
import { MockAuthService } from '../../../shared/services/mock/mock-auth.service';
import { MockDataService } from '../../../shared/services/mock/mock-data.service';
import { MockMenuService } from '../../../shared/services/mock/mock-menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  usuario: any;
  nomeUsuario: string;
  acessoRapido: any[] = [];
  precisaAceitarTermo = false;
  mensagemDeAlertaDeclinado: string = null;
  mensagemDeAlertaHomologadoComPendencias: string = null;

  // Enums simulados
  PerfilUsuario = {
    1: 'Gestor',
    2: 'Aprovador', 
    3: 'Requisitante',
    4: 'Fornecedor',
    5: 'Cadastrador',
    6: 'GestorDeFornecedores',
    7: 'Administrador'
  };

  configuracaoDash = {
    Padrao: 1,
    Integracao: 2,
    PendenciaFornecedores: 3,
    FastEquote: 4
  };

  constructor(
    private mockAuthService: MockAuthService,
    private mockDataService: MockDataService,
    private mockMenuService: MockMenuService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadAcessoRapido();
  }

  private loadUserData() {
    this.mockAuthService.getCurrentUser().subscribe(user => {
      this.usuario = user;
      this.nomeUsuario = user?.pessoaFisica?.nome;
    });
  }

  private loadAcessoRapido() {
    this.mockMenuService.getAcessoRapido().subscribe(acesso => {
      this.acessoRapido = acesso;
    });
  }

  getProfileEnum(): string {
    const perfil = this.usuario?.permissaoAtual?.perfil;
    return this.PerfilUsuario[perfil] || 'Usuário';
  }

  showAcessoRapido(): boolean {
    return this.acessoRapido && this.acessoRapido.length > 0;
  }

  corAcessoRapido(index: number): string {
    const cores = ['btn-primary', 'btn-success', 'btn-warning', 'btn-info'];
    return cores[index % cores.length];
  }

  finalizarAceiteDeTermos() {
    this.precisaAceitarTermo = false;
  }
}