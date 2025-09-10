import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PessoaJuridica } from '@shared/models';
import {
  ArquivoService,
  AutenticacaoService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { RelatoriosService } from '@shared/providers/relatorios.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-relatorio-acessaram-plataforma',
  templateUrl: './relatorio-acessaram-plataforma.component.html',
  styleUrls: []
})
export class RelatorioAcessaramPlataformaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public formFiltro: FormGroup;
  public clientes: Array<PessoaJuridica>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private pessoaJuridicaService: PessoaJuridicaService,
    public authService: AutenticacaoService,
    private relatorioService: RelatoriosService,
    private arquivoService: ArquivoService
  ) { }

  ngOnInit() {
    this.construirFormularioFiltro();
    this.obterClientes();
  }

  private construirFormularioFiltro() {
    this.formFiltro = this.fb.group({
      dataInicio: [moment().startOf('month').format('YYYY-MM-DD')],
      dataFim: [moment().format('YYYY-MM-DD'), Validators.required],
      cliente: this.fb.control(undefined)
    });
  }

  public downloadRelatorio() {
    this.blockUI.start();

    if (this.formFiltro.controls.dataFim.invalid) {
      this.toastr.warning(
        "O Período Final não pode ser vazio."
      );
      this.blockUI.stop();
    } else {
      let form = this.formFiltro.value;
      let idTenant = (form.cliente == undefined || form.cliente == null) ? this.authService.usuario().permissaoAtual.idTenant : form.cliente.idTenant;
      this.relatorioService
        .ObterRelatorioAcessaramPlataforma(form.dataInicio, form.dataFim, idTenant)
        .subscribe(
          response => {
            if (response.size > 0) {
              this.arquivoService.createDownloadElement(
                response,
                `Relatório de Acesso de Usuários de Fornecedores de ${form.dataInicio} até ${form.dataFim}.xlsx`
              );
              this.blockUI.stop();
            } else {
              this.toastr.warning('Nenhum registro encontrado.');
              this.blockUI.stop();
            }
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    }
  }

  public obterClientes() {
    this.pessoaJuridicaService
      .ObterCompradores()
      .subscribe(response => {
        if (response) {
          this.clientes = response;
        }
      });
  }
}
