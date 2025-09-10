import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationLibraryService, BancoService } from '@shared/providers';
import { Banco } from '@shared/models';

@Component({
  selector: 'app-manter-banco',
  templateUrl: './manter-banco.component.html',
  styleUrls: ['./manter-banco.component.scss']
})

export class ManterBancoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public idBanco: number;
  private paramsSub: Subscription;
  public form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private bancoService: BancoService,
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
        this.idBanco = +params["idBanco"];

        if (this.idBanco)
          this.obterBanco();
        else
          this.blockUI.stop();
      }
    );
  }

  private obterBanco() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.bancoService.obterPorId(this.idBanco).subscribe(
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
      idBanco: [0],
      descricao: ["", Validators.required],
      codigo: ["", Validators.required]
    });
  }

  private preencherFormulario(banco: Banco) {
    this.form.patchValue(banco);
  }

  public salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING)
    if (this.form.valid) {
      let form = this.form.value;

      let banco = new Banco(form.idBanco, form.descricao, form.codigo);

      if (this.idBanco)
        this.alterar(banco);
      else
        this.inserir(banco);
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir(banco: Banco) {
    this.bancoService.inserir(banco).subscribe(
      response => {
        if (response) {
          this.router.navigate(["/bancos/", response.idBanco]);
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

  private alterar(banco: Banco) {
    this.bancoService.alterar(banco).subscribe(
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
