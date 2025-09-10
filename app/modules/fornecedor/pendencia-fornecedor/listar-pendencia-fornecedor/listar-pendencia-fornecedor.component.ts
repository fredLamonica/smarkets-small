import { Component, OnInit, Input } from '@angular/core';
import {
  TiposPendenciaFornecedor,
  StatusPendenciaFornecedor,
  PendenciasFornecedor,
  PerfilUsuario
} from '@shared/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManterPendenciasFornecedorComponent } from '../manter-pendencias-fornecedor/manter-pendencias-fornecedor.component';
import { ModalConfirmacaoExclusao } from '@shared/components';
import {
  TranslationLibraryService,
  PendenciasFornecedorService,
  AutenticacaoService
} from '@shared/providers';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'listar-pendencia-fornecedor',
  templateUrl: './listar-pendencia-fornecedor.component.html',
  styleUrls: ['./listar-pendencia-fornecedor.component.scss']
})
export class ListarPendenciaFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() public habilitarPendenciaFornecedor: boolean;
  @Input() public idFornecedor: number;
  @Input() public idPessoaJuridica: number;
  @Input() public pendenciasFornecedor: Array<PendenciasFornecedor>;
  @Input() public habilitarResponderPendencia: Boolean = false;

  public tiposPendenciaFornecedor = TiposPendenciaFornecedor;
  public perfilUsuario: PerfilUsuario;
  public statusPendenciaFornecedor = StatusPendenciaFornecedor;
  public StatusPendencia = StatusPendenciaFornecedor;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private pendenciasFornecedorService: PendenciasFornecedorService,
    private autenticacaoService: AutenticacaoService
  ) {}

  ngOnInit() {
    
    this.perfilUsuario = this.autenticacaoService.perfil();

    if (this.perfilUsuario === PerfilUsuario.Fornecedor) this.obterPendenciasFornecedor();
  }

  public podeAlterarExcluir(pendenciaFornecedor: PendenciasFornecedor): boolean {
    return (
      this.habilitarPendenciaFornecedor &&
      pendenciaFornecedor.status != StatusPendenciaFornecedor.Resolvido
    );
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
      this.obterPendenciasFornecedor();
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
    if (this.habilitarResponderPendencia) {
      modalRef.componentInstance.podeResolverPendencia = true;
    }

    modalRef.result.then(result => {
      this.obterPendenciasFornecedor();
    });
  }

  public solicitarExclusaoPendenciaFornecedor(pendenciaFornecedor: PendenciasFornecedor) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.deletarPendenciaFornecedor(pendenciaFornecedor.idPendenciaFornecedor),
        reason => {}
      );
  }

  public deletarPendenciaFornecedor(idPendenciaFornecedor: number) {
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

  private obterPendenciasFornecedor() {
    if (this.perfilUsuario == PerfilUsuario.Fornecedor) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.pendenciasFornecedorService.obterPorIdPessoaJuridica(this.idPessoaJuridica).subscribe(
        response => {
          if (response) {
            this.pendenciasFornecedor = response.filter(
              r => r.status != StatusPendenciaFornecedor.Excluído
            );
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
    if (
      this.perfilUsuario == PerfilUsuario.GestorDeFornecedores ||
      this.perfilUsuario == PerfilUsuario.Administrador
    ) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.pendenciasFornecedorService.ObterPorIdFornecedor(this.idFornecedor).subscribe(
        response => {
          if (response) {
            this.pendenciasFornecedor = response.filter(
              r => r.status != StatusPendenciaFornecedor.Excluído
            );
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }
}
