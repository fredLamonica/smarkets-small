import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Subject } from 'rxjs';
import { TipoCatalogoItem } from '../../shared/models';
import { AutenticacaoService } from '../../shared/providers';
import { AbaContratoComponent } from './components/base/aba-contrato.component';
import { FiltroSuperiorContrato } from './models/filtro-superior-contrato';

@Component({
  selector: 'smk-contratos-fornecedor',
  templateUrl: './contratos-fornecedor.component.html',
  styleUrls: ['./contratos-fornecedor.component.scss']
})
export class ContratosFornecedorComponent extends Unsubscriber implements OnInit {

  @ViewChild('abaContratoFornecedor') abaContratoFornecedor: AbaContratoComponent;

  TipoCatalogoItem = TipoCatalogoItem;
  tabAtiva: TipoCatalogoItem = TipoCatalogoItem.Catalogo;
  idEmpresa: number;
  abaRequisicoesDisponivel: boolean;
  filtroSuperior: FiltroSuperiorContrato = new FiltroSuperiorContrato();
  triggerFocusEmpresaFornecedora: Subject<void> = new Subject<void>();

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    const usuario = this.authService.usuario();
    this.abaRequisicoesDisponivel = usuario.permissaoAtual.pessoaJuridica.habilitarModuloCotacao;
  }

  executeTriggerFocusEmpresaFornecedora(): void {
    this.triggerFocusEmpresaFornecedora.next();
  }

  busca(filtroSuperior: FiltroSuperiorContrato) {
    this.filtroSuperior = filtroSuperior;
  }

  navegueTelaProdutos(): void {
    this.router.navigate(['produtos-catalogo-fornecedor'] );
  }


}
