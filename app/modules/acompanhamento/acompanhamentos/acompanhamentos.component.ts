import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Moeda, Ordenacao, PerfilUsuario,
  SituacaoCotacao, SituacaoSolicitacaoItemCompra, SolicitacaoCompra
} from '@shared/models';
import { AcompanhamentosDto } from '@shared/models/dto/acompanhamentos-dto';
import { AcompanhamentoFiltro } from '@shared/models/fltros/acompanhamento-filtro';
import {
  AutenticacaoService, LocalStorageService, SolicitacaoCompraService, TranslationLibraryService
} from '@shared/providers';
import { AcompanhamentosService } from '@shared/providers/acompanhamentos.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AcompanhamentoSimplesFiltro } from '../../../shared/models/fltros/acompanhamento-simples-filtro';
import { Acompanhamento } from '../acompanhamento';
import { SituacaoPedido } from './../../../shared/models/enums/situacao-pedido';

@Component({
  selector: 'acompanhamentos',
  templateUrl: './acompanhamentos.component.html',
  styleUrls: ['./acompanhamentos.component.scss'],
})
@Pipe({
  name: 'situacaoPedido',
})
export class AcompanhamentosComponent implements OnInit, Acompanhamento {
  @BlockUI() blockUI: NgBlockUI;

  itensAcompanhamentos: Array<AcompanhamentosDto>;
  SituacaoSolicitacaoItemCompra = SituacaoSolicitacaoItemCompra;
  SituacaoCotacao = SituacaoCotacao;
  SituacaoPedido = SituacaoPedido;
  Moeda = Moeda;
  flagBotaoAlterarResponsavelVisivel: boolean = false;

  private acompanhamentoSimplesFiltro: AcompanhamentoSimplesFiltro = new AcompanhamentoSimplesFiltro();
  private acompanhamentoFiltro: AcompanhamentoFiltro = new AcompanhamentoFiltro();
  private filtroAcompanhamento = 'filtroAcompanhamento';

  private totalPaginas: number;
  private pagina: number;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private authService: AutenticacaoService,
    private modalService: NgbModal,
    private acompanhamentosService: AcompanhamentosService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.resetPaginacao();

    const filtroAcompanhamento = this.localStorageService.getObject(this.filtroAcompanhamento);
    if (filtroAcompanhamento) {
      this.obterFiltroAvancado(filtroAcompanhamento);
    } else {
      // this.obter();
      this.obterFiltroAvancado(new AcompanhamentoFiltro());
    }
  }

  resetPaginacao() {
    this.itensAcompanhamentos = new Array<AcompanhamentosDto>();
    this.pagina = 1;
  }

  onScroll(termo: string = '', parametrosFiltroAvancado: any[] = null) {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      if (parametrosFiltroAvancado != null) {
        this.obterFiltroAvancado(parametrosFiltroAvancado);
      } else { this.obter(termo); }
    }
  }

  obterFiltroAvancado(parametrosFiltroAvancado: any[] | AcompanhamentoFiltro) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.acompanhamentoFiltro.construirFiltroAvancado(
      parametrosFiltroAvancado,
      'isc.IdItemSolicitacaoCompra',
      Ordenacao.ASC,
      32,
      this.pagina,
    );

    this.acompanhamentosService.obterFiltroAvancado(this.acompanhamentoFiltro).subscribe(
      (response) => {
        if (response) {
          this.itensAcompanhamentos = this.itensAcompanhamentos.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.itensAcompanhamentos = new Array<AcompanhamentosDto>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  obter(termo: string = '') {

    const ITENS_POR_PAGINA = 32;
    this.acompanhamentoSimplesFiltro.itemOrdenar = 'isc.IdItemSolicitacaoCompra';
    this.acompanhamentoSimplesFiltro.ordenacao = Ordenacao.ASC;
    this.acompanhamentoSimplesFiltro.itensPorPagina = ITENS_POR_PAGINA;
    this.acompanhamentoSimplesFiltro.pagina = this.pagina;
    this.acompanhamentoSimplesFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.acompanhamentosService
      .obterFiltro(this.acompanhamentoSimplesFiltro)
      .subscribe(
        (response) => {
          if (response) {
            this.itensAcompanhamentos = this.itensAcompanhamentos.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.itensAcompanhamentos = new Array<AcompanhamentosDto>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
  isTelefoneVisivel(solicitacao: SolicitacaoCompra): boolean {
    if (solicitacao.telefoneRequisitante) { return true; }
    return false;
  }

  navegarOrigemSolicitacaoCompra(idSolicitacaoCompra: number) {
    if (
      idSolicitacaoCompra &&
      [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador].includes(
        this.authService.usuario().permissaoAtual.perfil,
      )
    ) {
      this.router.navigate(['../acompanhamentos/solicitacoes-compra', idSolicitacaoCompra], {
        relativeTo: this.route,
      });
    }
  }

  navegarOrigemCotacao(idCotacao: number) {
    if (
      null != idCotacao &&
      idCotacao !== 0 &&
      [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador].includes(
        this.authService.usuario().permissaoAtual.perfil,
      )
    ) {
      this.router.navigate([`../acompanhamentos/cotacoes/${idCotacao}/mapa-comparativo-item`], {
        relativeTo: this.route,
      });
    }
  }

  navegarOrigemPedido(idPedido: number) {
    if (
      null != idPedido &&
      idPedido !== 0 &&
      [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador].includes(
        this.authService.usuario().permissaoAtual.perfil,
      )
    ) {
      this.router.navigate(['../pedidos', idPedido], {
        relativeTo: this.route,
      });
    }
  }

  situacaoCotacao(item: AcompanhamentosDto): string {
    /*if (item.situacaoCotacao == SituacaoCotacao.Agendada) {
      if (
        moment().isBetween(
          moment(item.dataInicioRodadaAtualCotacao),
          moment(item.dataEncerramentoRodadaAtualCotacao)
        )
      ) {
        return 'Em andamento';
      } else if (
        item?.dataEncerramentoRodadaAtualCotacao &&
        moment().isAfter(moment(item.dataEncerramentoRodadaAtualCotacao))
      ) {
        return 'Em análise';
      } else {
        return 'Agendada';
      }
    } else {
      return SituacaoCotacao[item.situacaoCotacao];
    }
    */

    if (item.situacaoCotacao === SituacaoCotacao.Agendada) {
      if (
        moment().isBetween(
          moment(item.dataInicioRodadaAtualCotacao),
          moment(item.dataEncerramentoRodadaAtualCotacao),
        )
      ) {
        return 'Em andamento';
      } else if (moment().isAfter(moment(item.dataEncerramentoRodadaAtualCotacao))) {
        return 'Em análise';
      } else {
        return 'Agendada';
      }
    } else {
      return SituacaoCotacao[item.situacaoCotacao];
    }

    return 'nulo';
  }
}
