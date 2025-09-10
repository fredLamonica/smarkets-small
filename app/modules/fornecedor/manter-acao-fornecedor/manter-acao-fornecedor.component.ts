import { PlanoAcaoFornecedorService } from '@shared/providers/plano-acao-fornecedor.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslationLibraryService, AutenticacaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { AcaoFornecedor, Usuario } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manter-acao-fornecedor',
  templateUrl: './manter-acao-fornecedor.component.html',
  styleUrls: ['./manter-acao-fornecedor.component.scss']
})
export class ManterAcaoFornecedorComponent implements OnInit {
  public form: FormGroup;
  public usuarioLogado: Usuario;

  @BlockUI() blockUI: NgBlockUI;
  @Input() acao: AcaoFornecedor;
  @Input() idPlanoAcaoFornecedor: number;
  @Input() titulo: string;
  @Input() classFormEmail: string;
  @Input() classFormData: string;

  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private planoAcaoFornecedorService: PlanoAcaoFornecedorService,
    private datePipe: DatePipe,
    private autenticacaoService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.usuarioLogado = this.autenticacaoService.usuario();
    this.construirFormulario();
    this.preencherFormulario();
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      descricao: ['', Validators.required],
      emailDoResponsavel: ['', Validators.email],
      prazoDaAcao: [null, Validators.required],
      observacoes: ['']
    });

    if (this.titulo === 'Inserir Observação') {
      this.form.controls.descricao.setValidators(null);
      this.form.controls.prazoDaAcao.setValidators(null);
    }
  }

  private preencherFormulario() {
    if (this.acao != undefined) {
      this.form.patchValue(this.acao);

      this.form.controls.prazoDaAcao.setValue(
        this.datePipe.transform(this.acao.prazo, 'yyyy-MM-dd')
      );
      this.form.controls.emailDoResponsavel.setValue(this.acao.emailDoResponsavel);
    }
  }

  public fechar() {
    this.activeModal.close(null);
  }

  public salvar() {
    if (this.form.valid) {
      this.blockUI.start();
      this.preencherAcao();
      if (this.acao.idAcaoFornecedor == undefined) {
        this.inserir();
      } else {
        this.alterar();
      }
    } else {
      this.blockUI.stop();
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private inserir() {
    this.planoAcaoFornecedorService.inserirAcao(this.acao).subscribe(
      response => {
        this.acao = response;
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(this.acao);
      },
      error => {
        switch (error.error) {
          case 'A data da ação não pode ser maior que a data do Plano de Ação.':
            this.acao = undefined;
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          case 'O prazo não pode ser inferior a data atual.':
            this.acao = undefined;
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          case 'O Plano de Ação fornecedor para essa Ação Fornecedor não existe.':
            this.acao = undefined;
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          case 'Preencha um Prazo.':
            this.acao = undefined;
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          case 'Preencha a Descrição.':
            this.acao = undefined;
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          default:
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
            break;
        }
      }
    );
  }

  private preencherAcao() {
    if (this.acao == undefined) {
      this.acao = new AcaoFornecedor(
        this.form.controls.descricao.value,
        this.idPlanoAcaoFornecedor,
        this.form.controls.prazoDaAcao.value,
        this.form.controls.emailDoResponsavel.value
      );
    } else {
      this.acao.descricao = this.form.controls.descricao.value;
      this.acao.emailDoResponsavel = this.form.controls.emailDoResponsavel.value;
      this.acao.prazo = this.form.controls.prazoDaAcao.value;
      this.acao.idPlanoAcaoFornecedor = this.idPlanoAcaoFornecedor;
      // this.acao.observacoes = this.form.controls.observacoes.value;
    }
  }

  private alterar() {
    this.planoAcaoFornecedorService.alterarAcao(this.acao).subscribe(
      response => {
        this.acao = response;
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(this.acao);
      },
      error => {
        switch (error.error) {
          case 'A data da ação não pode ser maior que a data do Plano de Ação.':
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          case 'O prazo não pode ser inferior a data atual.':
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          case 'O Plano de Ação fornecedor para essa Ação Fornecedor não existe.':
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          case 'Preencha um Prazo.':
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          case 'Preencha a Descrição.':
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          default:
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
            break;
        }
      }
    );
  }
}
