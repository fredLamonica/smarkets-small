import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private router: Router) {
    // Verificar se já existe token no localStorage
    const token = localStorage.getItem('mock-token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.loadMockUser();
    }
  }

  login(credentials: any): Observable<any> {
    // Simular login - aceita qualquer credencial
    const mockResponse = {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: this.getMockUser()
    };

    // Salvar token no localStorage
    localStorage.setItem('mock-token', mockResponse.token);
    localStorage.setItem('mock-user', JSON.stringify(mockResponse.user));

    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(mockResponse.user);

    return of(mockResponse).pipe(delay(1000));
  }

  logout(): void {
    localStorage.removeItem('mock-token');
    localStorage.removeItem('mock-user');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  private loadMockUser(): void {
    const userData = localStorage.getItem('mock-user');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    } else {
      this.currentUserSubject.next(this.getMockUser());
    }
  }

  private getMockUser(): any {
    return {
      idUsuario: 1,
      email: 'usuario@smarkets.com',
      pessoaFisica: {
        nome: 'João Silva',
        telefone: '(11) 99999-9999',
        celular: '(11) 88888-8888',
        ramal: '1234'
      },
      permissaoAtual: {
        idTenant: 1,
        perfil: 1, // Gestor
        pessoaJuridica: {
          idPessoaJuridica: 1,
          cnpj: '12.345.678/0001-90',
          razaoSocial: 'Empresa Teste LTDA',
          nomeFantasia: 'Empresa Teste',
          logo: null,
          configuracaoDash: 1,
          habilitarIntegracaoERP: true,
          habilitarModuloCotacao: true,
          habilitarRegularizacao: true,
          habilitarImobilizado: true,
          habilitarMFA: false,
          habilitarModuloFornecedores: true
        }
      },
      permissoes: [
        {
          idTenant: 1,
          perfil: 1,
          pessoaJuridica: {
            idPessoaJuridica: 1,
            cnpj: '12.345.678/0001-90',
            razaoSocial: 'Empresa Teste LTDA',
            nomeFantasia: 'Empresa Teste'
          }
        },
        {
          idTenant: 2,
          perfil: 2,
          pessoaJuridica: {
            idPessoaJuridica: 2,
            cnpj: '98.765.432/0001-10',
            razaoSocial: 'Empresa Filial LTDA',
            nomeFantasia: 'Empresa Filial'
          }
        }
      ]
    };
  }

  // Métodos para MFA (simulados)
  setupMFA(): Observable<any> {
    return of({
      qrCodeSetupImageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      manualEntryKey: 'JBSWY3DPEHPK3PXP'
    }).pipe(delay(1000));
  }

  verifyMFA(code: string): Observable<any> {
    return of({ success: true }).pipe(delay(500));
  }

  // Métodos para recuperação de senha
  recuperarSenha(email: string): Observable<any> {
    return of({ success: true, message: 'Email de recuperação enviado' }).pipe(delay(1000));
  }

  redefinirSenha(dados: any): Observable<any> {
    return of({ success: true, message: 'Senha redefinida com sucesso' }).pipe(delay(1000));
  }
}