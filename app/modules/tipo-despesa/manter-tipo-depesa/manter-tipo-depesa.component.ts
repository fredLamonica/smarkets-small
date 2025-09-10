import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TranslationLibraryService, TipoDespesaService } from '@shared/providers';
import { TipoDespesa } from '@shared/models';

@Component({
  selector: 'app-manter-tipo-depesa',
  templateUrl: './manter-tipo-depesa.component.html',
  styleUrls: ['./manter-tipo-depesa.component.scss']
})
export class ManterTipoDepesaComponent implements OnInit, OnDestroy {
  
  @BlockUI() blockUI: NgBlockUI;

  public idTipo: number;
  private paramsSub: Subscription;
  public form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tipoService: TipoDespesaService
  ) { }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(
      params => {
        this.idTipo = params["idTipo"];

        if (this.idTipo)
          this.obterTipo();
        else 
          this.blockUI.stop();
      }
    );
  }

  private obterTipo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.tipoService.obterPorId(this.idTipo).subscribe(
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
      idTipoDespesa: [0],
      codigo: [''],
      descricao: ['', Validators.required]
    });
  }

  private preencherFormulario(tipo: TipoDespesa) {
    this.form.patchValue(tipo);
  }

  public async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING)
    if (this.form.valid) {
      let tipo: TipoDespesa = this.form.value;
      if (this.idTipo)
        this.alterar(tipo);
      else
        this.inserir(tipo);
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir(tipo: TipoDespesa) {
    this.tipoService.inserir(tipo).subscribe(
      response => {
        if (response) {
          this.router.navigate(["/tipos-despesa/", response.idTipoDespesa]);
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

  private alterar(tipo: TipoDespesa) {
    this.tipoService.alterar(tipo).subscribe(
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


}
