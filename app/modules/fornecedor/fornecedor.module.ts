import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AuditoriaComponent,
  ManterEnderecoComponent,
  ModalTimelineDocumentoComponent
} from '@shared/components';
import { ItemDomicilioBancarioComponent } from '@shared/components/sdk-domicilio-bancario/item-domicilio-bancario/item-domicilio-bancario.component';
import { SdkDomicilioBancarioComponent } from '@shared/components/sdk-domicilio-bancario/sdk-domicilio-bancario.component';
import { SharedModule } from '@shared/shared.module';
import { TreeModule } from 'angular-tree-component';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ManterEnderecoModalComponent } from '../../shared/components/modals/manter-endereco-modal/manter-endereco-modal.component';
import { ModalUsuarioComponent } from '../usuario/manter-usuario-fornecedor/modal-usuario/modal-usuario.component';
import { SdkIncluirDocumentoModalComponent } from './../../shared/components/sdk-incluir-documento-modal/sdk-incluir-documento-modal.component';
import { SdkUsuarioPrincipalModalComponent } from './../../shared/components/sdk-usuario-principal-modal/sdk-usuario-principal-modal.component';
import { ListarAvaliacaoFornecedorComponent } from './avaliacao-fornecedor/listar-avaliacao-fornecedor/listar-avaliacao-fornecedor.component';
import { ManterAvaliacaoFornecedorComponent } from './avaliacao-fornecedor/manter-avaliacao-fornecedor/manter-avaliacao-fornecedor.component';
import { ManterQuestaoAvaliacaoFornecedorComponent } from './avaliacao-fornecedor/manter-questao-avaliacao-fornecedor/manter-questao-avaliacao-fornecedor.component';
import { DadosGeraisComponent } from './dados-gerais/dados-gerais.component';
import { ListarDisparoAvaliacaoFornecedorComponent } from './disparo-avaliacao-fornecedor/listar-disparo-avaliacao-fornecedor/listar-disparo-avaliacao-fornecedor.component';
import { ListarResultadoAvaliacaoFornecedorComponent } from './disparo-avaliacao-fornecedor/listar-resultado-avaliacao-fornecedor/listar-resultado-avaliacao-fornecedor.component';
import { ManterDisparoAvaliacaoFornecedorComponent } from './disparo-avaliacao-fornecedor/manter-disparo-avaliacao-fornecedor/manter-disparo-avaliacao-fornecedor.component';
import { DocumentosFornecedorComponent } from './documentos-fornecedor/documentos-fornecedor.component';
import { ItemDocumentoEnviarComponent } from './documentos-fornecedor/item-documento/item-documento.component';
import { ModalEnviarDocumentoComponent } from './documentos-fornecedor/item-documento/modal-enviar-documento/modal-enviar-documento.component';
import { EnviarCartaResponsabilidadeFornecedorComponent } from './enviar-carta-responsabilidade-fornecedor/enviar-carta-responsabilidade-fornecedor.component';
import { FornecedorRoutingModule } from './fornecedor-routing.module';
import { ListarConfiguracaoVisitaTecnicaComponent } from './gestao-fornecedor/configuracoes-fornecedor/configuracao-visita-tecnica/listar-configuracao-visita-tecnica/listar-configuracao-visita-tecnica.component';
import { ManterConfiguracaoVisitaTecnicaComponent } from './gestao-fornecedor/configuracoes-fornecedor/configuracao-visita-tecnica/manter-configuracao-visita-tecnica/manter-configuracao-visita-tecnica.component';
import { ConfiguracoesFornecedorComponent } from './gestao-fornecedor/configuracoes-fornecedor/configuracoes-fornecedor.component';
import { ControleAcoesPorStatusComponent } from './gestao-fornecedor/configuracoes-fornecedor/controle-acoes-por-status/controle-acoes-por-status.component';
import { ManterConfiguracaoAvaliacaoFornecedorComponent } from './gestao-fornecedor/configuracoes-fornecedor/manter-configuracao-avaliacao-fornecedor/manter-configuracao-avaliacao-fornecedor.component';
import { ManterConfiguracaoTermosBoasPraticasComponent } from './gestao-fornecedor/configuracoes-fornecedor/manter-configuracao-termos-boas-praticas/manter-configuracao-termos-boas-praticas.component';
import { ManterConfiguracaoVencimentoComponent } from './gestao-fornecedor/configuracoes-fornecedor/manter-configuracao-vencimento/manter-configuracao-vencimento.component';
import { ManterConfiguracoesFornecedorInteressadoComponent } from './gestao-fornecedor/configuracoes-fornecedor/manter-configuracoes-fornecedor-interessado/manter-configuracoes-fornecedor-interessado.component';
import { ManterSolicitacaoDocumentosFornecedorComponent } from './gestao-fornecedor/document-request/keep-document-request/keep-document-request.component';
import { ListDocumentRequestComponent } from './gestao-fornecedor/document-request/list-document-request/list-document-request.component';
import { ListarDocumentoFornecedorComponent } from './gestao-fornecedor/documento-fornecedor/listar-documento-fornecedor/listar-documento-fornecedor.component';
import { ManterDocumentoFornecedorComponent } from './gestao-fornecedor/documento-fornecedor/manter-documento-fornecedor/manter-documento-fornecedor.component';
import { VincularDocumentoFornecedorComponent } from './gestao-fornecedor/documento-fornecedor/vincular-documento-fornecedor/vincular-documento-fornecedor.component';
import { GestaoFornecedorComponent } from './gestao-fornecedor/gestao-fornecedor/gestao-fornecedor.component';
import { CategoriasQuestoesGestaoFornecedorComponent } from './gestao-fornecedor/questionarios-fornecedor/categorias-questoes-gestao-fornecedor/categorias-questoes-gestao-fornecedor.component';
import {
  ListarQuestionarioFornecedorCriterioAvaliacaoComponent
} from './gestao-fornecedor/questionarios-fornecedor/listar-questionario-fornecedor-criterio-avaliacao/listar-questionario-fornecedor-criterio-avaliacao.component';
import { ListarQuestionariosFornecedorComponent } from './gestao-fornecedor/questionarios-fornecedor/listar-questionarios-fornecedor/listar-questionarios-fornecedor.component';
import { ManterCategoriasQuestoesGestaoFornecedorComponent } from './gestao-fornecedor/questionarios-fornecedor/manter-categorias-questoes-gestao-fornecedor/manter-categorias-questoes-gestao-fornecedor.component';
import { ManterQuestionariosGestaoFornecedorComponent } from './gestao-fornecedor/questionarios-fornecedor/manter-questionario-gestao-fornecedor/manter-questionarios-gestao-fornecedor.component';
import { QuestaoGestaoFornecedorComponent } from './gestao-fornecedor/questionarios-fornecedor/questao-gestao-fornecedor/questao-gestao-fornecedor.component';
import { HistoricoSolicitacaoDocumentoFornecedorArquivoComponent } from './historico-solicitacao-documento-fornecedor-arquivo/historico-solicitacao-documento-fornecedor-arquivo.component';
import { ItemFornecedorComponent } from './item-fornecedor/item-fornecedor.component';
import { ListarPendenciasComponent } from './listar-pendencias/listar-pendencias.component';
import { ListarPlanoAcaoFornecedorComponent } from './listar-plano-acao-fornecedor/listar-plano-acao-fornecedor.component';
import { ManterAcaoFornecedorComponent } from './manter-acao-fornecedor/manter-acao-fornecedor.component';
import { DocumentosFornecedorClienteComponent } from './manter-fornecedor-admin/documentos-fornecedor-cliente/documentos-fornecedor-cliente.component';
import { ItemDocumentoFornecedorClienteComponent } from './manter-fornecedor-admin/documentos-fornecedor-cliente/item-documento-fornecedor-cliente/item-documento-fornecedor-cliente.component';
import { ManterFornecedorAdminComponent } from './manter-fornecedor-admin/manter-fornecedor-admin.component';
import { ManterFornecedorCategoriaProdutoComponent } from './manter-fornecedor-categoria-produto/manter-fornecedor-categoria-produto.component';
import { ManterFornecedorNovoComponent } from './manter-fornecedor-novo/manter-fornecedor-novo.component';
import { ManterFornecedorUsuarioComponent } from './manter-fornecedor-usuario/manter-fornecedor-usuario.component';
import { HistoricoCartasResponsabilidadeComponent } from './manter-fornecedor/historico-cartas-responsabilidade/historico-cartas-responsabilidade.component';
import { ListarFornecedorUsuarioComponent } from './manter-fornecedor/listar-fornecedor-usuario/listar-fornecedor-usuario.component';
import { ListarResultadosQuestionarioComponent } from './manter-fornecedor/listar-resultados-questionario/listar-resultados-questionario.component';
import { ManterFornecedorComponent } from './manter-fornecedor/manter-fornecedor.component';
import { ManterPlanoAcaoFornecedorComponent } from './manter-plano-acao-fornecedor/manter-plano-acao-fornecedor.component';
import { MaterFornecedorPessoaJuridicaComponent } from './mater-fornecedor-pessoa-juridica/mater-fornecedor-pessoa-juridica.component';
import { ItemDocumentoModalComponent } from './modal-documento/item-documento-modal/item-documento-modal.component';
import { ModalDocumentoComponent } from './modal-documento/modal-documento.component';
import { ModalMotivoComponent } from './modal-motivo/modal-motivo.component';
import { ListarPendenciaComentarioComponent } from './pendencia-fornecedor/listar-pendencia-comentario/listar-pendencia-comentario.component';
import { ListarPendenciaFornecedorComponent } from './pendencia-fornecedor/listar-pendencia-fornecedor/listar-pendencia-fornecedor.component';
import { ManterPendenciasFornecedorComponent } from './pendencia-fornecedor/manter-pendencias-fornecedor/manter-pendencias-fornecedor.component';
import { PendenciasAdminComponent } from './pendencias-admin/pendencias-admin.component';
import { PendenciasComponent } from './pendencias/pendencias.component';
import { PlanoAcaoAdminComponent } from './plano-acao-admin/plano-acao-admin.component';
import { PlanoAcaoComponent } from './plano-acao/plano-acao.component';
import { PlanosAcaoFornecedorComponent } from './planos-acao-fornecedor/planos-acao-fornecedor.component';
import { QuestionariosAdminComponent } from './questionarios-admin/questionarios-admin.component';
import { QuestionariosComponent } from './questionarios/questionarios.component';
import { RedeFornecedoraComponent } from './rede-fornecedora/rede-fornecedora.component';
import { BaseFornecedoresComponent } from './redes/base-fornecedores/base-fornecedores.component';
import { BaseItemFornecedorComponent } from './redes/base-item-fornecedor/base-item-fornecedor.component';
import { MeusFornecedoresComponent } from './redes/meus-fornecedores/meus-fornecedores.component';
import { ItemSolicitacaoCadastroFornecedorComponent } from './solicitacao-cadastro-fornecedor/listar-solicitacao-cadastro-fornecedor/item-solicitacao-cadastro-fornecedor/item-solicitacao-cadastro-fornecedor.component';
import {
  ModalMotivoCancelamentoComponent
} from './solicitacao-cadastro-fornecedor/listar-solicitacao-cadastro-fornecedor/item-solicitacao-cadastro-fornecedor/modal-motivo-cancelamento/modal-motivo-cancelamento.component';
import { ModalObservacoesComponent } from './solicitacao-cadastro-fornecedor/listar-solicitacao-cadastro-fornecedor/item-solicitacao-cadastro-fornecedor/modal-observacoes/modal-observacoes.component';
import { ListarSolicitacaoCadastroFornecedorComponent } from './solicitacao-cadastro-fornecedor/listar-solicitacao-cadastro-fornecedor/listar-solicitacao-cadastro-fornecedor.component';
import {
  DadosGeraisSolicitacaoCadastroFornecedorComponent
} from './solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor/dados-gerais-solicitacao-cadastro-fornecedor/dados-gerais-solicitacao-cadastro-fornecedor.component';
import {
  EnderecosSolicitacaoCadastroFornecedorComponent
} from './solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor/enderecos-solicitacao-cadastro-fornecedor/enderecos-solicitacao-cadastro-fornecedor.component';
import { ManterSolicitacaoCadastroFornecedorComponent } from './solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor.component';
import { ModalUsuarioSolicitacaoFornecedorComponent } from './solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor/usuarios/modal-usuario/modal-usuario.component';
import { UsuariosComponent } from './solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor/usuarios/usuarios.component';
import { KeepSupplyCathegoryComponent } from './supply-cathegory/keep-supply-cathegory/keep-supply-cathegory.component';
import { ListSupplyCathegoryComponent } from './supply-cathegory/list-supply-cathegory/list-supply-cathegory.component';
import { ListarCategoriaFornecimentoCategoriaProdutoComponent } from './supply-cathegory/listar-categoria-fornecimento-categoria-produto/listar-categoria-fornecimento-categoria-produto.component';
import { ListarTransportadoraComponent } from './transportadora/listar-transportadora/listar-transportadora.component';
import { ManterTransportadoraPessoaJuridicaComponent } from './transportadora/manter-transportadora-pessoa-juridica/manter-transportadora-pessoa-juridica.component';
import { ManterTransportadoraComponent } from './transportadora/manter-transportadora/manter-transportadora.component';
import { VisitaTecnicaAdminComponent } from './visita-tecnica-admin/visita-tecnica-admin.component';
import { ManterResultadoVisitaTecnicaComponent } from './visita-tecnica/manter-resultado-visita-tecnica/manter-resultado-visita-tecnica.component';
import { ManterVisitaTecnicaComponent } from './visita-tecnica/manter-visita-tecnica/manter-visita-tecnica.component';

