import { Component, OnInit } from '@angular/core';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManterConfiguracoesFornecedorInteressadoComponent } from './manter-configuracoes-fornecedor-interessado/manter-configuracoes-fornecedor-interessado.component';
import { ManterConfiguracaoTermosBoasPraticasComponent } from './manter-configuracao-termos-boas-praticas/manter-configuracao-termos-boas-praticas.component';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router, ActivatedRoute } from '@angular/router';
import { ManterConfiguracaoVencimentoComponent } from './manter-configuracao-vencimento/manter-configuracao-vencimento.component';
import { ControleAcoesPorStatusComponent } from './controle-acoes-por-status/controle-acoes-por-status.component';

@Component({
  selector: 'configuracoes-fornecedor',
  templateUrl: './configuracoes-fornecedor.component.html',
  styleUrls: ['./configuracoes-fornecedor.component.scss']
})
export class ConfiguracoesFornecedorComponent implements OnInit, OperacoesFiltro {
  ResetPagination() {
    // throw new Error("Method not implemented.");
  }
  Hydrate(termo?: string) {
    // throw new Error("Method not implemented.");
  }
  onScroll(termo?: string) {
    // throw new Error("Method not implemented.");
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  public editarPaginaFornecedorInteressado() {
    const modalRef = this.modalService.open(ManterConfiguracoesFornecedorInteressadoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.result.then(result => {});
  }

  public editarTermosBoasPraticasFornecedor() {
    const modalRef = this.modalService.open(ManterConfiguracaoTermosBoasPraticasComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.result.then(result => {});
  }

  public editarVisitaTecnica() {
    this.router.navigate(['/fornecedores/configuracoes/visitatecnica'], { relativeTo: this.route });
  }

  public editarAvaliacaoFornecedor() {
    this.router.navigate(['/fornecedores/configuracoes/parametrosavaliacao'], {
      relativeTo: this.route
    });
  }

  public editarConfiguracaoVencimento() {
    const modalRef = this.modalService.open(ManterConfiguracaoVencimentoComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.result.then(result => {});
  }

  public mostrarControleAcoesPorStatus() {
    const modalRef = this.modalService.open(ControleAcoesPorStatusComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.result.then(result => {});
  }
}
