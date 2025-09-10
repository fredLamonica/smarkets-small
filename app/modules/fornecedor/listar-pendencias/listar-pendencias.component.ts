import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import {
  PendenciasFornecedor,
  TiposPendenciaFornecedor,
  StatusPendenciaFornecedor,
  Ordenacao
} from '@shared/models';
import { PendenciasFornecedorService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ManterPendenciasFornecedorComponent } from '../pendencia-fornecedor/manter-pendencias-fornecedor/manter-pendencias-fornecedor.component';

@Component({
  selector: 'app-listar-pendencias',
  templateUrl: './listar-pendencias.component.html',
  styleUrls: ['./listar-pendencias.component.scss']
})
export class ListarPendenciasComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public pendenciasFornecedor = new Array<PendenciasFornecedor>();
  public tiposPendenciaFornecedor = TiposPendenciaFornecedor;
  public StatusPendenciaFornecedor = StatusPendenciaFornecedor;

  public buscaAvancada: boolean = false;
  public form: FormGroup;
  public opcoesTiposPendencia: any[];
  public opcoesStatusPendencia: Array<StatusPendenciaFornecedor>;

  public termo = '';
  public registrosPorPagina: number = 16;
  public pagina: number = 1;
  public totalPaginas: number = 0;
  public ordenarPor: string = 'idPendenciaFornecedor';
  public ordenacao: Ordenacao = Ordenacao.ASC;

  constructor(
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private pendenciasFornecedorService: PendenciasFornecedorService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.construirFormularioBusca();
    this.opcoesTiposPendencia = Object.keys(this.tiposPendenciaFornecedor).filter(Number);
    this.opcoesStatusPendencia = new Array<StatusPendenciaFornecedor>();
    this.opcoesStatusPendencia.push(
      StatusPendenciaFornecedor.Pendente,
      StatusPendenciaFornecedor.Resolvido
    );
    this.obterPendenciasFornecedor();
  }

  public construirFormularioBusca() {
    this.form = this.fb.group({
      termoFornecedor: [''],
      termoTipoPendencia: [''],
      termoDescricao: [''],
      termoDataCriacao: [''],
      termoResponsavel: [''],
      termoStatus: ['']
    });
  }

  private obterPendenciasFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciasFornecedorService
      .obterFiltro(
        this.ordenarPor,
        this.ordenacao,
        this.registrosPorPagina,
        this.pagina,
        this.termo
      )
      .subscribe(
        response => {
          if (response) {
            this.pendenciasFornecedor = this.pendenciasFornecedor.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.pendenciasFornecedor = new Array<PendenciasFornecedor>();
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

  public buscarFiltroAvancado(onScroll: boolean = false) {
    var parametrosFiltroAvancado = [];
    parametrosFiltroAvancado.push(
      this.form.value.termoFornecedor ? this.form.value.termoFornecedor : ''
    );
    parametrosFiltroAvancado.push(
      this.form.value.termoTipoPendencia ? this.form.value.termoTipoPendencia : ''
    );
    parametrosFiltroAvancado.push(
      this.form.value.termoDescricao ? this.form.value.termoDescricao : ''
    );
    parametrosFiltroAvancado.push(
      this.form.value.termoDataCriacao ? this.form.value.termoDataCriacao : ''
    );
    parametrosFiltroAvancado.push(
      this.form.value.termoResponsavel ? this.form.value.termoResponsavel : ''
    );
    parametrosFiltroAvancado.push(this.form.value.termoStatus ? this.form.value.termoStatus : '');

    var parametrosFiltroAvancadoSemNull = [];
    parametrosFiltroAvancado.forEach(param => {
      if (param === 'null') parametrosFiltroAvancadoSemNull.push('');
      else parametrosFiltroAvancadoSemNull.push(param);
    });

    if (!onScroll) {
      this.resetPaginacao();
      this.obterFiltroAvancado(parametrosFiltroAvancadoSemNull);
    } else this.onScroll(true, parametrosFiltroAvancadoSemNull);
  }

  public obterFiltroAvancado(parametrosFiltroAvancado: any[]) {
    var termoFornecedor = parametrosFiltroAvancado[0];
    var termoTipoPendencia = parametrosFiltroAvancado[1];
    var termoDescricao = parametrosFiltroAvancado[2];
    var termoDataCriacao = parametrosFiltroAvancado[3];
    var termoResponsavel = parametrosFiltroAvancado[4];
    var termoStatus = parametrosFiltroAvancado[5];
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciasFornecedorService
      .obterFiltroAvancado(
        this.ordenarPor,
        this.ordenacao,
        this.registrosPorPagina,
        this.pagina,
        termoFornecedor,
        termoTipoPendencia,
        termoDescricao,
        termoDataCriacao,
        termoResponsavel,
        termoStatus
      )
      .subscribe(
        response => {
          if (response) {
            this.pendenciasFornecedor = this.pendenciasFornecedor.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.pendenciasFornecedor = new Array<PendenciasFornecedor>();
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

  public buscar(termo: string) {
    this.termo = termo;
    this.resetPaginacao();
    this.obterPendenciasFornecedor();
  }

  public onScroll(buscaAvancada: boolean = false, parametrosFiltroAvancado: any[] = null) {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      if (buscaAvancada) this.obterFiltroAvancado(parametrosFiltroAvancado);
      else this.obterPendenciasFornecedor();
    }
  }

  public resetPaginacao() {
    this.pendenciasFornecedor = new Array<PendenciasFornecedor>();
    this.pagina = 1;
  }

  public exibirBuscaAvancada(event: boolean) {
    this.buscaAvancada = event;
  }

  public editarPendenciaFornecedor(pendenciaFornecedor: PendenciasFornecedor) {
    const modalRef = this.modalService.open(ManterPendenciasFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.pendenciaForm.patchValue(pendenciaFornecedor);
    modalRef.componentInstance.estaEditandoPendencia = true;
    modalRef.result.then(result => {
      if (result) {
        let index = this.pendenciasFornecedor.findIndex(
          p => p.idPendenciaFornecedor == pendenciaFornecedor.idPendenciaFornecedor
        );
        this.pendenciasFornecedor.splice(index, 1, result);
      }
    });
  }

  public vizualizarPendenciaFornecedor(pendenciaFornecedor: PendenciasFornecedor) {
    const modalRef = this.modalService.open(ManterPendenciasFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.pendenciaForm.patchValue(pendenciaFornecedor);
    modalRef.componentInstance.vizualizar = true;
  }

  public solicitarExclusaoPendenciaFornecedor(pendenciaFornecedor: PendenciasFornecedor) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.deletarPendenciaFornecedor(pendenciaFornecedor.idPendenciaFornecedor),
        reason => {}
      );
  }

  private deletarPendenciaFornecedor(idPendenciaFornecedor: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciasFornecedorService.deletar(idPendenciaFornecedor).subscribe(
      response => {
        this.tratarDelecaoPendenciaFornecedor(idPendenciaFornecedor);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private tratarDelecaoPendenciaFornecedor(id: number) {
    this.pendenciasFornecedor = this.pendenciasFornecedor.filter(
      pf => pf.idPendenciaFornecedor != id
    );
  }
}
