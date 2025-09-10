import { Component, OnInit, ViewChild } from '@angular/core';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { AutenticacaoService } from '@shared/providers';
import { Usuario } from '@shared/models';
import { ListarCriteriosAvaliacaoComponent } from './configuracoes/criterio-avaliacao-pedido/listar-criterios-avaliacao/listar-criterios-avaliacao.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';

@Component({
  selector: 'configuracoes-pedido',
  templateUrl: './configuracoes-pedido.component.html',
  styleUrls: ['./configuracoes-pedido.component.scss']
})
export class ConfiguracoesPedidoComponent implements OnInit {

  public termo: string;
  public habilitarModuloCotacao: boolean = false;
  

  public tabAtiva: "configuracoes";

  constructor(private authService: AutenticacaoService) { }

  ngOnInit() {
    let usuario: Usuario = this.authService.usuario();
    this.tabAtiva = "configuracoes";
  }

  public selectTab(aba: "configuracoes") {
      this.tabAtiva = "configuracoes";
  }
}
