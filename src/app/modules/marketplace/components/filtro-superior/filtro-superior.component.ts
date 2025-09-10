import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MockDataService } from '../../../../shared/services/mock/mock-data.service';

@Component({
  selector: 'smk-filtro-superior',
  templateUrl: './filtro-superior.component.html',
  styleUrls: ['./filtro-superior.component.scss']
})
export class FiltroSuperiorComponent implements OnInit {
  @Input() triggerFocusEmpresaCompradora: Observable<any>;
  @Output() busca = new EventEmitter();
  @Output() empresaChange = new EventEmitter();

  form: FormGroup;
  empresas: any[] = [];
  empresasLoading = false;
  tiposBusca = [
    { label: 'Produto', value: 'produto' },
    { label: 'Categoria', value: 'categoria' },
    { label: 'Fornecedor', value: 'fornecedor' },
    { label: 'Código', value: 'codigo' }
  ];

  constructor(
    private fb: FormBuilder,
    private mockDataService: MockDataService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadEmpresas();
    this.setupTriggers();
  }

  private initializeForm() {
    this.form = this.fb.group({
      empresaCompradora: [1, Validators.required], // Empresa padrão
      tipoBusca: ['produto'],
      termo: [''],
      buscaDetalhada: [false]
    });

    // Emitir empresa padrão
    this.empresaChange.emit(1);
  }

  private loadEmpresas() {
    this.empresasLoading = true;
    this.mockDataService.getConfiguracoes().subscribe(
      config => {
        this.empresas = config.empresas;
        this.empresasLoading = false;
      }
    );
  }

  private setupTriggers() {
    if (this.triggerFocusEmpresaCompradora) {
      this.triggerFocusEmpresaCompradora.subscribe(() => {
        // Focar no campo empresa (simulado)
      });
    }

    this.form.get('empresaCompradora').valueChanges.subscribe(value => {
      this.empresaChange.emit(value);
    });
  }

  buscar() {
    const filtros = this.form.value;
    this.busca.emit(filtros);
  }

  empresaSearchFn(term: string, item: any): boolean {
    return item.razaoSocial.toLowerCase().includes(term.toLowerCase()) ||
           item.cnpj.includes(term) ||
           (item.nomeFantasia && item.nomeFantasia.toLowerCase().includes(term.toLowerCase()));
  }
}