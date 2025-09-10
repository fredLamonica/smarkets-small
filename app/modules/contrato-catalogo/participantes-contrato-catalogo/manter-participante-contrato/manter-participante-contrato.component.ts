import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContratoCatalogoParticipante, CustomTableColumn, CustomTableColumnType, CustomTableSettings, PessoaJuridica, SituacaoContratoCatalogoItem } from '@shared/models';
import { PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';

@Component({
  selector: 'app-manter-participante-contrato',
  templateUrl: './manter-participante-contrato.component.html',
  styleUrls: ['./manter-participante-contrato.component.scss'],
})
export class ManterParticipanteContratoComponent implements OnInit {

  @Input('id-contrato') idContrato: number;
  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  settings: CustomTableSettings;
  fornecedores: Array<PessoaJuridica>;

  selecionados: Array<PessoaJuridica>;
  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;

  constructor(
    private pessoaJuridicaService: PessoaJuridicaService,
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public constratoCatalogoService: ContratoCatalogoService,
  ) { }

  ngOnInit() {
    this.construirForm();
    this.construirTabela();
    this.filtrarCompradores();
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.filtrarCompradores(null);
  }

  selecao(fornecedores: Array<PessoaJuridica>) {
    this.selecionados = fornecedores;
  }

  buscar() {
    this.pagina = 1;
    this.filtrarCompradores();
  }

  limpar() {
    this.form.patchValue({
      razaoSocial: '',
      cnpj: ''
    });
  }

  confirmar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const participantes = this.selecionados.map((pj) => new ContratoCatalogoParticipante(0, this.idContrato, 0, pj.idPessoaJuridica, SituacaoContratoCatalogoItem.Ativo));
    this.constratoCatalogoService.inserirParticipanteContratoBatch(this.idContrato, participantes).subscribe(
      (response) => {
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        if (response) {
          this.activeModal.close(participantes);
        }
      }, (error) => {
        if (error && error.status == 400) {
          switch (error.error) {
            case 'Registro duplicado':
              this.toastr.error(this.translationLibrary.translations.ALERTS.INVALID_AGGREMENT_PARTICIPANT_ALREADY_EXIST);
              break;
            default:
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              break;
          }
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      },
    );
  }

  cancelar() {
    this.activeModal.close();
  }

  private construirForm() {
    this.form = this.formBuilder.group({
      razaoSocial: [''],
      cnpj: [''],
    });
  }

  private construirTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Empresa', 'razaoSocial', CustomTableColumnType.text),
        new CustomTableColumn('CNPJ', 'cnpj', CustomTableColumnType.text),
      ], 'check'
    );
  }

  private filtrarCompradores(content?) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const filtro = this.form.value;

    this.pessoaJuridicaService.filtrarCompradores(this.registrosPorPagina, this.pagina, filtro.razaoSocial, filtro.cnpj).subscribe(
      (response) => {
        if (response) {
          this.fornecedores = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.fornecedores = new Array<PessoaJuridica>();
          this.totalPaginas = 1;
        }

        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );

  }
}
