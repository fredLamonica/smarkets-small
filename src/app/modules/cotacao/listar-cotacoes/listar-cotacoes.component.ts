import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../../shared/services/mock/mock-data.service';

@Component({
  selector: 'app-listar-cotacoes',
  template: `
    <div class="container-fluid">
      <div class="header">
        <div class="header-search row">
          <div class="col-12 align-self-center">
            <h3 class="mb-0 text-uppercase text-primary font-weight-bold">Cotações</h3>
          </div>
        </div>
      </div>
      
      <div class="card mt-4">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Data Início</th>
                  <th>Data Fim</th>
                  <th>Situação</th>
                  <th>Responsável</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cotacao of cotacoes">
                  <td>{{ cotacao.idCotacao }}</td>
                  <td>{{ cotacao.descricao }}</td>
                  <td>{{ cotacao.dataInicio | date:'dd/MM/yyyy' }}</td>
                  <td>{{ cotacao.dataFim | date:'dd/MM/yyyy' }}</td>
                  <td>{{ getSituacaoLabel(cotacao.situacao) }}</td>
                  <td>{{ cotacao.usuarioResponsavel?.pessoaFisica?.nome }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary" (click)="visualizar(cotacao)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary ml-1" (click)="editar(cotacao)">
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
  styleUrls: ['./listar-cotacoes.component.scss']
})
export class ListarCotacoesComponent implements OnInit {
  cotacoes: any[] = [];
  loading = false;

  situacoes = {
    1: 'Em Configuração',
    2: 'Agendada',
    3: 'Em Andamento',
    4: 'Em Análise',
    5: 'Encerrada'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadCotacoes();
  }

  private loadCotacoes() {
    this.loading = true;
    this.mockDataService.getCotacoes().subscribe(
      response => {
        this.cotacoes = response.itens;
        this.loading = false;
      }
    );
  }

  getSituacaoLabel(situacao: number): string {
    return this.situacoes[situacao] || 'Desconhecida';
  }

  visualizar(cotacao: any) {
    alert(`Visualizando cotação ${cotacao.idCotacao} - ${cotacao.descricao}`);
  }

  editar(cotacao: any) {
    alert(`Editando cotação ${cotacao.idCotacao} - ${cotacao.descricao}`);
  }
}