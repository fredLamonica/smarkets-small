import { Component, OnInit, Input } from '@angular/core';
import { PendenciasFornecedorComentario } from '@shared/models/pendencia-fornecedor-comentario';
import { PendenciasFornecedorComentarioService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'listar-pendencia-comentario',
  templateUrl: './listar-pendencia-comentario.component.html',
  styleUrls: ['./listar-pendencia-comentario.component.scss']
})
export class ListarPendenciaComentarioComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  @Input() public idPendenciaFornecedor: number;
  public pendenciaFornecedorComentarios: Array<PendenciasFornecedorComentario>;
  
  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private pendenciaFornecedorComentarioService: PendenciasFornecedorComentarioService,
  ) { }

  ngOnInit() {
    this.obterPendenciaFornecedorComentarios();
  }

  private obterPendenciaFornecedorComentarios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciaFornecedorComentarioService.obter(this.idPendenciaFornecedor).subscribe(
      response => {
        if (response) {
          this.pendenciaFornecedorComentarios = response;
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );    
  }
}
