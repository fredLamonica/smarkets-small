import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { PessoaJuridica } from '../../../../shared/models';
import { AutenticacaoService, PessoaJuridicaService } from '../../../../shared/providers';
import { TipoBuscaContrato } from '../../models/TipoBuscaContrato';
import { FiltroSuperiorContrato } from '../../models/filtro-superior-contrato';

@Component({
  selector: 'smk-filtro-superior-contrato-fornecedor',
  templateUrl: './filtro-superior-contrato-fornecedor.component.html',
  styleUrls: ['./filtro-superior-contrato-fornecedor.component.scss']
})
export class FiltroSuperiorContratoFornecedorComponent extends Unsubscriber implements OnInit {

  @ViewChild('empresaCompradora') empresaCompradora: NgSelectComponent;

  @Input() triggerFocusEmpresaFornecedora: Observable<void>;
  @Output() busca: EventEmitter<FiltroSuperiorContrato> = new EventEmitter<FiltroSuperiorContrato>();
  @Output() empresaChange: EventEmitter<number> = new EventEmitter<number>();

  form: FormGroup;
  empresas: PessoaJuridica[];
  fornecedor: PessoaJuridica;
  empresasLoading: Boolean;
  integracaoErpHabilitada: boolean;
  valorPreSelecionado: number;

  tiposBusca = [
    { label: 'Produto', value: TipoBuscaContrato.Produto },
    { label: 'Serviço', value: TipoBuscaContrato.Servico },
    { label: 'Contrato', value: TipoBuscaContrato.Contrato },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private pessoaJuridicaService: PessoaJuridicaService,
    private autenticacaoService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormulario();
    this.obterEmpresas();
    this.subEmpresa();
    this.integracaoErpHabilitada = this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica.habilitarIntegracaoERP;
  }

  ngAfterViewInit() {
    if (this.triggerFocusEmpresaFornecedora) {
      this.triggerFocusEmpresaFornecedora.pipe(
        takeUntil(this.unsubscribe))
        .subscribe(() => {
          setTimeout(() => {
            this.empresaCompradora.handleArrowClick();
          }, 500);
        });
    }
  }

  construirFormulario() {
    this.form = this.formBuilder.group({
      empresaCompradora: [null, Validators.required],
      tipoBusca: [],
      termo: [''],
      buscaDetalhada: [],
    });

    this.form.controls.empresaCompradora.disable();
  }

  subEmpresa() {
    this.form.get('empresaCompradora').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
      (idPessoaJuridica) => {
        this.empresaChange.emit(idPessoaJuridica);
      },
    );
  }

  buscar() {
    const form = this.form.getRawValue();
    this.busca.emit(new FiltroSuperiorContrato({ termo: form.termo, tipoBuscaContrato: form.tipoBusca, buscaDetalhada: form.buscaDetalhada }));
  }

  empresaSearchFn(term: string, item: PessoaJuridica) {
    term = term.toLowerCase();
    return item.razaoSocial.toLowerCase().indexOf(term) > -1 ||
      item.nomeFantasia.toLowerCase().indexOf(term) > -1 ||
      item.cnpj.toLowerCase().indexOf(term) > -1;
  }

  private obterEmpresas() {
    this.pessoaJuridicaService.ObterFiliais()
      .pipe(takeUntil(this.unsubscribe), finalize(() => this.empresasLoading = false))
      .subscribe(
        (response) => {
          this.empresas = response;
          this.valorPreSelecionado = response[0].idPessoaJuridica;
        },
      );
  }

}
