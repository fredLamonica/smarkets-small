import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CategoriaFornecimento,
  FornecedorInteressado,
  PendenciasFornecedor,
  StatusPendenciaFornecedor,
  TipoDocumentoFornecedor
} from '@shared/models';
import {
  AutenticacaoService,
  FornecedorService,
  PendenciasFornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ManterPendenciasFornecedorComponent } from '../pendencia-fornecedor/manter-pendencias-fornecedor/manter-pendencias-fornecedor.component';

@Component({
  selector: 'pendencias-admin',
  templateUrl: './pendencias-admin.component.html',
  styleUrls: ['./pendencias-admin.component.scss']
})
export class PendenciasAdminComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  pendenciasFornecedor: Array<PendenciasFornecedor>;
  habilitarPendenciaFornecedor: boolean = false;
  idPessoaJuridicaFornecedor: number;
  fornecedor: FornecedorInteressado;
  tipoDocumentoSelecionado: TipoDocumentoFornecedor;

  constructor(
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private pendenciasFornecedorService: PendenciasFornecedorService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private fornecedorService: FornecedorService,
    private authService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.idPessoaJuridicaFornecedor = this.route.parent.snapshot.params.id;
    this.obterPessoaJuridicaFornecedor();
  }
  private obterPessoaJuridicaFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .ObterFornecedorRedeLocalPorIdPessoaJuridica(this.idPessoaJuridicaFornecedor)
      .subscribe(
        response => {
          if (response) {
            this.fornecedor = response;
            this.obterPendenciasFornecedor();
            if (this.fornecedor.possuiCategoriaFornecimentoInteresse)
              this.fornecedor.categoriasFornecimento.push(
                Object.assign(
                  {},
                  new CategoriaFornecimento(
                    0,
                    'Outras',
                    'Outras',
                    this.authService.usuario().permissaoAtual.idTenant
                  )
                )
              );
            if (response.cnpj.length > 14)
              this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cnpj;
            else {
              this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cpf;
            }
          }
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public ativaGerarPendencia() {
    const modalRef = this.modalService.open(ManterPendenciasFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.pendenciaForm.controls.idFornecedor.setValue(
      this.fornecedor.idFornecedor
    );
    modalRef.componentInstance.estaInserindoPendencia = true;

    modalRef.result.then(result => {
      this.obterPendenciasFornecedor();
    });
  }
  private obterPendenciasFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciasFornecedorService.ObterPorIdFornecedor(this.fornecedor.idFornecedor).subscribe(
      response => {
        if (response) {
          this.pendenciasFornecedor = response.filter(
            r => r.status != StatusPendenciaFornecedor.Excluído
          );
        }
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
}
