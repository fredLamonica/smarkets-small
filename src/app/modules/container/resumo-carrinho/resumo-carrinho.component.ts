import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService } from '../../../shared/services/mock/mock-data.service';

@Component({
  selector: 'resumo-carrinho',
  templateUrl: './resumo-carrinho.component.html',
  styleUrls: ['./resumo-carrinho.component.scss']
})
export class ResumoCarrinhoComponent implements OnInit {
  resumo: any = {
    quantidadeItensCatalogo: 0,
    quantidadeItensRequisicao: 0,
    quantidadeItensRegularizacao: 0,
    valor: 0
  };
  atualizando = false;

  constructor(
    private router: Router,
    private mockDataService: MockDataService
  ) {}

  ngOnInit() {
    this.carregarResumo();
  }

  private carregarResumo() {
    this.atualizando = true;
    this.mockDataService.getCarrinhoResumo().subscribe(
      resumo => {
        this.resumo = resumo;
        this.atualizando = false;
      },
      error => {
        this.atualizando = false;
        console.error('Erro ao carregar resumo do carrinho:', error);
      }
    );
  }

  irCarrinho() {
    this.router.navigate(['/carrinho']);
  }
}