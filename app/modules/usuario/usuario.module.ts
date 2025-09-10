import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { ManterUsuarioComponent } from './manter-usuario/manter-usuario.component';
import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListarPermissoesComponent } from './permissoes/listar-permissoes/listar-permissoes.component';
import { ManterPermissaoComponent } from './permissoes/manter-permissao/manter-permissao.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ModalExportarPermissaoComponent } from './permissoes/modal-exportar-permissao/modal-exportar-permissao.component';

@NgModule({
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    SharedModule,
    NgbModalModule,
    NgbTabsetModule,
    NgSelectModule,
    TextMaskModule
  ],
  entryComponents: [ManterPermissaoComponent, ModalExportarPermissaoComponent],
  declarations: [ListaUsuariosComponent, ManterUsuarioComponent, ListarPermissoesComponent, ManterPermissaoComponent, ModalExportarPermissaoComponent]
})
export class UsuarioModule { }
