import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TranslationLibraryService, ContaContabilService } from '@shared/providers';
import { ContaContabil } from '@shared/models';

@Component({
  selector: 'app-manter-conta-contabil',
  templateUrl: './manter-conta-contabil.component.html',
  styleUrls: ['./manter-conta-contabil.component.scss']
})
export class ManterContaContabilComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  public idConta: number;
  private paramsSub: Subscription;
  public form: FormGroup;

  public contasContabeis: Array<ContaContabil>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private contaService: ContaContabilService
  ) { }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    try {
      this.contasContabeis = await this.obterContasContabeis();      
      this.obterParametros();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(
      params => {
        this.idConta = params["idConta"];

        if (this.idConta)
          this.obterConta();
        else 
          this.blockUI.stop();
      }
    );
  }

  private obterConta() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contaService.obterPorId(this.idConta).subscribe(
      response => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idContaContabil: [0],
      idTenant: [0],
      idContaContabilPai: [null],
      codigo: [''],
      descricao: ['', Validators.required]
    });
  }

  private preencherFormulario(conta: ContaContabil) {
    this.form.patchValue(conta);
  }

  public salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING)
    if (this.formularioValido()) {
      let conta: ContaContabil = this.form.value;
      if (this.idConta)
        this.alterar(conta);
      else
        this.inserir(conta);
    }
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
      return false;
    }
    if(this.idConta && this.idConta == this.form.value.idContaContabilPai) {
      this.toastr.warning("Você selecionou uma conta contábil pai inválida, por favor selecione outra!");
      this.blockUI.stop();
      return false;
    }
    return true;
  }

  private inserir(conta: ContaContabil) {
    this.contaService.inserir(conta).subscribe(
      response => {
        if (response) {
          this.router.navigate(["/contas-contabeis/", response.idContaContabil]);
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop()
      }
    );
  }

  private alterar(conta: ContaContabil) {
    this.contaService.alterar(conta).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop()
      }
    );
  }

  public cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  private async obterContasContabeis(): Promise<Array<ContaContabil>>{
    return this.contaService.listar().toPromise();
  }

  public naoExistemContasDisponiveis(event) {
    this.toastr.warning(this.translationLibrary.translations.ALERTS.NO_ITEMS_AVAILABLE);
  }


}
