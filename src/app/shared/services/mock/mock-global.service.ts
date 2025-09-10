import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockGlobalService {

  // Simular qualquer chamada de API não mapeada
  mockApiCall(endpoint: string, method: string = 'GET', data?: any): Observable<any> {
    console.log(`Mock API Call: ${method} ${endpoint}`, data);

    // Resposta padrão baseada no endpoint
    let mockResponse: any = { success: true };

    if (endpoint.includes('listar') || endpoint.includes('buscar')) {
      mockResponse = {
        itens: [],
        totalPaginas: 1,
        paginaAtual: 1,
        totalItens: 0
      };
    } else if (endpoint.includes('salvar') || endpoint.includes('criar')) {
      mockResponse = {
        success: true,
        id: Math.floor(Math.random() * 10000) + 1,
        message: 'Operação realizada com sucesso'
      };
    } else if (endpoint.includes('excluir') || endpoint.includes('deletar')) {
      mockResponse = {
        success: true,
        message: 'Item excluído com sucesso'
      };
    }

    return of(mockResponse).pipe(delay(Math.random() * 1000 + 500));
  }

  // Gerar dados mock genéricos
  generateMockList(itemName: string, count: number = 10): any[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      nome: `${itemName} ${i + 1}`,
      descricao: `Descrição do ${itemName} ${i + 1}`,
      dataCriacao: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      situacao: Math.floor(Math.random() * 3) + 1,
      ativo: Math.random() > 0.3
    }));
  }

  // Simular upload de arquivo
  uploadFile(file: File): Observable<any> {
    return of({
      success: true,
      url: `https://mock-storage.com/files/${file.name}`,
      nome: file.name,
      tamanho: file.size
    }).pipe(delay(2000));
  }

  // Simular download de arquivo
  downloadFile(url: string, filename: string): void {
    // Criar um blob mock e fazer download
    const content = 'Conteúdo do arquivo mock';
    const blob = new Blob([content], { type: 'text/plain' });
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.click();
    
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Simular validações
  validarCNPJ(cnpj: string): boolean {
    return cnpj && cnpj.length >= 14;
  }

  validarCPF(cpf: string): boolean {
    return cpf && cpf.length >= 11;
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}