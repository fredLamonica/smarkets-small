import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MockAuthService } from '../../../shared/services/mock/mock-auth.service';

@Component({
  selector: 'info-usuario',
  templateUrl: './info-usuario.component.html',
  styleUrls: ['./info-usuario.component.scss']
})
export class InfoUsuarioComponent implements OnInit {
  @Output() trocaPermissao = new EventEmitter();

  usuario: any;
  permissoes: any[] = [];
  PerfilUsuario = {
    1: 'Gestor',
    2: 'Aprovador',
    3: 'Requisitante',
    4: 'Fornecedor',
    5: 'Cadastrador',
    6: 'GestorDeFornecedores',
    7: 'Administrador'
  };

  constructor(
    private router: Router,
    private mockAuthService: MockAuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    this.mockAuthService.getCurrentUser().subscribe(user => {
      this.usuario = user;
      this.permissoes = user?.permissoes || [];
    });
  }

  listarPermissoes() {
    // Método chamado quando dropdown é aberto
  }

  configurarPerfil() {
    this.router.navigate(['/area-usuario/informacoes-pessoais']);
  }

  trocarPermissao(permissao: any) {
    if (this.usuario) {
      this.usuario.permissaoAtual = permissao;
      localStorage.setItem('mock-user', JSON.stringify(this.usuario));
      this.trocaPermissao.emit();
      // Recarregar a página para aplicar mudanças
      window.location.reload();
    }
  }

  signOut() {
    this.mockAuthService.logout();
  }

  getProfileEnum(permissao?: any): string {
    const perfil = permissao ? permissao.perfil : this.usuario?.permissaoAtual?.perfil;
    return this.PerfilUsuario[perfil] || 'Usuário';
  }
}