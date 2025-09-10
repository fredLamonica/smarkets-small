import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracaoAvaliacaoFornecedor } from '@shared/models/configuracao-avaliacao-fornecedor';
import { ConfiguracaoAvaliacaoFornecedorService } from '@shared/providers/configuracao-avaliacao-fornecedor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manter-configuracao-avaliacao-fornecedor',
  templateUrl: './manter-configuracao-avaliacao-fornecedor.component.html',
  styleUrls: ['./manter-configuracao-avaliacao-fornecedor.component.scss']
})
export class ManterConfiguracaoAvaliacaoFornecedorComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  public form: FormGroup;

  constructor(
    private configuracaoAvaliacaoFornecedorService: ConfiguracaoAvaliacaoFornecedorService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.construirFormulario();
    this.obterConfiguracao();
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idConfiguracaoAvaliacaoFornecedor: [0],
      idTenant: [0],
      pesoMuitoBaixo: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])],
      pesoBaixo: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])],
      pesoMedio: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])],
      pesoAlto: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])],
      pesoMuitoAlto: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])],
      notaNaoSeAplica: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])],
      notaQualificado: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])],
      notaRequerMelhorias: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])],
      notaNaoQualificado: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])],
      classificacaoQualificadoInicio: [null, Validators.compose([Validators.required, this.menorQue("classificacaoRequerMelhoriasFim"), this.maiorQue("classificacaoRequerMelhoriasFim")])],
      classificacaoQualificadoFim: [null, Validators.compose([Validators.required, this.diferenteDe(9), this.segundoValorMenor('classificacaoQualificadoInicio')])],
      classificacaoRequerMelhoriasInicio: [null, Validators.compose([Validators.required, this.menorQue("classificacaoNaoQualificadoFim"), this.maiorQue("classificacaoNaoQualificadoFim")])],
      classificacaoRequerMelhoriasFim: [null, Validators.compose([Validators.required, this.segundoValorMenor('classificacaoRequerMelhoriasInicio')])],
      classificacaoNaoQualificadoInicio: [null, Validators.compose([Validators.required, this.diferenteDe(0)])],
      classificacaoNaoQualificadoFim: [null, Validators.compose([Validators.required, this.segundoValorMenor("classificacaoNaoQualificadoInicio")])],
    })
  }

  private obterConfiguracao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoAvaliacaoFornecedorService.obter().subscribe(
      response => {
        if (response)
          this.preencherFormulario(response);
          this.blockUI.stop();
        },
      responseError => {
        this.blockUI.stop();
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }

  private preencherFormulario(configuracao: ConfiguracaoAvaliacaoFornecedor) {
    this.form.patchValue(configuracao);
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      if (
        //#region required
        this.form.controls.pesoMuitoBaixo.hasError('required') ||
        this.form.controls.pesoBaixo.hasError('required') ||
        this.form.controls.pesoMedio.hasError('required') ||
        this.form.controls.pesoAlto.hasError('required') ||
        this.form.controls.pesoMuitoAlto.hasError('required') ||
        this.form.controls.notaNaoSeAplica.hasError('required') ||
        this.form.controls.notaQualificado.hasError('required') ||
        this.form.controls.notaRequerMelhorias.hasError('required') ||
        this.form.controls.notaNaoQualificado.hasError('required') ||
        this.form.controls.classificacaoQualificadoInicio.hasError('required') ||
        this.form.controls.classificacaoQualificadoFim.hasError('required') ||
        this.form.controls.classificacaoRequerMelhoriasInicio.hasError('required') ||
        this.form.controls.classificacaoRequerMelhoriasFim.hasError('required') ||
        this.form.controls.classificacaoNaoQualificadoInicio.hasError('required') ||
        this.form.controls.classificacaoNaoQualificadoFim.hasError('required')
        //#endregion
      ) {
        this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      } else {
        if(
          //#region rangeInvalido
          this.form.controls.classificacaoRequerMelhoriasInicio.hasError('maiorQue') ||
          this.form.controls.classificacaoQualificadoInicio.hasError('maiorQue') ||
          this.form.controls.classificacaoRequerMelhoriasInicio.hasError('menorQue') ||
          this.form.controls.classificacaoQualificadoInicio.hasError('menorQue') ||
          this.form.controls.classificacaoNaoQualificadoInicio.hasError('diferenteDe') ||
          this.form.controls.classificacaoQualificadoFim.hasError('diferenteDe') ||
          this.form.controls.classificacaoNaoQualificadoFim.hasError('segundoValorMenor') ||
          this.form.controls.classificacaoRequerMelhoriasFim.hasError('segundoValorMenor') ||
          this.form.controls.classificacaoQualificadoFim.hasError('segundoValorMenor')
          //#endregion
        ) {
        this.toastr.warning("Por favor forneça intervalos válidos para os campos de classificação");
        }
        else {
          this.toastr.warning("Válidos somente valores de 0 a 9");
        }  
      }
      return false;
    }
    else {
      return true;
    }
  }

  public cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  public salvar() {
    if (this.formularioValido()) {
      let configuracao: ConfiguracaoAvaliacaoFornecedor = this.form.value
      if (configuracao.idConfiguracaoAvaliacaoFornecedor)
        this.alterar(configuracao);
      else
        this.inserir(configuracao);
    }
  }

  private inserir(configuracao: ConfiguracaoAvaliacaoFornecedor) {
    this.blockUI.start();
    this.configuracaoAvaliacaoFornecedorService.inserir(configuracao).subscribe(
      response => {
        if (response) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error("Falha ao inserir nova configuração. Por favor, tente novamente.");
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        if (error.status == 400) {
          this.toastr.warning(error.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }

  private alterar(configuracao: ConfiguracaoAvaliacaoFornecedor) {
    this.blockUI.start();
    this.configuracaoAvaliacaoFornecedorService.alterar(configuracao).subscribe(
        response => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error("Falha ao inserir nova configuração. Por favor, tente novamente.");
          }
          this.blockUI.stop();
        },
        error => {
          this.blockUI.stop();
          if (error.status == 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        }
      )
  }

  public diferenteDe(valor: number) {
    const validator = (formControl: FormControl) => {
      if (valor == null) {
        throw new Error("É necessário informar um valor");
      }
    
      if(!formControl.root || !(<FormGroup>formControl.root).controls){
        return null;
      }

      if(formControl.value != valor){
        return {diferenteDe: true};
      }

      return null;
    };
    return validator;
  }

  public maiorQue(otherfield: string){
    const validator = (formControl: FormControl) => {
      if (otherfield == null) {
        throw new Error("É necessário informar um campo");
      }
    
      if(!formControl.root || !(<FormGroup>formControl.root).controls){
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherfield);

      if(!field){
        throw new Error("É necessário informar um campo");
      }

      if(formControl.value > field.value && field.dirty){
        return {maiorQue: true};
      }

      return null;
    };
    return validator;
  }

  public menorQue(otherfield: string){
    const validator = (formControl: FormControl) => {
      if (otherfield == null) {
        throw new Error("É necessário informar um campo");
      }
    
      if(!formControl.root || !(<FormGroup>formControl.root).controls){
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherfield);

      if(!field){
        throw new Error("É necessário informar um campo");
      }

      if(formControl.value < field.value && field.dirty){
        return {menorQue: true};
      }

      return null;
    };
    return validator;
  }

  public segundoValorMenor(otherfield: string){
    const validator = (formControl: FormControl) => {
      if (otherfield == null) {
        throw new Error("É necessário informar um campo");
      }
    
      if(!formControl.root || !(<FormGroup>formControl.root).controls){
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherfield);

      if(!field){
        throw new Error("É necessário informar um campo");
      }

      if(formControl.value <= field.value && field.dirty){
        return {segundoValorMenor: true};
      }

      return null;
    };
    return validator;
  }

  public reValidar(controlName: string){
    if(this.form.get(controlName).dirty && this.form.get(controlName).value != 0){
      this.form.get(controlName).setValue(this.form.get(controlName).value);
    }
  }

}
