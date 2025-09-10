import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../../shared/services/mock/mock-data.service';

@Component({
  selector: 'app-listar-contratos',
  template: `
    <div class="container-fluid">
      <div class="header">
        <div class="header-search row">
          <div class="col-12 align-self-center">
            <h3 class="mb-0 text-uppercase text-primary font-weight-bold">Contratos de Catálogo</h3>
          </div>
        </div>
      </div>
      
      <div class="card mt-4">
        <div class="card-body">
          <div class="mb-3">
            <button class="btn btn-primary" (click)="novoContrato()">
              <i class="fas fa-plus"></i> Novo Contrato
            </button>
          </div>
          
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Fornecedor</th>
                  <th>Data Início</th>
                  <th>Data Fim</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let contrato of contratos">
                  <td>{{ contrato.idContratoCatalogo }}</td>
                  <td>{{ contrato.codigo }}</td>
                  <td>{{ contrato.titulo }}</td>
                  <td>{{ contrato.fornecedor?.razaoSocial }}</td>
                  <td>{{ contrato.dataInicio | date:'dd/MM/yyyy' }}</td>
                  <td>{{ contrato.dataFim | date:'dd/MM/yyyy' }}</td>
                  <td>{{ getSituacaoLabel(contrato.situacao) }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary" (click)="visualizar(contrato)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary ml-1" (click)="editar(contrato)">
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./listar-contratos.component.scss']
})
export class ListarContratosComponent implements OnInit {
  contratos: any[] = [];
  loading = false;

  situacoes = {
    1: 'Em Configuração',
    2: 'Ativo',
    3: 'Inativo',
    4: 'Pendente de Aprovação'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadContratos();
  }

  private loadContratos() {
    this.loading = true;
    this.mockDataService.getContratos().subscribe(
      response => {
        this.contratos = response.itens;
        this.loading = false;
      }
    );
  }

  getSituacaoLabel(situacao: number): string {
    return this.situacoes[situacao] || 'Desconhecida';
  }

  novoContrato() {
    alert('Redirecionando para criação de novo contrato (simulado)');
  }

  visualizar(contrato: any) {
    alert(`Visualizando contrato ${contrato.codigo} - ${contrato.titulo}`);
  }

  editar(contrato: any) {
    alert(`Editando contrato ${contrato.codigo} - ${contrato.titulo}`);
  }
}