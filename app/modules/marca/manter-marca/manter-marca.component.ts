import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { TranslationLibraryService, MarcaService } from '@shared/providers';
import { Marca } from '@shared/models';

@Component({
  selector: 'app-manter-marca',
  templateUrl: './manter-marca.component.html',
  styleUrls: ['./manter-marca.component.scss']
})
export class ManterMarcaComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  public idMarca: number;
  private paramsSub: Subscription;
  public form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private marcaService: MarcaService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.contruirFormulario();
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(
      params => {
        this.idMarca = +params["idMarca"];

        if (this.idMarca)
          this.obterMarca();
        else
          this.blockUI.stop();
      }
    );
  }

  private obterMarca() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.marcaService.obterPorId(this.idMarca).subscribe(
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
      idMarca: [0],
      idTenant: [0],
      codigo: [''],
      nome: [null, Validators.required]
    });
  }

  private preencherFormulario(marca: Marca) {
    this.form.patchValue(marca);
  }

  public salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING)
    if (this.form.valid) {
      let form = this.form.value;

      let marca = new Marca(form.idMarca, form.idTenant, form.codigo, form.nome);

      if (this.idMarca)
        this.alterar(marca);
      else
        this.inserir(marca);
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir(marca: Marca) {
    this.marcaService.inserir(marca).subscribe(
      response => {
        if (response) {
          this.router.navigate(["/marcas/", response.idMarca]);
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

  private alterar(marca: Marca) {
    this.marcaService.alterar(marca).subscribe(
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

