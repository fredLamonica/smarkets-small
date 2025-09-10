import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { PessoaJuridica } from '../../../../shared/models/pessoa-juridica';
import { AutenticacaoService, PessoaJuridicaService } from '../../../../shared/providers';
import { FiltroSuperiorMarketplace } from '../../models/filtro-superior-marketplace';
import { TipoBusca } from '../../models/tipo-busca.enum';

@Component({
  selector: 'smk-filtro-superior',
  templateUrl: './filtro-superior.component.html',
  styleUrls: ['./filtro-superior.component.scss'],
})
export class FiltroSuperiorComponent extends Unsubscriber implements OnInit, AfterViewInit {

  @ViewChild('empresaCompradora') empresaCompradora: NgSelectComponent;

  @Input() triggerFocusEmpresaCompradora: Observable<void>;
  @Output() busca: EventEmitter<FiltroSuperiorMarketplace> = new EventEmitter<FiltroSuperiorMarketplace>();
  @Output() empresaChange: EventEmitter<number> = new EventEmitter<number>();

  form: FormGroup;
  empresas: PessoaJuridica[];
  empresasLoading: Boolean;
  integracaoErpHabilitada: boolean;

  tiposBusca = [
    { label: 'Produto', value: TipoBusca.Produto },
    { label: 'Serviço', value: TipoBusca.Servico },
    { label: 'Fornecedor', value: TipoBusca.Fornecedor },
    { label: 'Contrato', value: TipoBusca.Contrato },
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
    if (this.triggerFocusEmpresaCompradora) {
      this.triggerFocusEmpresaCompradora.pipe(
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
  }

  subEmpresa() {
    this.form.get('empresaCompradora').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
      (idPessoaJuridica) => {
        this.empresaChange.emit(idPessoaJuridica);

        if (this.integracaoErpHabilitada) {
          if (idPessoaJuridica) {
            if (this.tiposBusca.every((x) => x.value !== TipoBusca.CodigoERP)) {
              this.tiposBusca = [...this.tiposBusca, { label: 'Código ERP', value: TipoBusca.CodigoERP }];
            }
          }
        }
      },
    );
  }

  buscar() {
    const form = this.form.getRawValue();
    this.busca.emit(new FiltroSuperiorMarketplace({ termo: form.termo, tipoBusca: form.tipoBusca, buscaDetalhada: form.buscaDetalhada }));
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
        },
      );
  }
}
