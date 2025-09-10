import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DadosFornecedorModule } from './../fornecedor/dados-fornecedor/dados-fornecedor.module';
import { ListarDocumentosFornecedorComponent } from './../fornecedor/dados-fornecedor/documentos-fornecedor/listar-documentos-fornecedor/listar-documentos-fornecedor.component';
import { FornecedorModule } from './../fornecedor/fornecedor.module';
import { ListarEnderecosComponent } from './endereco/listar-enderecos/listar-enderecos.component';
import { ManterEnderecoComponent } from './endereco/manter-endereco/manter-endereco.component';
import { ListarFaturamentoMinimoFreteComponent } from './faturamento-minimo-frete/listar-faturamentos-minimo-frete/listar-faturamento-minimo-frete.component';
import { ManterFaturamentoMinimoFreteComponent } from './faturamento-minimo-frete/manter-faturamento-minimo-frete/manter-faturamento-minimo-frete.component';
import { ItemPessoaJuridicaComponent } from './item-pessoa-juridica/item-pessoa-juridica.component';
import { ListarEmpresaUsuarioComponent } from './listar-empresa-usuario/listar-empresa-usuario.component';
import { ListarPessoaJuridicaEscolhaComponent } from './listar-pessoa-juridica-escolha/listar-pessoa-juridica-escolha.component';
import { ListarPessoaJuridicaSmarketsComponent } from './listar-pessoa-juridica-smarkets/listar-pessoa-juridica-smarkets.component';
import { ListarPessoaJuridicaComponent } from './listar-pessoa-juridica/listar-pessoa-juridica.component';
import { ManterPessoaJuridicaCadastroComponent } from './manter-pessoa-juridica-cadastro/manter-pessoa-juridica-cadastro.component';
import { ManterPessoaJuridicaComponent } from './manter-pessoa-juridica/manter-pessoa-juridica.component';
import { ManterPlanoAcaoComponent } from './manter-plano-acao/manter-plano-acao.component';
import { MaterEmpresaUsuarioComponent } from './mater-empresa-usuario/mater-empresa-usuario.component';
import { UsuarioModule } from '../usuario/usuario.module';
import { PessoaJuridicaRoutingModule } from './pessoa-juridica-routing.module';
import { SdkManterLogoComponent } from '@shared/components/sdk-manter-logo/sdk-manter-logo.component';

@NgModule({
  imports: [
    CommonModule,
    NgbTabsetModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
    PessoaJuridicaRoutingModule,
    TextMaskModule,
    FornecedorModule,
    DadosFornecedorModule,
    InfiniteScrollModule,
    UsuarioModule
  ],
  entryComponents: [
    ManterEnderecoComponent,
    ManterFaturamentoMinimoFreteComponent,
    ListarDocumentosFornecedorComponent,
    MaterEmpresaUsuarioComponent,
    SdkManterLogoComponent
  ],
  declarations: [
    ListarPessoaJuridicaSmarketsComponent,
    ManterPessoaJuridicaComponent,
    ManterPessoaJuridicaCadastroComponent,
    ListarEnderecosComponent,
    ManterEnderecoComponent,
    ListarFaturamentoMinimoFreteComponent,
    ManterFaturamentoMinimoFreteComponent,
    ListarDocumentosFornecedorComponent,
    ManterPlanoAcaoComponent,
    ListarEmpresaUsuarioComponent,
    MaterEmpresaUsuarioComponent,
    ListarPessoaJuridicaEscolhaComponent,
    ListarPessoaJuridicaComponent,
    ItemPessoaJuridicaComponent
  ],
  exports: [ListarEnderecosComponent, ManterEnderecoComponent, ListarPessoaJuridicaComponent]
})
export class PessoaJuridicaModule {}
