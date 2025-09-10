import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfiguracaoFiltroUsuarioDto } from '../../../models/configuracao-filtro-usuario-dto';
import { SmkComponent } from '../base/smk-component';

@Component({
  selector: 'smk-filtro-funcionalidade',
  templateUrl: './smk-filtro-funcionalidade.component.html',
  styleUrls: ['./smk-filtro-funcionalidade.component.scss'],
})
export class SmkFiltroFuncionalidadeComponent extends SmkComponent implements OnInit {

  @Input() configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  @Input() filtroInformado: boolean;

  @Output() readonly filtrosChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly filtrosClear: EventEmitter<void> = new EventEmitter<void>();

  filtroExpandido: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  troqueVisualizacaoFiltro(): void {
    this.filtroExpandido = !this.filtroExpandido;
  }

  dispareLimpeFiltro(): void {
    this.filtroInformado = false;
    this.filtrosClear.emit();
  }

  dispareFiltre(): void {
    this.filtroExpandido = false;
    this.filtrosChange.emit();
  }

}
