import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeUsd from '@angular/common/locales/en-US-POSIX';
import localeUsdExtra from '@angular/common/locales/extra/en-US-POSIX';
import localePtExtra from '@angular/common/locales/extra/pt';
// Locales
import localePt from '@angular/common/locales/pt';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbActiveModal, NgbCarouselModule, NgbDatepickerModule, NgbModalModule, NgbRatingModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
// Providers
import { AprovacaoService, ArquivoService, AutenticacaoService, BancoService, CampanhaService, CatalogoService, CategoriaMaterialService, CategoriaProdutoService, CentroCustoService, CidadeService, CnaeService, CondicaoPagamentoService, ConfiguracaoAvaliacaoFornecedorService, ConfiguracaoFornecedorInteressadoService, ConfiguracaoTermosBoasPraticasService, ConfiguracaoVisitaTecnicaService, ContaContabilService, CotacaoRodadaService, CotacaoService, CriterioAvaliacaoService, DepartamentoService, DomicilioBancarioService, EnderecoService, EstadoService, EventoBuscarService, FaturamentoMinimoFreteService, FornecedorService, FranchiseCampaignService, GrupoCompradoresService, GrupoDespesaService, HeaderInterceptor, LocalStorageService, LogService, MarcaService, MaskService, MatrizResponsabilidadeService, MenuService, NaturezaJuridicaService, OrigemMaterialService, PaisService, PendenciasFornecedorComentarioService, PendenciasFornecedorService, PessoaJuridicaService, PlanoAcaoFornecedorService, ProdutoService, ResultadoVisitaTecnicaService, SlaService, SolicitacaoCompraService, SolicitacaoDocumentoFornecedorArquivoService, SolicitacaoProdutoService, StorageService, SuporteService, TipoDespesaService, TipoPedidoService, TipoRequisicaoService, TranslationLibraryService, UnidadeMedidaService, UtilizacaoMaterialService } from '@shared/providers';
import { AcompanhamentosService } from '@shared/providers/acompanhamentos.service';
import { TransportadoraService } from '@shared/providers/transportadora.service';
import { TreeModule } from 'angular-tree-component';
import { TextMaskModule } from 'angular2-text-mask';
import { BlockUIModule } from 'ng-block-ui';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import { CKEditorModule } from 'ng2-ckeditor';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AceiteTermosComponent } from '../modules/dashboard/aceite-termos/aceite-termos.component';
// Guards
import { ListeFuncionalidadeProdutoCatalogoComponent } from '../modules/liste-funcionalidade-produto-catalogo/liste-funcionalidade-produto-catalogo.component';
import { ListarDomiciliosBancariosComponent } from '../modules/pessoa-juridica/domicilio-bancario/listar-domicilios-bancarios/listar-domicilios-bancarios.component';
import { ManterDomicilioBancarioComponent } from '../modules/pessoa-juridica/domicilio-bancario/manter-domicilio-bancario/manter-domicilio-bancario.component';
import { ManterPessoaCnaeComponent } from '../modules/pessoa-juridica/manter-pessoa-cnae/manter-pessoa-cnae.component';
import { ManterItemSolicitacaoCompraComponent } from '../modules/solicitacao-compra/item-solicitacao-compra/manter-item-solicitacao-compra/manter-item-solicitacao-compra.component';
import { ManterUsuarioResponsavelSolicitacaoCompraComponent } from '../modules/solicitacao-compra/manter-usuario-responsavel-solicitacao-compra/manter-usuario-responsavel-solicitacao-compra.component';
import { SuporteComponent } from '../modules/suporte/suporte/suporte.component';
import { ItemUsuarioFornecedorComponent } from '../modules/usuario/manter-usuario-fornecedor/item-usuario-fornecedor/item-usuario-fornecedor.component';
import { ManterUsuarioFornecedorComponent } from '../modules/usuario/manter-usuario-fornecedor/manter-usuario-fornecedor.component';
// Components
import * as components from './components';
import { CartaDeResponsabilidadeComponent, EnderecoComponent, ItemCartaResponsabilidadeComponent, ItemEnderecoComponent, SdkButtonComponent, SdkGenericHeaderPageComponent, SdkListViewComponent, SdkModalComponent, SdkSuspenseMenuButtonComponent, SdkTimelineComponent, SdkTimelineEntryComponent } from './components';
import { AuditoriaCotacaoComponent } from './components/auditoria/auditoria-cotacao/auditoria-cotacao.component';
import { ComponentContainerComponent } from './components/component-container/component-container.component';
import { ColumnComponent } from './components/data-list/components/column/column.component';
import { CustomColumnDirective } from './components/data-list/directives/custom-column.directive';
import { DualListComponent } from './components/data-list/dual-list/dual-list.component';
import { ListContainerComponent } from './components/data-list/list-container/list-container.component';
import { CustomQuantityLabelDirective } from './components/data-list/list/directives/custom-quantity-label.directive';
import { ListComponent } from './components/data-list/list/list.component';
import { ColumnPipe } from './components/data-list/pipes/column.pipe';
import { TableComponent } from './components/data-list/table/table.component';
import { EmptyComponent } from './components/empty/empty.component';
import { SmkBarraAcoesFuncionalidadeComponent } from './components/funcionalidade/smk-barra-acoes-funcionalidade/smk-barra-acoes-funcionalidade.component';
import { SmkCardFuncionalidadeComponent } from './components/funcionalidade/smk-card-funcionalidade/smk-card-funcionalidade.component';
import { SmkFiltroFuncionalidadeComponent } from './components/funcionalidade/smk-filtro-funcionalidade/smk-filtro-funcionalidade.component';
import { SmkFuncionalidadeComponent } from './components/funcionalidade/smk-funcionalidade/smk-funcionalidade.component';
import { SmkListarFuncionalidadeComponent } from './components/funcionalidade/smk-listar-funcionalidade/smk-listar-funcionalidade.component';
import { SmkTableFuncionalidadeComponent } from './components/funcionalidade/smk-table-funcionalidade/smk-table-funcionalidade.component';
import { SmkTituloFuncionalidadeComponent } from './components/funcionalidade/smk-titulo-funcionalidade/smk-titulo-funcionalidade.component';
import { ItemContratoFornecedorComponent } from './components/item-contrato-fornecedor/item-contrato-fornecedor.component';
import { ListarComentarioPlanoAcaoComponent } from './components/listar-comentario-plano-acao/listar-comentario-plano-acao.component';
import { SituacaoFluxoIntegracaoErpClassDirective } from './components/listar-fluxo-integracao-erp/directives/situacao-fluxo-integracao-erp-class.directive';
import { SituacaoFluxoIntegracaoErpTextDirective } from './components/listar-fluxo-integracao-erp/directives/situacao-fluxo-integracao-erp-text.directive';
import { TipoFluxoIntegracaoErpTextDirective } from './components/listar-fluxo-integracao-erp/directives/tipo-fluxo-integracao-erp-text.directive';
import { ListarFluxoIntegracaoErpComponent } from './components/listar-fluxo-integracao-erp/listar-fluxo-integracao-erp.component';
import { ManterAnexosComponent } from './components/manter-anexos/manter-anexos.component';
import { ManterEntregasProgramadasComponent } from './components/manter-entregas-programadas/manter-entregas-programadas.component';
import { ManterIntegracoesErpComponent } from './components/manter-integracoes-erp/manter-integracoes-erp.component';
import { ModalCategoriaFornecimentoComponent } from './components/modal-categoria-fornecimento/modal-categoria-fornecimento.component';
import { ModalTextAreaComponent } from './components/modal-textarea/modal-textarea.component';
import { AlterarValorReferenciaComponent } from './components/modals/alterar-valor-referencia/alterar-valor-referencia.component';
import { HistoricoAceiteTermosComponent } from './components/modals/historico-aceite-termos/historico-aceite-termos.component';
import { ManterEnderecoModalComponent } from './components/modals/manter-endereco-modal/manter-endereco-modal.component';
import { ManterErpComponent } from './components/modals/manter-erp/manter-erp.component';
import { ManterUsuarioModalComponent } from './components/modals/manter-usuario-modal/manter-usuario-modal.component';
import { ModalConfirmacaoAceiteCampanhaFranqueadoComponent } from './components/modals/modal-confirmacao-aceite-campanha-franqueado/modal-confirmacao-aceite-campanha-franqueado.component';
import { ModalConfirmacaoAtivacaoCampanhaFranquiaComponent } from './components/modals/modal-confirmacao-ativacao-campanha-franquia/modal-confirmacao-ativacao-campanha-franquia.component';
import { ModalConfirmacaoRecusaCampanhaFranqueadoComponent } from './components/modals/modal-confirmacao-recusa-campanha-franqueado/modal-confirmacao-recusa-campanha-franqueado.component';
import { ModalEditarDataVigenciaComponent } from './components/modals/modal-editar-data-vigencia/modal-editar-data-vigencia.component';
import { ModalTimelineDocumentoComponent } from './components/modals/modal-timeline-documento/modal-timeline-documento.component';
import { ObservacaoPedidoComponent } from './components/modals/observacao-pedido/observacao-pedido.component';
import { RecusaAprovacaoContratoComponent } from './components/modals/recusa-aprovacao-contrato/recusa-aprovacao-contrato.component';
import { SmkConfirmacaoComponent } from './components/modals/smk-confirmacao/smk-confirmacao.component';
// Pipes
import { SmkModalValidacaoDeContaComponent } from './components/modals/smk-modal-validacao-de-conta/smk-modal-validacao-de-conta.component';
import { SdkCardEntryComponent } from './components/sdk-card-entry/sdk-card-entry.component';
import { SdkChartAreaComponent } from './components/sdk-chart-area/sdk-chart-area.component';
import { SdkChartBarComponent } from './components/sdk-chart-bar/sdk-chart-bar.component';
import { SdkChartPieComponent } from './components/sdk-chart-pie/sdk-chart-pie.component';
import { SdkChipComponent } from './components/sdk-chip/sdk-chip.component';
import { SdkCircleprogressbarComponent } from './components/sdk-circleprogressbar/sdk-circleprogressbar.component';
import { IncluirCnaeComponent } from './components/sdk-cnae/incluir-cnae/incluir-cnae.component';
import { ItemCnaeComponent } from './components/sdk-cnae/item-cnae/item-cnae.component';
import { SdkCnaeComponent } from './components/sdk-cnae/sdk-cnae.component';
import { SdkCollapseFilterComponent } from './components/sdk-collapse-filter/sdk-collapse-filter.component';
import { ItemDomicilioBancarioComponent } from './components/sdk-domicilio-bancario/item-domicilio-bancario/item-domicilio-bancario.component';
import { SdkDomicilioBancarioComponent } from './components/sdk-domicilio-bancario/sdk-domicilio-bancario.component';
import { SdkDynamicFilterComponent } from './components/sdk-dynamic-filter/sdk-dynamic-filter.component';
import { SdkFilterComponent } from './components/sdk-filter/sdk-filter.component';
import { SdkGroupCompaniesComponent } from './components/sdk-group-companies/sdk-group-companies.component';
import { SdkHeaderDefaultComponent } from './components/sdk-header-default/sdk-header-default.component';
import { SdkHeaderComponent } from './components/sdk-header/sdk-header.component';
import { SdkHorizontalScrollComponent } from './components/sdk-horizontal-scroll/sdk-horizontal-scroll.component';
import { SdkIncluirDocumentoModalComponent } from './components/sdk-incluir-documento-modal/sdk-incluir-documento-modal.component';
import { SdkItemCardComponent } from './components/sdk-item-card/sdk-item-card.component';
import { SdkListViewItem } from './components/sdk-list-view/skd-list-view-item.directive';
import { SdkManterLogoComponent } from './components/sdk-manter-logo/sdk-manter-logo.component';
import { SdkMenuItemComponent } from './components/sdk-menu-item/sdk-menu-item.component';
import { SdkMenuComponent } from './components/sdk-menu/sdk-menu.component';
import { SdkNuvemModalComponent } from './components/sdk-nuvem-modal/sdk-nuvem-modal.component';
import { SdkNuvemComponent } from './components/sdk-nuvem/sdk-nuvem.component';
import { SdkProgressbarComponent } from './components/sdk-progressbar/sdk-progressbar.component';
import { SdkRectangleButtonCustomComponent } from './components/sdk-rectangle-button-custom/sdk-rectangle-button-custom.component';
import { SdkRectangleButtonComponent } from './components/sdk-rectangle-button/sdk-rectangle-button.component';
import { SdkRectangleTagComponent } from './components/sdk-rectangle-tag/sdk-rectangle-tag.component';
import { SdkSuspenseMenu } from './components/sdk-suspense-menu-button/sdk-suspense-menu.directive';
import { SdkTagInputComponent } from './components/sdk-tag-input/sdk-tag-input.component';
import { SdkTagReadOnlyComponent } from './components/sdk-tag-read-only/sdk-tag-read-only.component';
import { SdkThreeColumnsComponent } from './components/sdk-three-columns/sdk-three-columns.component';
import { SdkTwoColumnsComponent } from './components/sdk-two-columns/sdk-two-columns.component';
import { SdkUserSelectComponent } from './components/sdk-user-select/sdk-user-select.component';
import { SdkUsuarioPrincipalModalComponent } from './components/sdk-usuario-principal-modal/sdk-usuario-principal-modal.component';
import { SdkVerticalHeaderLeftComponent } from './components/sdk-vertical-header-left/sdk-vertical-header-left.component';
import { SelectMoedaComponent } from './components/select-moeda/select-moeda.component';
import { SidebarCustomComponent } from './components/sidebar-custom/sidebar-custom.component';
import { SmkValidacaoDeContaComponent } from './components/smk-validacao-de-conta/smk-validacao-de-conta.component';
import { ClickPreventDefaultDirective } from './directives/click-prevent-default.directive';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
import { CustomLabelDirective } from './directives/custom-label.directive';
import { DateRangeDirective } from './directives/date-range.directive';
import { DecimalRequiredDirective } from './directives/decimal-required.directive';
// Directives
import { NgxMaskModule } from 'ngx-mask';
import { RecusaAprovacaoContratoFornecedorComponent } from './components/modals/recusa-aprovacao-contrato-fornecedor/recusa-aprovacao-contrato-fornecedor.component';
import { SmkModalComponent } from './components/modals/smk-modal/smk-modal.component';
import { SelectMultipleOptionPainelComponent } from './components/select-multiple-option-panel/select-multiple-option-painel.component';
import { SelectMultipleComponent } from './components/select-multiple/select-multiple.component';
import { PermissionsDirective } from './directives/permissions.directive';
import { ValidDateDirective } from './directives/valid-date.directive';
import { PermissaoAcompanhamentosGuard } from './guards/permissao-acompanhamentos.guard';
import { PermissaoGestaoFornecedoresGuard } from './guards/permissao-gestao-fornecedores.guard';
import { PermissaoRequisicaoGuard } from './guards/permissao-requisicao.guard';
import { PermissaoSolicitacaoCompraGuard } from './guards/permissao-solicitacao-compra.guard';
import { PermissaoGuard } from './guards/permissao.guard';
import { SsoGuard } from './guards/sso.guard';
import { ValidaTermoAceiteGuard } from './guards/valida-termo-aceite.guard';
import { AbsPipe, CnpjCpfPipe, CustomCurrencyPipe, DataAlteracaoPipe, EnumToArrayPipe, GroupByPipe, MoedaCodigoPipe, MoedaLocalePipe, NoContentPipe, SafePipe, SituacaoPedidoPipe } from './pipes';
import { CompetenciaPipe } from './pipes/competencia.pipe';
import { DescricaoCarrinhoCatalogoPipe } from './pipes/descricao-carrinho-catalogo.pipe';
import { IdContratoCatalogoPipe } from './pipes/id-contrato-catalogo.pipe';
import { PorcentagemPipe } from './pipes/porcentagem.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { BuyerServiceService } from './providers/buyer-service.service';
import { CarrinhoService } from './providers/carrinho.service';
import { ContratoCatalogoService } from './providers/contrato-catalogo.service';
import { CotacaoRodadaArquivoService } from './providers/cotacao-rodada-arquivo.service';
import { ExportacaoService } from './providers/exportacao.service';
import { IndicadorService } from './providers/indicador.service';
import { NcmService } from './providers/ncm.service';
import { NotificacaoService } from './providers/notificacao.service';
import { ParticipanteCampanhaFranquiaService } from './providers/participante-campanha-franquia.service';
import { PedidoService } from './providers/pedido.service';
import { ProdutoFavoritoService } from './providers/produto-favorito.service';
import { ProdutoIAService } from './providers/produto-ia.service';
import { RelatoriosService } from './providers/relatorios.service';
import { RequisicaoService } from './providers/requisicao.service';
import { UsuarioService } from './providers/usuario.service';

