import { Component, OnInit, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslationLibraryService, DepartamentoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Nivel } from '@shared/models';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-manter-nivel',
  templateUrl: './manter-nivel.component.html',
  styleUrls: ['./manter-nivel.component.scss']
})
export class ManterNivelComponent implements OnInit {

  @Input("id-departamento") idDepartamento: number;
  @Input("id-nivel") idNivel: number;

  @BlockUI() blockUI: NgBlockUI;
  
  public maskValor = createNumberMask({
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ",",
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 12
  });

  public form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private departamentoService: DepartamentoService,
    private currencyPipe: CurrencyPipe
  ) { }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    if (this.idNivel)
      this.obterNivel();
    else
      this.blockUI.stop();
  }

  private obterNivel() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.departamentoService.obterNivelPorId(this.idNivel).subscribe(
      response => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
        this.permitirExibirNiveisParticipantes();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idDepartamento: [this.idDepartamento],
      descricao: ['', Validators.required],
      valor: [null, Validators.required]
    });
  }

  private preencherFormulario(nivel: Nivel) {
    this.form.patchValue(this.adicionarMascaras(nivel));
  }

  public async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING)
    if (this.formularioValido()) {
      let nivel: Nivel = this.removerMascaras(this.form.value);
      if (this.idNivel)
        this.alterar(nivel);
      else
        this.inserir(nivel);
    } else {
      this.blockUI.stop();
    }
  }

  private removerMascaras(nivel: any): Nivel {
    //Utiliza expressão regular para remover todos os pontos da string
    nivel.valor = +(nivel.valor.replace(/\./g,'').replace(',', '.'));
    return nivel;
  }

  private adicionarMascaras(nivel: any) {
    nivel.valor = this.currencyPipe.transform(nivel.valor, undefined, '', '1.2-4', 'pt-BR').trim();
    return nivel;
  }

  private formularioValido(): boolean {
    //required
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    return true;
  }

  private inserir(nivel: Nivel) {
    nivel.idDepartamento = this.idDepartamento;
    this.departamentoService.inserirNivel(nivel).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.preencherFormulario(response);
        this.idNivel = response.idNivel;
        this.permitirExibirNiveisParticipantes();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop()
      }
    );
  }

  private alterar(nivel: Nivel) {
    nivel.idNivel = this.idNivel;
    nivel.idDepartamento = this.idDepartamento;
    this.departamentoService.alterarNivel(nivel).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(nivel);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop()
      }
    );
  }

  public cancelar() {
    this.activeModal.close();
  }

   // #region Participantes
   public exibirNiveisParticipantes: boolean;
  
   public permitirExibirNiveisParticipantes() {
     if(!this.exibirNiveisParticipantes)
       this.exibirNiveisParticipantes = true;
   }
   
   // #endregion

}
