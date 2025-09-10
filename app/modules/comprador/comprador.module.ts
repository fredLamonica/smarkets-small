import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompradorRoutingModule } from './comprador-routing.module';
import { ManterCompradorComponent } from './manter-comprador/manter-comprador.component';
import { SharedModule } from '@shared/shared.module';
import { PessoaJuridicaModule } from '../pessoa-juridica/pessoa-juridica.module';
import { DadosGeraisCompradorComponent } from './dados-gerais-comprador/dados-gerais-comprador.component';
import { UsuariosCompradorComponent } from './usuarios-comprador/usuarios-comprador.component';
import { EnderecoCompradorComponent } from './endereco-comprador/endereco-comprador.component';
import { ManterEnderecoModalComponent } from './../../shared/components/modals/manter-endereco-modal/manter-endereco-modal.component';
import { InformacoesBancariasCompradorComponent } from './informacoes-bancarias-comprador/informacoes-bancarias-comprador.component';
import { CnaesCompradorComponent } from './cnaes-comprador/cnaes-comprador.component';

@NgModule({
  imports: [CommonModule, CompradorRoutingModule, SharedModule, PessoaJuridicaModule],
  entryComponents: [ManterEnderecoModalComponent],
  declarations: [
    DadosGeraisCompradorComponent,
    EnderecoCompradorComponent,
    ManterCompradorComponent,
    UsuariosCompradorComponent,
    InformacoesBancariasCompradorComponent,
    CnaesCompradorComponent
  ],
  exports: []
})
export class CompradorModule {}