registerLocaleData(localeUsd, 'en-US', localeUsdExtra);
registerLocaleData(localePt, 'pt-BR', localePtExtra);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModalModule.forRoot(),
    TreeModule.forRoot(),
    NgSelectModule,
    TextMaskModule,
    NgbCarouselModule,
    NgbTabsetModule,
    NgbRatingModule,
    InfiniteScrollModule,
    ChartsModule,
    CKEditorModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    NgCircleProgressModule,
    TextMaskModule,
    BlockUIModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  declarations: [
    components.FiltroComponent,
    components.ModalConfirmacaoExclusao,
    components.CatalogoItemComponent,
    components.CustomTableComponent,
    components.InputTreeComponent,
    components.InputFileComponent,
    components.PagerComponent,
    components.InputProdutoComponent,
    components.InputFornecedorComponent,
    MoedaCodigoPipe,
    MoedaLocalePipe,
    DataAlteracaoPipe,
    components.DetalhesPedidoComponent,
    PermissionsDirective,
    components.ConfirmacaoMudancaPedidoComponent,
    components.ConfirmacaoComponent,
    components.NotificacaoComponent,
    SituacaoPedidoPipe,
    components.InputRatingComponent,
    components.InputBuscaComponent,
    components.InputNumberComponent,
    components.InputNumberMinValueComponent,
    components.InputBookmarkComponent,
    components.ComentariosComponent,
    components.CollapseFooterComponent,
    components.TimelineComponent,
    GroupByPipe,
    components.AuditoriaComponent,
    components.GaleriaArquivosComponent,
    components.CatalogoItemGradeComponent,
    AbsPipe,
    components.CronometroComponent,
    components.IndicadorNumericoComponent,
    components.IndicadorGraficoComponent,
    components.CkeditorComponent,
    CustomCurrencyPipe,
    AceiteTermosComponent,
    HistoricoAceiteTermosComponent,
    components.AutoSaveLabelComponent,
    components.ManterProdutoModalComponent,
    ManterItemSolicitacaoCompraComponent,
    components.InputDateComponent,
    SafePipe,
    components.InputEnderecosComponent,
    components.ManterEnderecoComponent,
    NoContentPipe,
    ListarComentarioPlanoAcaoComponent,
    ListarDomiciliosBancariosComponent,
    ManterPessoaCnaeComponent,
    ManterUsuarioResponsavelSolicitacaoCompraComponent,
    CnpjCpfPipe,
    AuditoriaCotacaoComponent,
    AlterarValorReferenciaComponent,
    SelectMoedaComponent,
    EnumToArrayPipe,
    components.SdkTimelineComponent,
    components.SdkTimelineEntryComponent,
    ManterDomicilioBancarioComponent,
    SdkProgressbarComponent,
    SdkCircleprogressbarComponent,
    SdkCardEntryComponent,
    SdkChartAreaComponent,
    SdkChartPieComponent,
    SdkChartBarComponent,
    SdkChipComponent,
    SdkModalComponent,
    SdkListViewComponent,
    SdkListViewItem,
    SdkButtonComponent,
    SdkSuspenseMenuButtonComponent,
    SdkHorizontalScrollComponent,
    SdkDynamicFilterComponent,
    SdkFilterComponent,
    SdkTagInputComponent,
    components.SdkGenericHeaderPageComponent,
    SdkSuspenseMenu,
    SdkVerticalHeaderLeftComponent,
    SdkThreeColumnsComponent,
    components.EnderecoComponent,
    components.ItemEnderecoComponent,
    SdkDomicilioBancarioComponent,
    ItemDomicilioBancarioComponent,
    SdkCnaeComponent,
    ItemCnaeComponent,
    IncluirCnaeComponent,
    SdkRectangleButtonComponent,
    components.ModalTimelineDocumentoComponent,
    components.ModalEditarDataVigenciaComponent,
    SdkNuvemComponent,
    SdkNuvemModalComponent,
    ModalCategoriaFornecimentoComponent,
    SdkItemCardComponent,
    SdkManterLogoComponent,
    SdkMenuComponent,
    SdkMenuItemComponent,
    SdkTwoColumnsComponent,
    SdkCollapseFilterComponent,
    SdkGroupCompaniesComponent,
    components.SdkInputIconComponent,
    components.SdkSelectComponent,
    components.SdkSelectDateComponent,
    SdkUsuarioPrincipalModalComponent,
    SdkIncluirDocumentoModalComponent,
    SdkTagReadOnlyComponent,
    ManterUsuarioFornecedorComponent,
    ItemUsuarioFornecedorComponent,
    SdkHeaderComponent,
    SdkRectangleTagComponent,
    ManterEnderecoModalComponent,
    SdkHeaderDefaultComponent,
    CartaDeResponsabilidadeComponent,
    ItemCartaResponsabilidadeComponent,
    SidebarCustomComponent,
    SdkUserSelectComponent,
    ManterUsuarioModalComponent,
    SdkRectangleButtonCustomComponent,
    ObservacaoPedidoComponent,
    ModalConfirmacaoAtivacaoCampanhaFranquiaComponent,
    ModalConfirmacaoAceiteCampanhaFranqueadoComponent,
    ModalConfirmacaoRecusaCampanhaFranqueadoComponent,
    ClickStopPropagationDirective,
    ManterErpComponent,
    ManterIntegracoesErpComponent,
    ManterEntregasProgramadasComponent,
    DateRangeDirective,
    ValidDateDirective,
    DecimalRequiredDirective,
    EmptyComponent,
    ListarFluxoIntegracaoErpComponent,
    SituacaoFluxoIntegracaoErpClassDirective,
    SituacaoFluxoIntegracaoErpTextDirective,
    TableComponent,
    ColumnComponent,
    DualListComponent,
    CustomColumnDirective,
    SearchPipe,
    ManterAnexosComponent,
    TipoFluxoIntegracaoErpTextDirective,
    ListComponent,
    CustomLabelDirective,
    CustomQuantityLabelDirective,
    ListContainerComponent,
    ComponentContainerComponent,
    ClickPreventDefaultDirective,
    CompetenciaPipe,
    SuporteComponent,
    SmkFiltroFuncionalidadeComponent,
    SmkTituloFuncionalidadeComponent,
    SmkTableFuncionalidadeComponent,
    SmkListarFuncionalidadeComponent,
    SmkConfirmacaoComponent,
    ColumnPipe,
    SmkBarraAcoesFuncionalidadeComponent,
    SmkCardFuncionalidadeComponent,
    SmkFuncionalidadeComponent,
    SmkValidacaoDeContaComponent,
    DataAlteracaoPipe,
    SmkModalValidacaoDeContaComponent,
    PorcentagemPipe,
    IdContratoCatalogoPipe,
    DescricaoCarrinhoCatalogoPipe,
    ItemContratoFornecedorComponent,
    RecusaAprovacaoContratoComponent,
    ModalTextAreaComponent,
    ListeFuncionalidadeProdutoCatalogoComponent,
    RecusaAprovacaoContratoFornecedorComponent,
    SmkModalComponent,
    SelectMultipleComponent,
    SelectMultipleOptionPainelComponent
  ],
  entryComponents: [
    components.ModalConfirmacaoExclusao,
    components.CustomTableComponent,
    components.InputTreeComponent,
    components.InputFileComponent,
    components.PagerComponent,
    components.InputProdutoComponent,
    components.InputFornecedorComponent,
    components.CatalogoItemComponent,
    components.DetalhesPedidoComponent,
    components.ConfirmacaoMudancaPedidoComponent,
    components.ConfirmacaoComponent,
    components.NotificacaoComponent,
    components.ComentariosComponent,
    components.TimelineComponent,
    components.AuditoriaComponent,
    components.GaleriaArquivosComponent,
    HistoricoAceiteTermosComponent,
    components.ManterEnderecoComponent,
    ManterUsuarioResponsavelSolicitacaoCompraComponent,
    AuditoriaCotacaoComponent,
    AlterarValorReferenciaComponent,
    ManterDomicilioBancarioComponent,
    SdkModalComponent,
    SdkProgressbarComponent,
    SdkCircleprogressbarComponent,
    SdkCardEntryComponent,
    SdkChartBarComponent,
    SdkHorizontalScrollComponent,
    SdkDynamicFilterComponent,
    SdkFilterComponent,
    SdkTagInputComponent,
    IncluirCnaeComponent,
    SdkRectangleButtonComponent,
    components.ModalEditarDataVigenciaComponent,
    SdkNuvemComponent,
    SdkNuvemModalComponent,
    ModalCategoriaFornecimentoComponent,
    SdkCollapseFilterComponent,
    SdkRectangleTagComponent,
    SdkHeaderComponent,
    ItemCartaResponsabilidadeComponent,
    SidebarCustomComponent,
    ManterUsuarioModalComponent,
    ObservacaoPedidoComponent,
    ModalConfirmacaoAtivacaoCampanhaFranquiaComponent,
    ModalConfirmacaoAceiteCampanhaFranqueadoComponent,
    ModalConfirmacaoRecusaCampanhaFranqueadoComponent,
    ManterErpComponent,
    ManterEntregasProgramadasComponent,
    ListarFluxoIntegracaoErpComponent,
    TableComponent,
    ColumnComponent,
    DualListComponent,
    SuporteComponent,
    SmkConfirmacaoComponent,
    SmkModalValidacaoDeContaComponent,
    ItemContratoFornecedorComponent,
    RecusaAprovacaoContratoComponent,
    RecusaAprovacaoContratoFornecedorComponent,
    ModalTextAreaComponent,
    SelectMultipleOptionPainelComponent

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    components.FiltroComponent,
    components.ModalConfirmacaoExclusao,
    components.CatalogoItemComponent,
    components.CustomTableComponent,
    components.InputTreeComponent,
    components.InputFileComponent,
    NgSelectModule,
    components.PagerComponent,
    components.InputProdutoComponent,
    components.InputFornecedorComponent,
    MoedaCodigoPipe,
    MoedaLocalePipe,
    DataAlteracaoPipe,
    components.DetalhesPedidoComponent,
    PermissionsDirective,
    components.ConfirmacaoMudancaPedidoComponent,
    components.ConfirmacaoComponent,
    components.NotificacaoComponent,
    SituacaoPedidoPipe,
    components.InputRatingComponent,
    components.InputBuscaComponent,
    components.InputNumberComponent,
    components.InputNumberMinValueComponent,
    components.InputBookmarkComponent,
    components.CollapseFooterComponent,
    components.ComentariosComponent,
    components.TimelineComponent,
    GroupByPipe,
    NgbModalModule,
    components.AuditoriaComponent,
    components.GaleriaArquivosComponent,
    components.CatalogoItemGradeComponent,
    AbsPipe,
    components.CronometroComponent,
    components.IndicadorNumericoComponent,
    components.IndicadorGraficoComponent,
    components.CkeditorComponent,
    CustomCurrencyPipe,
    components.AutoSaveLabelComponent,
    components.ManterProdutoModalComponent,
    ManterItemSolicitacaoCompraComponent,
    AceiteTermosComponent,
    components.InputDateComponent,
    SafePipe,
    components.InputEnderecosComponent,
    NoContentPipe,
    ListarComentarioPlanoAcaoComponent,
    ListarDomiciliosBancariosComponent,
    ManterPessoaCnaeComponent,
    CnpjCpfPipe,
    SelectMoedaComponent,
    EnumToArrayPipe,
    SdkModalComponent,
    SdkTimelineComponent,
    SdkTimelineEntryComponent,
    components.SdkTimelineComponent,
    components.SdkTimelineEntryComponent,
    SdkProgressbarComponent,
    SdkCircleprogressbarComponent,
    SdkCardEntryComponent,
    SdkChartPieComponent,
    SdkChartAreaComponent,
    SdkChartBarComponent,
    SdkChipComponent,
    SdkVerticalHeaderLeftComponent,
    SdkThreeColumnsComponent,
    SdkHorizontalScrollComponent,
    SdkDynamicFilterComponent,
    SdkFilterComponent,
    SdkTagInputComponent,
    components.SdkListViewComponent,
    SdkListViewItem,
    SdkButtonComponent,
    SdkSuspenseMenuButtonComponent,
    SdkGenericHeaderPageComponent,
    SdkSuspenseMenu,
    EnderecoComponent,
    ItemEnderecoComponent,
    SdkDomicilioBancarioComponent,
    ItemDomicilioBancarioComponent,
    ModalTimelineDocumentoComponent,
    ModalEditarDataVigenciaComponent,
    ModalCategoriaFornecimentoComponent,
    SdkTwoColumnsComponent,
    SdkItemCardComponent,
    SdkManterLogoComponent,
    SdkMenuComponent,
    SdkMenuItemComponent,
    SdkGroupCompaniesComponent,
    SdkRectangleButtonComponent,
    NgbTooltipModule,
    components.SdkInputIconComponent,
    components.SdkSelectComponent,
    components.SdkSelectDateComponent,
    SdkHeaderComponent,
    SdkNuvemComponent,
    SdkManterLogoComponent,
    SdkMenuComponent,
    SdkMenuItemComponent,
    TextMaskModule,
    SdkCnaeComponent,
    ManterUsuarioFornecedorComponent,
    ItemUsuarioFornecedorComponent,
    SdkCollapseFilterComponent,
    SdkRectangleTagComponent,
    SdkHeaderComponent,
    CartaDeResponsabilidadeComponent,
    ItemCartaResponsabilidadeComponent,
    SdkUserSelectComponent,
    SdkHeaderDefaultComponent,
    SdkRectangleButtonCustomComponent,
    ClickStopPropagationDirective,
    ManterIntegracoesErpComponent,
    ManterEntregasProgramadasComponent,
    ListarFluxoIntegracaoErpComponent,
    TableComponent,
    ColumnComponent,
    DualListComponent,
    CustomColumnDirective,
    SearchPipe,
    ManterAnexosComponent,
    ListComponent,
    CustomLabelDirective,
    CustomQuantityLabelDirective,
    ListContainerComponent,
    ComponentContainerComponent,
    ClickPreventDefaultDirective,
    CompetenciaPipe,
    SmkFiltroFuncionalidadeComponent,
    SmkTituloFuncionalidadeComponent,
    SmkTableFuncionalidadeComponent,
    SmkListarFuncionalidadeComponent,
    SmkConfirmacaoComponent,
    SmkBarraAcoesFuncionalidadeComponent,
    SmkCardFuncionalidadeComponent,
    SmkFuncionalidadeComponent,
    SmkValidacaoDeContaComponent,
    PorcentagemPipe,
    IdContratoCatalogoPipe,
    DescricaoCarrinhoCatalogoPipe,
    ItemContratoFornecedorComponent,
    ListeFuncionalidadeProdutoCatalogoComponent,
    ModalTextAreaComponent,
    SmkModalComponent,
    SelectMultipleComponent,
    SelectMultipleOptionPainelComponent
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
        CurrencyPipe,
        DecimalPipe,
        // { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
        LocalStorageService,
        AutenticacaoService,
        TranslationLibraryService,
        UsuarioService,
        UnidadeMedidaService,
        PaisService,
        CnaeService,
        BancoService,
        EstadoService,
        CidadeService,
        CnaeService,
        BancoService,
        MarcaService,
        PaisService,
        CategoriaProdutoService,
        RequisicaoService,
        PessoaJuridicaService,
        ProdutoService,
        GrupoDespesaService,
        NaturezaJuridicaService,
        TipoDespesaService,
        ArquivoService,
        ContaContabilService,
        ContratoCatalogoService,
        MenuService,
        DomicilioBancarioService,
        PedidoService,
        CatalogoService,
        StorageService,
        MoedaCodigoPipe,
        MoedaLocalePipe,
        DataAlteracaoPipe,
        CentroCustoService,
        CondicaoPagamentoService,
        FornecedorService,
        DatePipe,
        PermissaoGuard,
        EnderecoService,
        FaturamentoMinimoFreteService,
        SituacaoPedidoPipe,
        AprovacaoService,
        DepartamentoService,
        SlaService,
        CarrinhoService,
        MatrizResponsabilidadeService,
        EventoBuscarService,
        LogService,
        CotacaoService,
        SolicitacaoProdutoService,
        SolicitacaoCompraService,
        TipoRequisicaoService,
        IndicadorService,
        PermissaoRequisicaoGuard,
        PermissaoSolicitacaoCompraGuard,
        PermissaoAcompanhamentosGuard,
        ConfiguracaoFornecedorInteressadoService,
        GrupoCompradoresService,
        TipoPedidoService,
        CotacaoRodadaService,
        CustomCurrencyPipe,
        ConfiguracaoTermosBoasPraticasService,
        ConfiguracaoVisitaTecnicaService,
        ConfiguracaoAvaliacaoFornecedorService,
        MaskService,
        OrigemMaterialService,
        UtilizacaoMaterialService,
        CategoriaMaterialService,
        PlanoAcaoFornecedorService,
        SolicitacaoDocumentoFornecedorArquivoService,
        CampanhaService,
        PermissaoGestaoFornecedoresGuard,
        SuporteService,
        ResultadoVisitaTecnicaService,
        CriterioAvaliacaoService,
        PendenciasFornecedorService,
        PendenciasFornecedorComentarioService,
        RelatoriosService,
        NoContentPipe,
        ValidaTermoAceiteGuard,
        TransportadoraService,
        AcompanhamentosService,
        CnpjCpfPipe,
        SafePipe,
        EnumToArrayPipe,
        CotacaoRodadaArquivoService,
        ExportacaoService,
        BuyerServiceService,
        FranchiseCampaignService,
        ParticipanteCampanhaFranquiaService,
        NgbActiveModal,
        SsoGuard,
        CompetenciaPipe,
        NotificacaoService,
        ProdutoFavoritoService,
        PorcentagemPipe,
        NcmService,
        IdContratoCatalogoPipe,
        DescricaoCarrinhoCatalogoPipe,
        ProdutoIAService,
      ],
    };
  }

}
