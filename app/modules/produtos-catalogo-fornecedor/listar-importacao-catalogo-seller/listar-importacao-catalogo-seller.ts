import { Component, Injector, OnInit } from '@angular/core';
import { ImportType } from '@shared/models/enums/ImportType.enum';
import { ListarCargaPorTipoComponent } from '../../importacao/base/listar-carga-por-tipo.component';

@Component({
  selector: 'app-listar-importacao-catalogo-seller',
  templateUrl: './listar-importacao-catalogo-seller.html',
  styleUrls: ['./listar-importacao-catalogo-seller.scss'],
})
export class ListarImportacaoContratoSellerComponent extends ListarCargaPorTipoComponent implements OnInit {

  protected importType = ImportType['Contratos do Fornecedor'];

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
