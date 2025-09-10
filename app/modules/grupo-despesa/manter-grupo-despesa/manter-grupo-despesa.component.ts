import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TranslationLibraryService, GrupoDespesaService } from '@shared/providers';
import { GrupoDespesa } from '@shared/models';

@Component({
  selector: 'app-manter-grupo-despesa',
  templateUrl: './manter-grupo-despesa.component.html',
  styleUrls: ['./manter-grupo-despesa.component.scss']
})
export class ManterGrupoDespesaComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  public idGrupo: number;
  private paramsSub: Subscription;
  public form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private grupoService: GrupoDespesaService
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
        this.idGrupo = params["idGrupo"];

        if (this.idGrupo)
          this.obterGrupo();
        else 
          this.blockUI.stop();
      }
    );
  }

  private obterGrupo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.grupoService.obterPorId(this.idGrupo).subscribe(
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
      idGrupoDespesa: [0],
      idTenant: [0],
      codigo: [''],
      descricao: ['', Validators.required]
    });
  }

  private preencherFormulario(grupo: GrupoDespesa) {
    this.form.patchValue(grupo);
  }

  public async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING)
    if (this.form.valid) {
      let grupo: GrupoDespesa = this.form.value;
      if (this.idGrupo)
        this.alterar(grupo);
      else
        this.inserir(grupo);
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir(grupo: GrupoDespesa) {
    this.grupoService.inserir(grupo).subscribe(
      response => {
        if (response) {
          this.router.navigate(["/grupos-despesa/", response.idGrupoDespesa]);
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

  private alterar(grupo: GrupoDespesa) {
    this.grupoService.alterar(grupo).subscribe(
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
