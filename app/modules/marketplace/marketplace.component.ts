import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Unsubscriber } from '../../shared/components/base/unsubscriber';
import { TipoCatalogoItem } from '../../shared/models/enums/tipo-catalogo-item';
import { AutenticacaoService } from '../../shared/providers/autenticacao.service';
import { AbaCatalogoComponent } from './components/aba-catalogo/aba-catalogo.component';
import { AbaRequisicaoComponent } from './components/aba-requisicao/aba-requisicao.component';
import { FiltroSuperiorMarketplace } from './models/filtro-superior-marketplace';

@Component({
  selector: 'smk-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent extends Unsubscriber implements OnInit {

  @ViewChild('abaCatalogo') abaCatalogo: AbaCatalogoComponent;
  @ViewChild('abaRequisicao') abaRequisicao: AbaRequisicaoComponent;

  TipoCatalogoItem = TipoCatalogoItem;
  tabAtiva: TipoCatalogoItem = TipoCatalogoItem.Catalogo;
  idEmpresa: number;
  abaRequisicoesDisponivel: boolean;
  filtroSuperior: FiltroSuperiorMarketplace = new FiltroSuperiorMarketplace();
  triggerFocusEmpresaCompradora: Subject<void> = new Subject<void>();

  constructor(
    private authService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() {
    const usuario = this.authService.usuario();
    this.abaRequisicoesDisponivel = usuario.permissaoAtual.pessoaJuridica.habilitarModuloCotacao;
  }

  empresaChange(idEmpresa: number) {
    idEmpresa ? this.idEmpresa = idEmpresa : this.idEmpresa = 0;
  }

  executeTriggerFocusEmpresaCompradora(): void {
    this.triggerFocusEmpresaCompradora.next();
  }

  busca(filtroSuperior: FiltroSuperiorMarketplace) {
    this.filtroSuperior = filtroSuperior;
  }

  selectTab(tab: TipoCatalogoItem) {
    if (this.tabAtiva !== tab) {
      this.tabAtiva = tab;
    }
  }
}
