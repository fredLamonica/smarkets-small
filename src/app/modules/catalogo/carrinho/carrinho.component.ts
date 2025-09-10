import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService } from '../../../shared/services/mock/mock-data.service';
import { MockAuthService } from '../../../shared/services/mock/mock-auth.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
  tabAtiva = 1; // catalogo
  resumo: any = {};
  usuarioAtual: any;

  tabCarrinho = {
    catalogo: 1,
    requisicao: 2,
    regularizacao: 3
  };

  constructor(
    private router: Router,
    private mockDataService: MockDataService,
    private mockAuthService: MockAuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.obterResumo();
  }

  private loadUserData() {
    this.mockAuthService.getCurrentUser().subscribe(user => {
      this.usuarioAtual = user;
    });
  }

  onTabSelected(tab: number) {
    this.tabAtiva = tab;
  }

  obterResumo() {
    this.mockDataService.getCarrinhoResumo().subscribe(
      resumo => {
        this.resumo = resumo;
      }
    );
  }

  continuarComprando() {
    this.router.navigate(['/marketplace']);
  }

  solicitarEsvaziarCarrinho() {
    if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
      // Simular esvaziamento do carrinho
      this.resumo = {
        quantidadeItensCatalogo: 0,
        quantidadeItensRequisicao: 0,
        quantidadeItensRegularizacao: 0,
        valor: 0
      };
      alert('Carrinho esvaziado com sucesso!');
    }
  }

  podeEsvaizarCarrinho(): boolean {
    return this.resumo?.quantidadeItensCatalogo > 0 || 
           this.resumo?.quantidadeItensRequisicao > 0 || 
           this.resumo?.quantidadeItensRegularizacao > 0;
  }

  exibirRequisicoes(): boolean {
    return this.usuarioAtual?.permissaoAtual?.pessoaJuridica?.habilitarModuloCotacao;
  }

  exibirRegularizacoes(): boolean {
    return this.usuarioAtual?.permissaoAtual?.pessoaJuridica?.habilitarRegularizacao;
  }
}