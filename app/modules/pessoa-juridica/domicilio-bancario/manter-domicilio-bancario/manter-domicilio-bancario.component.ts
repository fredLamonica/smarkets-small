import { Component, OnInit, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Banco, DomicilioBancario } from '@shared/models';
import {
  TranslationLibraryService,
  BancoService,
  DomicilioBancarioService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manter-domicilio-bancario',
  templateUrl: './manter-domicilio-bancario.component.html',
  styleUrls: ['./manter-domicilio-bancario.component.scss']
})
export class ManterDomicilioBancarioComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input('id-pessoa') idPessoa: number;
  @Input('id-domicilio') idDomicilio: number;

  public form: FormGroup;
  public bancos: Array<Banco>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private bancoService: BancoService,
    private domicilioService: DomicilioBancarioService,
    public activeModal: NgbActiveModal
  ) {}

  async ngOnInit() {
    this.contruirFormulario();

    await this.obterBancos();

    if (this.idDomicilio) this.obterDomicilio();
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idDomicilioBancario: [0],
      idPessoa: [0],
      idBanco: [null, Validators.required],
      agencia: ['', Validators.required],
      contaCorrente: ['', Validators.required],
      principal: [false]
    });
  }

  private preencherFormulario(domicilio: DomicilioBancario) {
    this.form.patchValue(domicilio);
  }

  private async obterBancos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      this.bancos = await this.bancoService.listar().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  private obterDomicilio() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.domicilioService.obterPorId(this.idDomicilio).subscribe(
      response => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      let domicilio: DomicilioBancario = this.form.value;
      if (this.idDomicilio) this.alterar(domicilio);
      else this.inserir(domicilio);
    } else {
      this.blockUI.stop();
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private inserir(domicilio: DomicilioBancario) {
    domicilio.idPessoa = this.idPessoa;
    this.domicilioService.inserir(this.idPessoa, domicilio).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(response);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private alterar(domicilio: DomicilioBancario) {
    this.domicilioService.alterar(this.idPessoa, domicilio).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(domicilio);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public cancelar() {
    this.activeModal.close();
  }
}
