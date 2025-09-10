import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturezaJuridica } from '@shared/models';
import { NaturezaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';

@Component({
  selector: 'app-manter-naturezas-juridicas',
  templateUrl: './manter-natureza-juridica.component.html',
  styleUrls: ['./manter-natureza-juridica.component.scss'],
})

export class ManterNaturezaJuridicaComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  idNaturezaJuridica: number;
  form: FormGroup;
  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    // tslint:disable-next-line: no-shadowed-variable
    private NaturezaJuridicaService: NaturezaJuridicaService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    this.contruirFormulario();
    this.obterParametros();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    if (this.paramsSub) { this.paramsSub.unsubscribe(); }
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      const form = this.form.value;

      const naturezaJuridica = new NaturezaJuridica(
        form.idNaturezaJuridica
        , form.descricao
        , form.codigo
        , form.categoria,
      );

      if (this.idNaturezaJuridica) {
        this.alterar(naturezaJuridica);
      } else {
        this.inserir(naturezaJuridica);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (params) => {
          this.idNaturezaJuridica = +params['idNaturezaJuridica'];

          if (this.idNaturezaJuridica) {
            this.obterNaturezaJuridica();
          } else {
            this.blockUI.stop();
          }
        },
      );
  }

  private obterNaturezaJuridica() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.NaturezaJuridicaService.obterPorId(this.idNaturezaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.preencherFormulario(response);
          }
          this.blockUI.stop();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idNaturezaJuridica: [0]
      , descricao: ['', Validators.required]
      , codigo: ['', Validators.required]
      , categoria: ['', Validators.required],
    });
  }

  private preencherFormulario(naturezaJuridica: NaturezaJuridica) {
    this.form.patchValue(naturezaJuridica);
  }

  private inserir(naturezaJuridica: NaturezaJuridica) {
    this.NaturezaJuridicaService.inserir(naturezaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/naturezasjuridicas/', response.idNaturezaJuridica]);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private alterar(naturezaJuridica: NaturezaJuridica) {
    this.NaturezaJuridicaService.alterar(naturezaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

}
