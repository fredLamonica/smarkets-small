import { Component, OnInit } from '@angular/core';
import { AutenticacaoService, TranslationLibraryService, SlaService } from '@shared/providers';
import { PessoaJuridica, SlaItem, TipoSla, UnidadeMedidaTempo, Ordenacao } from '@shared/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManterSlaComponent } from '../manter-sla/manter-sla.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';

@Component({
  selector: 'listar-sla',
  templateUrl: './listar-sla.component.html',
  styleUrls: ['./listar-sla.component.scss']
})
export class ListarSlaComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;

  public TipoSla = TipoSla;
  public UnidadeMedidaTempo = UnidadeMedidaTempo;

  public empresa: PessoaJuridica;
  public slaItens: Array<SlaItem>;
  public pagina = 1;
  public totalPaginas: number;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private slaService: SlaService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.empresa = this.authService.usuario().permissaoAtual.pessoaJuridica;
    this.ResetPagination();
    this.Hydrate();
  }

  public ResetPagination() {
    this.slaItens = new Array<SlaItem>();
    this.pagina = 1;
  }

  public onScroll(termo: string = '') {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.Hydrate(termo);
    }
  }

  public Hydrate(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaService
      .filtrarSlaItem(16, this.pagina, 'slai.IdSlaItem', Ordenacao.DESC, termo)
      .subscribe(
        response => {
          if (response) {
            this.slaItens = this.slaItens.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.slaItens = new Array<SlaItem>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterSlaComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.result.then(result => {
      if (result) {
        this.slaItens.unshift(result);
      }
    });
  }

  public editar(index: number) {
    const modalRef = this.modalService.open(ManterSlaComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.slaItem = this.slaItens[index];
    modalRef.result.then(result => {
      if (result) {
        this.slaItens[index] = result;
      }
    });
  }

  public auditar(index: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'SlaItem';
    modalRef.componentInstance.idEntidade = this.slaItens[index].idSlaItem;
  }

  public solicitarDelecao(index: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.deletar(index),
        reason => {}
      );
  }

  public deletar(index: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaService.excluirSlaItem(this.slaItens[index].idSlaItem).subscribe(
      response => {
        this.ResetPagination();
        this.Hydrate();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
}
