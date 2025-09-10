import { Component, Input, OnInit } from '@angular/core';
import { DomicilioBancario } from '@shared/models';
import {
  AutenticacaoService,
  TranslationLibraryService,
  DomicilioBancarioService,
  PessoaJuridicaService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ManterDomicilioBancarioComponent } from 'src/app/modules/pessoa-juridica/domicilio-bancario/manter-domicilio-bancario/manter-domicilio-bancario.component';
import { ActivatedRoute } from '@angular/router';
import { ModalConfirmacaoExclusao } from '..';

@Component({
  selector: 'sdk-domicilio-bancario',
  templateUrl: './sdk-domicilio-bancario.component.html',
  styleUrls: ['./sdk-domicilio-bancario.component.scss']
})
export class SdkDomicilioBancarioComponent implements OnInit {
  public domicilios: Array<DomicilioBancario>;
  @Input() showFornecedor: boolean = true;
  public mouseOverIcon: boolean;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private domicilioService: DomicilioBancarioService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private pessoaJuridicaService: PessoaJuridicaService
  ) {}

  idPessoa: number = 0;
  idPessoaJuridica: number = 0;

  public disabled: boolean = false;

  public form: FormGroup;
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit() {
    this.idPessoaJuridica = this.route.parent.snapshot.params.id;
    this.obterDomicilios();
    this.getPessoaId();
  }

  public obterDomicilios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.domicilioService.listar(this.idPessoaJuridica).subscribe(
      response => {
        if (response) {
          this.domicilios = response;
        } else {
          this.domicilios = new Array<DomicilioBancario>();
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private getPessoaId() {
    this.pessoaJuridicaService.obterPessoaId(this.idPessoaJuridica).subscribe(
      response => {
        if (response) {
          this.idPessoa = response;
        }
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }

  public manterDomicilio(domicilio: DomicilioBancario = null) {
    const modalRef = this.modalService.open(ManterDomicilioBancarioComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });

    if (domicilio) modalRef.componentInstance.idDomicilio = domicilio.idDomicilioBancario;

    modalRef.componentInstance.idPessoa = this.idPessoa;
    modalRef.result.then(
      result => {
        if (result) {
          this.obterDomicilios();
        }
      },
      reason => {}
    );
  }

  public itemClicked(domicilio) {
    if (!this.disabled) {
      this.manterDomicilio(domicilio);
    }
  }

  public solicitarExclusao(domicilio) {
    this.disabled = true;
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => {
        this.excluir(domicilio);
        this.disabled = false;
      },
      reason => {
        this.disabled = false;
      }
    );
  }

  private excluir(domicilio) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.domicilioService.deletar(domicilio.idDomicilioBancario).subscribe(
      resultado => {
        this.obterDomicilios();
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