@NgModule({
  imports: [
    CommonModule,
    FornecedorRoutingModule,
    InfiniteScrollModule,
    SharedModule,
    TextMaskModule,
    TreeModule.forRoot(),
  ],
  declarations: [
    RedeFornecedoraComponent,
    ManterFornecedorComponent,
    ManterFornecedorCategoriaProdutoComponent,
    GestaoFornecedorComponent,
    ListDocumentRequestComponent,
    ManterSolicitacaoDocumentosFornecedorComponent,
    ConfiguracoesFornecedorComponent,
    ManterConfiguracoesFornecedorInteressadoComponent,
    ManterConfiguracaoTermosBoasPraticasComponent,
    ManterConfiguracaoVisitaTecnicaComponent,
    ListarConfiguracaoVisitaTecnicaComponent,
    ManterConfiguracaoAvaliacaoFornecedorComponent,
    ListarQuestionariosFornecedorComponent,
    ManterQuestionariosGestaoFornecedorComponent,
    QuestaoGestaoFornecedorComponent,
    HistoricoSolicitacaoDocumentoFornecedorArquivoComponent,
    ManterDocumentoFornecedorComponent,
    ListarDocumentoFornecedorComponent,
    ManterVisitaTecnicaComponent,
    EnviarCartaResponsabilidadeFornecedorComponent,
    HistoricoCartasResponsabilidadeComponent,
    ManterPlanoAcaoFornecedorComponent,
    ManterAcaoFornecedorComponent,
    ManterResultadoVisitaTecnicaComponent,
    ListarPendenciaFornecedorComponent,
    ManterPendenciasFornecedorComponent,
    ListarPlanoAcaoFornecedorComponent,
    ListarPendenciaComentarioComponent,
    ManterConfiguracaoVencimentoComponent,
    ListarAvaliacaoFornecedorComponent,
    ManterAvaliacaoFornecedorComponent,
    ManterQuestaoAvaliacaoFornecedorComponent,
    ListarDisparoAvaliacaoFornecedorComponent,
    ManterDisparoAvaliacaoFornecedorComponent,
    ListarResultadoAvaliacaoFornecedorComponent,
    ListarResultadosQuestionarioComponent,
    ListSupplyCathegoryComponent,
    KeepSupplyCathegoryComponent,
    ListarCategoriaFornecimentoCategoriaProdutoComponent,
    MaterFornecedorPessoaJuridicaComponent,
    CategoriasQuestoesGestaoFornecedorComponent,
    ManterCategoriasQuestoesGestaoFornecedorComponent,
    ListarQuestionarioFornecedorCriterioAvaliacaoComponent,
    ListarTransportadoraComponent,
    ManterTransportadoraComponent,
    MaterFornecedorPessoaJuridicaComponent,
    ListarPendenciasComponent,
    ListarFornecedorUsuarioComponent,
    ManterFornecedorUsuarioComponent,
    ManterTransportadoraPessoaJuridicaComponent,
    ItemFornecedorComponent,
    ManterFornecedorNovoComponent,
    DadosGeraisComponent,
    DocumentosFornecedorComponent,
    PendenciasComponent,
    PlanosAcaoFornecedorComponent,
    QuestionariosComponent,
    PlanoAcaoComponent,
    ItemDocumentoEnviarComponent,
    ModalEnviarDocumentoComponent,
    ModalDocumentoComponent,
    ModalMotivoComponent,
    ControleAcoesPorStatusComponent,
    ModalUsuarioComponent,
    ItemDocumentoModalComponent,
    ManterFornecedorAdminComponent,
    DocumentosFornecedorClienteComponent,
    ItemDocumentoFornecedorClienteComponent,
    VincularDocumentoFornecedorComponent,
    BaseFornecedoresComponent,
    MeusFornecedoresComponent,
    BaseItemFornecedorComponent,
    VisitaTecnicaAdminComponent,
    PendenciasAdminComponent,
    QuestionariosAdminComponent,
    PlanoAcaoAdminComponent,
    ListarSolicitacaoCadastroFornecedorComponent,
    ItemSolicitacaoCadastroFornecedorComponent,
    ManterSolicitacaoCadastroFornecedorComponent,
    DadosGeraisSolicitacaoCadastroFornecedorComponent,
    ModalMotivoCancelamentoComponent,
    UsuariosComponent,
    EnderecosSolicitacaoCadastroFornecedorComponent,
    ModalUsuarioSolicitacaoFornecedorComponent,
    ModalObservacoesComponent,
  ],
  entryComponents: [
    ConfiguracoesFornecedorComponent,
    ListDocumentRequestComponent,
    ManterSolicitacaoDocumentosFornecedorComponent,
    ManterFornecedorCategoriaProdutoComponent,
    ManterConfiguracoesFornecedorInteressadoComponent,
    ManterConfiguracaoTermosBoasPraticasComponent,
    ManterConfiguracaoVisitaTecnicaComponent,
    ManterConfiguracaoAvaliacaoFornecedorComponent,
    QuestaoGestaoFornecedorComponent,
    ManterVisitaTecnicaComponent,
    AuditoriaComponent,
    HistoricoSolicitacaoDocumentoFornecedorArquivoComponent,
    ManterDocumentoFornecedorComponent,
    EnviarCartaResponsabilidadeFornecedorComponent,
    HistoricoCartasResponsabilidadeComponent,
    ManterPlanoAcaoFornecedorComponent,
    ManterAcaoFornecedorComponent,
    ManterPendenciasFornecedorComponent,
    ManterConfiguracaoVencimentoComponent,
    ManterQuestaoAvaliacaoFornecedorComponent,
    ManterDisparoAvaliacaoFornecedorComponent,
    ManterCategoriasQuestoesGestaoFornecedorComponent,
    ManterFornecedorUsuarioComponent,
    ModalEnviarDocumentoComponent,
    ModalMotivoComponent,
    ControleAcoesPorStatusComponent,
    ManterEnderecoComponent,
    ModalTimelineDocumentoComponent,
    SdkDomicilioBancarioComponent,
    ItemDomicilioBancarioComponent,
    ModalDocumentoComponent,
    ItemDocumentoModalComponent,
    DocumentosFornecedorClienteComponent,
    ItemDocumentoFornecedorClienteComponent,
    VincularDocumentoFornecedorComponent,
    ModalUsuarioComponent,
    VincularDocumentoFornecedorComponent,
    BaseFornecedoresComponent,
    MeusFornecedoresComponent,
    BaseItemFornecedorComponent,
    VisitaTecnicaAdminComponent,
    PendenciasAdminComponent,
    QuestionariosAdminComponent,
    PlanoAcaoAdminComponent,
    QuestionariosComponent,
    SdkUsuarioPrincipalModalComponent,
    SdkIncluirDocumentoModalComponent,
    ModalMotivoCancelamentoComponent,
    ManterEnderecoModalComponent,
    ModalUsuarioSolicitacaoFornecedorComponent,
    ModalObservacoesComponent,
  ],
  exports: [
    ManterFornecedorCategoriaProdutoComponent,
    ListarPendenciaFornecedorComponent,
    ManterFornecedorNovoComponent,
    ManterFornecedorAdminComponent,
    ModalUsuarioComponent,
    VisitaTecnicaAdminComponent,
    PendenciasAdminComponent,
    QuestionariosAdminComponent,
    PlanoAcaoAdminComponent,
    QuestionariosComponent,
    ListarSolicitacaoCadastroFornecedorComponent,
  ],
})
export class FornecedorModule { }
