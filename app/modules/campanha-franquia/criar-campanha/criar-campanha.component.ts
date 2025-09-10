import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SituacaoCampanha, StatusCampanhaFranquia } from '@shared/models';
import { FranchiseCampaignService } from '@shared/providers/franchise-campaign.service';
import { CampanhaFranquia, IFormGroupCampanhaFranquia } from '@shared/models/campanha-franquia';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TranslationLibraryService } from '@shared/providers';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'criar-campanha',
  templateUrl: './criar-campanha.component.html',
  styleUrls: ['./criar-campanha.component.scss']
})
export class CriarCampanhaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;
  minDataInicio: string;
  mindataFim: string;
  statusCampanha: any;
  enumStatusCampanha = StatusCampanhaFranquia;
  campanhaFranquia: CampanhaFranquia;
  idCampanha: number;
  teveAceite: boolean;
  

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private franchiseService: FranchiseCampaignService,
    private translationLibrary: TranslationLibraryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.minDataInicio = moment().format('YYYY-MM-DD');
    this.statusCampanha = Object.keys(this.enumStatusCampanha).filter(Number);

    this.form = this.formBuilder.group({
      idCampanhaFranquia: [null],
      titulo: [{value: null, disabled: false}, Validators.required],
      status: [this.getValueStatus()],
      ano: [{value:null, disabled: false}, Validators.required],
      semestre: [{value:null, disabled: false}, Validators.required],
      dataInicio: [{value:null, disabled: false}, Validators.required],
      dataFim: [{value:null, disabled: false}, Validators.required],
      dataLimiteAceite: [{value:null, disabled: false}, Validators.required],
      dataLimiteComprovacao: [{value:null, disabled: false}, Validators.required],
      dataLimiteAprovacao: [{value:null, disabled: false}, Validators.required],
      dataLimiteNotaDebito: [{value:null, disabled: false}, Validators.required],
      dataLimitePagamento: [{value:null, disabled: false}, Validators.required],
      termoCondicoes: [{value:null, disabled: false}, Validators.required],
      idTenant: [{value:null, disabled: false}],
      idArquivoPolitica: [{value:null, disabled: false}],
      idArquivoVerba: [{value:null, disabled: false}],
      dataExclusao: [{value:null, disabled: false}]
    }) as IFormGroupCampanhaFranquia;
  }

  async ngOnInit() {
    this.idCampanha = parseInt(this.route.parent.snapshot.params.id);
    if (this.idCampanha) {
      this.franchiseService.getAcceptanceTerm(this.idCampanha).subscribe(res => this.teveAceite = res);
      this.obterCampanha(); 
    }
  }

  private desableControls(){
    if(this.campanhaFranquia.status == 2){
      this.form.controls.titulo.disable();
      this.form.controls.ano.disable();
      this.form.controls.semestre.disable();
      this.form.controls.dataInicio.disable();
      this.form.controls.dataFim.disable();
      this.form.controls.dataLimiteAprovacao.disable();
      this.form.controls.dataLimitePagamento.disable();
    }

    if((this.campanhaFranquia.status == 3) || this.campanhaFranquia.cicloEncerrado ){
      this.form.controls.titulo.disable();
      this.form.controls.ano.disable();
      this.form.controls.semestre.disable();
      this.form.controls.dataInicio.disable();
      this.form.controls.dataFim.disable();
      this.form.controls.dataLimiteAceite.disable();
      this.form.controls.dataLimiteComprovacao.disable();
      this.form.controls.dataLimiteAprovacao.disable();
      this.form.controls.dataLimiteNotaDebito.disable();
      this.form.controls.dataLimitePagamento.disable();      
    }
  }

  atualizaFormulario() {
    this.form.patchValue(this.campanhaFranquia);
    this.desableControls(); 
  }

  obterCampanha() {
    this.franchiseService
      .getFranchiseCampaignById(this.idCampanha)
      .subscribe((res: CampanhaFranquia) => {
        this.campanhaFranquia = res;
        this.atualizaFormulario();
      });
  }

  isValid(form: FormGroup) {
    const dataInicio = moment(form.controls.dataInicio.value);
    const dataFim = moment(form.controls.dataFim.value);
    const dataLimiteAceite = moment(form.controls.dataLimiteAceite.value);

    if (dataInicio > dataFim) {
      this.toastr.warning('O encerramento do ciclo deve ser depois do início do ciclo.');
      return false;
    }
    if (dataLimiteAceite > dataFim.subtract('days', 15)) {
      this.toastr.warning(
        'O limite para aceite deve ser inferior a 15 dias para o encerramento do ciclo.'
      );
      return false;
    }

    const semestre = form.controls.semestre.value;
    const arrSemestre = [1, 2];

    if (arrSemestre.indexOf(semestre) <= -1) {
      this.toastr.warning('O semestre deve ser 1 ou 2');
      return false;
    }

    return true;
  }

  onSubmit() {
    if (this.form.valid) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      if (this.idCampanha) {
        this.updateFranchiseCampaign();
      } else {
        this.crateFranchiseCampaign();
      }
    } else {
      this.toastr.warning('Preencha todos os campos obrigatórios');
    }
  }

  crateFranchiseCampaign() {
    if (this.isValid(this.form)) {
      this.franchiseService.saveFranchiseCampain(this.form.value).subscribe(
        (res: CampanhaFranquia) => {
          this.campanhaFranquia = res;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();

          this.router.navigate([
            `campanhas-franquia/${this.campanhaFranquia.idCampanhaFranquia}/politica-campanha`
          ]);
        },
        error => {
          if (error.error) {
            error.error.forEach(e => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        }
      );
    } else {
      this.blockUI.stop();
    }
  }

  updateFranchiseCampaign() {
    if (this.areValidChanges(this.form)) {
      this.franchiseService.updateFranchiseCampain(this.form.getRawValue()).subscribe(
        (res: number) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();

          this.router.navigate([
            `campanhas-franquia/${this.campanhaFranquia.idCampanhaFranquia}/politica-campanha`
          ]);
        },
        error => {
          if (error.error) {
            error.error.forEach(e => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        }
      );
    } else {
      this.blockUI.stop();
    }
  }

  getStatus() {
    if (this.campanhaFranquia && this.campanhaFranquia.status) {
      if(this.campanhaFranquia.cicloEncerrado){
        return 'Encerrado'
      }
      return this.enumStatusCampanha[this.campanhaFranquia.status];
    }
    return this.enumStatusCampanha[1];
  }

  private getValueStatus() {
    if (this.campanhaFranquia && this.campanhaFranquia.status) {
      return this.campanhaFranquia.status;
    }
    return this.enumStatusCampanha['Em configuração'];
  }

  private areValidChanges(form: FormGroup) {
    const dataFim = moment(form.controls.dataFim.value);
    const dataLimiteAceite = moment(form.controls.dataLimiteAceite.value);

    if (dataLimiteAceite > dataFim.subtract('days', 15)) {
      this.toastr.warning(
        'O limite para aceite deve ser inferior a 15 dias para o encerramento do ciclo.'
      );
      return false;
    }

    if (this.campanhaFranquia.status == SituacaoCampanha.Ativa) {
      if (moment(this.campanhaFranquia.dataLimiteAceite) > dataLimiteAceite) {
        this.toastr.warning('Não é possível antecipar a data de limite de aceite.');
        return false;
      }
    }

    return true;
  }
}
