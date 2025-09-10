import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MockDataService } from '../../shared/services/mock/mock-data.service';

@Component({
  selector: 'smk-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {
  tabAtiva = 1; // TipoCatalogoItem.Catalogo
  idEmpresa: number;
  filtroSuperior: any = {};
  triggerFocusEmpresaCompradora = new Subject();
  abaRequisicoesDisponivel = true;

  TipoCatalogoItem = {
    Catalogo: 1,
    Requisicao: 2
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    // Carregar empresa padrão
    this.idEmpresa = 1;
  }

  selectTab(tab: number) {
    this.tabAtiva = tab;
  }

  busca(filtro: any) {
    this.filtroSuperior = filtro;
  }

  empresaChange(idEmpresa: number) {
    this.idEmpresa = idEmpresa;
  }

  executeTriggerFocusEmpresaCompradora() {
    this.triggerFocusEmpresaCompradora.next();
  }

  navegueTelaProdutos() {
    // Navegar para tela de produtos (simulado)
    console.log('Navegando para tela de produtos');
  }
}