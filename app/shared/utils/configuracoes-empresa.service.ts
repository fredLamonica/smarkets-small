import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfiguracaoDeModuloIntegracao } from '../models/configuracao-de-modulo-integracao';
import { ConfiguracaoDeModuloIntegracaoService } from '../providers/configuracao-de-modulo-integracao-service';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracoesEmpresaService {

  constructor(private configuracaoDeModuloIntegracaoService: ConfiguracaoDeModuloIntegracaoService) { }

  processeConfiguracoes(idsEmpresas: Array<number>, processe: (configuracoesDeModuloIntegracao: ConfiguracaoDeModuloIntegracao, idEmpresa?: number) => void): Observable<Array<void>> {
    const observablesDeConfiguracoes = new Array<Observable<void>>();

    // Desconsidera as empresas repetidas para chamar o endpoint para cada empresa uma única vez.
    const idsEmpresasUnicas = Array.from(new Set(idsEmpresas));

    for (const idEmpresa of idsEmpresasUnicas) {
      const observableDeConfiguracoes = this.configuracaoDeModuloIntegracaoService.get(idEmpresa).pipe(
        map((configuracoesDeModuloIntegracao: ConfiguracaoDeModuloIntegracao) => processe(configuracoesDeModuloIntegracao, idEmpresa)),
      );

      observablesDeConfiguracoes.push(observableDeConfiguracoes);
    }

    return forkJoin(observablesDeConfiguracoes).pipe(
      map((results) => results),
    );
  }
}
