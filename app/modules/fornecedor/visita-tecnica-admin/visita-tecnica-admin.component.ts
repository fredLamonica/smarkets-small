import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import {
  CategoriaFornecimento,
  FornecedorInteressado,
  SituacaoVisitaTecnica,
  TipoDocumentoFornecedor
} from '@shared/models';
import { PerfilUsuario } from '@shared/models/enums/perfil-usuario';
import { VisitaTecnica } from '@shared/models/visita-tecnica';
import { FornecedorService } from '@shared/providers';
import { AutenticacaoService } from '@shared/providers/autenticacao.service';
import { TranslationLibraryService } from '@shared/providers/translation-library.service';
import { VisitaTecnicaService } from '@shared/providers/visita-tecnica.service';
import { BlockUI } from 'ng-block-ui/lib/decorators/block-ui.decorator';
import { NgBlockUI } from 'ng-block-ui/lib/models/block-ui.model';
import { ToastrService } from 'ngx-toastr';
import { ManterVisitaTecnicaComponent } from '../visita-tecnica/manter-visita-tecnica/manter-visita-tecnica.component';

@Component({
  selector: 'visita-tecnica-fornecedor',
  templateUrl: './visita-tecnica-admin.component.html',
  styleUrls: ['./visita-tecnica-admin.component.scss']
})
export class VisitaTecnicaAdminComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  idPessoaJuridicaFornecedor: number;
  visitasTecnicas: Array<VisitaTecnica>;
  SituacaoVisitaTecnica = SituacaoVisitaTecnica;
  fornecedor: FornecedorInteressado;
  tipoDocumentoSelecionado: TipoDocumentoFornecedor;

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
    private translationLibrary: TranslationLibraryService,
    private visitaTecnicaService: VisitaTecnicaService,
    private router: Router,
    private fornecedorService: FornecedorService
  ) {}

  ngOnInit() {
    // Captura o Id do fornecedor passado na rota Parent.
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
            this.obterVisitasTecnicas();
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

  public realizarAgendamento() {
    const modalRef = this.modalService.open(ManterVisitaTecnicaComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.form.controls.idFornecedorVisitaTecnica.setValue(
      this.fornecedor.idFornecedor
    );

    modalRef.result.then(result => {
      if (result) {
        this.visitasTecnicas.push(result);
      }
    });
  }

  private obterVisitasTecnicas() {
    if (
      this.authService.perfil() == PerfilUsuario.Administrador ||
      this.authService.perfil() == PerfilUsuario.GestorDeFornecedores ||
      this.authService.perfil() == PerfilUsuario.Gestor
    ) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.visitaTecnicaService.obter(this.fornecedor.idFornecedor).subscribe(
        response => {
          if (response) {
            this.visitasTecnicas = response;
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
  public realizarVisitaTecnica(idVisitaTecnica) {
    this.router.navigate(['/fornecedores/local/visitatecnica/', idVisitaTecnica], {
      relativeTo: this.route
    });
  }

  public editarVisitaTecnica(visitaTecnica: VisitaTecnica) {
    const modalRef = this.modalService.open(ManterVisitaTecnicaComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.form.patchValue(visitaTecnica);

    modalRef.result.then(result => {
      if (result) {
        const index = this.visitasTecnicas.findIndex(
          obj => obj.idVisitaTecnica == result.idVisitaTecnica
        );
        this.visitasTecnicas.splice(index, 1, result);
      }
    });
  }

  public solicitarExclusaoVisitaTecnica(visitaTecnica: VisitaTecnica) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        () => this.deletarVisitaTecnica(visitaTecnica.idVisitaTecnica),
        () => {}
      );
  }
  public deletarVisitaTecnica(idVisitaTecnica: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.visitaTecnicaService.deletar(idVisitaTecnica).subscribe(
      () => {
        this.tratarDelecaoVisitaTecnica(idVisitaTecnica);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  private tratarDelecaoVisitaTecnica(id: number) {
    this.visitasTecnicas = this.visitasTecnicas.filter(c => c.idVisitaTecnica != id);
  }
}
