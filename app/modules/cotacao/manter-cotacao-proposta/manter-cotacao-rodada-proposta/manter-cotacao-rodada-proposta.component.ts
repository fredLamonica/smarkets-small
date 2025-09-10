import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CotacaoItem, CotacaoRodada, CotacaoRodadaProposta, Moeda, TipoFrete, TipoProduto } from '@shared/models';
import { CotacaoRodadaService, MaskService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { CotacaoRodadaPropostaDto } from '../../../../shared/models/dto/cotacao-rodada-proposta-dto';
import { ManterCotacaoPropostaItemComponent } from '../manter-cotacao-proposta-item/manter-cotacao-proposta-item.component';
import { ErrorService } from './../../../../shared/utils/error.service';

@Component({
  selector: 'manter-cotacao-rodada-proposta',
  templateUrl: './manter-cotacao-rodada-proposta.component.html',
  styleUrls: ['./manter-cotacao-rodada-proposta.component.scss'],
})
export class ManterCotacaoRodadaPropostaComponent extends Unsubscriber implements OnInit, OnChanges {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(ManterCotacaoPropostaItemComponent) filhos: QueryList<ManterCotacaoPropostaItemComponent>;

  Moeda = Moeda;

  idCotacao: number;
  @Input() rodada: CotacaoRodada;
  @Input('habilitar-imposto-ncm-cotacao') habilitarimpostoNcmCotacao = false;
  @Output() itensAlterados = new EventEmitter<number[]>();
  @Output() itensSalvos = new EventEmitter<number[]>();
  @Output() inativarAtivarProduto = new EventEmitter();
  @Input() cotacaoItemHeaderEvent: EventEmitter<void>;
  @Input() formPropostaItemHeader: FormGroup;



  permitirEditarPropostaEvent: EventEmitter<void> = new EventEmitter();

  readonly: boolean = false;
  reenviarProposta: boolean = false;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoRodadaService: CotacaoRodadaService,
    private maskService: MaskService,
    private router: Router,
    private modalService: NgbModal,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.checkReadonly();
    this.checkReenviarProposta();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkReadonly();
    this.checkReenviarProposta();
  }

  onItensAlterados(itensAlterados: number[]){
      this.itensAlterados.emit(itensAlterados);
  }
  onItensSalvos(itenSalvos: number[]){
    this.itensSalvos.emit(itenSalvos);
  }

  habilitarDesabilitarForm() {
    this.inativarAtivarProduto.emit();
  }

  propostasValidas(): boolean {
    let propostaValida: boolean = true;

    if (moment().isAfter(moment(this.rodada.dataEncerramento)) && !this.reenviarProposta) {
      this.toastr.warning('Não é possível enviar proposta após data de encerramento da rodada');
      return false;
    }
    this.rodada.itens.forEach((itemCotacao) => {
        if (itemCotacao.proposta.ativo ) {
          if (!itemCotacao.proposta.marca || itemCotacao.proposta.marca.trim() == '') {
            propostaValida = false;
          }
          if (itemCotacao.proposta.quantidadeDisponivel == null) {
            propostaValida = false;
          } else {
            let min = 1;
            if (
              itemCotacao.produto &&
              itemCotacao.produto.unidadeMedida &&
              itemCotacao.produto.unidadeMedida.permiteQuantidadeFracionada
            ) {
              min = 0.0001;
            }
            if (itemCotacao.proposta.quantidadeDisponivel < min) {
              propostaValida = false;
            }
          }
          if (itemCotacao.proposta.embalagemEmbarque === null || itemCotacao.proposta.embalagemEmbarque < 1) {
            propostaValida = false;
          }
          if (!itemCotacao.proposta.idUnidadeMedidaEmbalagemEmbarque) {
            propostaValida = false;
          }
          if (itemCotacao.proposta.faturamentoMinimo === null) {
            propostaValida = false;
          }
          if (itemCotacao.proposta.prazoEntrega === null) {
            propostaValida = false;
          }
          if (!itemCotacao.proposta.incoterms) {
            propostaValida = false;
          }
          if (itemCotacao.proposta.valorFrete === null
            && ![TipoFrete.Cif, TipoFrete.Fob].includes(itemCotacao.proposta.incoterms)) {
            propostaValida = false;
          }
          if (!itemCotacao.proposta.idCondicaoPagamento) {
            propostaValida = false;
          }
          if (!itemCotacao.proposta.precoUnidade || itemCotacao.proposta.precoUnidade <= 0) {
            propostaValida = false;
          }
          if (this.habilitarimpostoNcmCotacao) {
           switch (itemCotacao.produto.tipo) {
            case TipoProduto.Produto:
              propostaValida = this.valideImpostosProduto(itemCotacao, propostaValida);
              break;

            case TipoProduto.Servico:
              propostaValida = this.valideImpostosServico(itemCotacao, propostaValida);
              break;
          }
          propostaValida = this.valideImpostosPadrao(itemCotacao, propostaValida);
          }
        }
    });
    return propostaValida;
  }

  itensInvalidos() {
    let itemInvalido = new Array();
    let dadosGerais = [];
    const primeiroItem = this.rodada.itens[0];

      if (primeiroItem.proposta.prazoEntrega === null) {
              dadosGerais.push('Prazo Entrega');
            }
      if (!primeiroItem.proposta.incoterms) {
              dadosGerais.push('Incoterms');
            }
      if (primeiroItem.proposta.faturamentoMinimo === null) {
              dadosGerais.push('Faturamento Minimo');
            }
      if (!primeiroItem.proposta.idCondicaoPagamento) {
              dadosGerais.push('Condição de pagamento');
          }

    this.rodada.itens.forEach((itemCotacao) => {
          let propsInvalidas: string = '';
          if (itemCotacao.proposta.ativo) {
          if (!itemCotacao.proposta.marca || itemCotacao.proposta.marca.trim() == '') {
            if(propsInvalidas !== ''){propsInvalidas += ', '}
            propsInvalidas += 'Marca';
          }
          if (itemCotacao.proposta.quantidadeDisponivel == null) {
            if(propsInvalidas !== ''){propsInvalidas += ', '}
            propsInvalidas += 'Quantidade Disponivel';
          }else{
            let min = 1;
            if (itemCotacao.produto && itemCotacao.produto.unidadeMedida &&
              itemCotacao.produto.unidadeMedida.permiteQuantidadeFracionada
            ) {
              min = 0.0001;
            }
            if (itemCotacao.proposta.quantidadeDisponivel < min) {
              if(propsInvalidas !== ''){propsInvalidas += ', '}
              propsInvalidas += 'Quantidade Disponivel';
            }
          }
          if (itemCotacao.proposta.embalagemEmbarque === null || itemCotacao.proposta.embalagemEmbarque < 1) {
            if(propsInvalidas !== ''){propsInvalidas += ', '}
            propsInvalidas += 'Embalagem Embarque'
          }
          if (itemCotacao.proposta.idUnidadeMedidaEmbalagemEmbarque != undefined && !itemCotacao.proposta.idUnidadeMedidaEmbalagemEmbarque ) {
            if(propsInvalidas !== ''){propsInvalidas += ', '}
            propsInvalidas += 'Unidade de medida de embalagens de embarque';
          }
          if (itemCotacao.proposta.valorFrete === null &&
            ![TipoFrete.Cif, TipoFrete.Fob].includes(itemCotacao.proposta.incoterms)) {
            if(propsInvalidas !== ''){propsInvalidas += ', '}
              propsInvalidas += 'Valor Frete';
          }
          if (!itemCotacao.proposta.precoUnidade || itemCotacao.proposta.precoUnidade <= 0) {
            if(propsInvalidas !== ''){propsInvalidas += ', '}
            propsInvalidas += 'Preço Unidade';
          }
          if (this.habilitarimpostoNcmCotacao) {
            if (this.isNullOrWhitespace(itemCotacao.proposta.pisAliquota)) {
              if(propsInvalidas !== ''){propsInvalidas += ', '}
              propsInvalidas += 'Pis Aliquota';
            }
            if (this.isNullOrWhitespace(itemCotacao.proposta.confinsAliquota)) {
              if(propsInvalidas !== ''){propsInvalidas += ', '}
              propsInvalidas += 'Confins Aliquota';
            }
            if (!itemCotacao.proposta.ncm || itemCotacao.proposta.ncm.length != 8) {
              if(propsInvalidas !== ''){propsInvalidas += ', '}
              propsInvalidas += 'Ncm';
            }
            switch (itemCotacao.produto.tipo) {
              case TipoProduto.Produto:
                  if (this.isNullOrWhitespace(itemCotacao.proposta.ipiAliquota)) {
                    if(propsInvalidas !== ''){propsInvalidas += ', '}
                    propsInvalidas += 'Ipi Aliquota';
                  }
                  if (this.isNullOrWhitespace(itemCotacao.proposta.icmsAliquota)) {
                    if(propsInvalidas !== ''){propsInvalidas += ', '}
                    propsInvalidas += 'Icms Aliquota';
                  }
                  if (this.isNullOrWhitespace(itemCotacao.proposta.difalAliquota)) {
                    if(propsInvalidas !== ''){propsInvalidas += ', '}
                    propsInvalidas += 'Difal Aliquota';
                  }
                  if (this.isNullOrWhitespace(itemCotacao.proposta.stAliquota)) {
                    if(propsInvalidas !== ''){propsInvalidas += ', '}
                    propsInvalidas += 'St Aliquota';
                  }
              break;
              case TipoProduto.Servico:
                  if (this.isNullOrWhitespace(itemCotacao.proposta.csllAliquota)) {
                    if(propsInvalidas !== ''){propsInvalidas += ', '}
                    propsInvalidas += 'Csll Aliquota';
                  }
                  if (this.isNullOrWhitespace(itemCotacao.proposta.issAliquota)) {
                    if(propsInvalidas !== ''){propsInvalidas += ', '}
                    propsInvalidas += 'Iss Aliquota';
                  }
                  if (this.isNullOrWhitespace(itemCotacao.proposta.irAliquota)) {
                    if(propsInvalidas !== ''){propsInvalidas += ', '}
                    propsInvalidas += 'Ir Aliquota';
                  }
                  if (this.isNullOrWhitespace(itemCotacao.proposta.inssAliquota)) {
                    if(propsInvalidas !== ''){propsInvalidas += ', '}
                    propsInvalidas += 'Inss Aliquota';
                  }
              break;
            }
          }
          if(propsInvalidas !== ''){
            let item = {
              cotacaoItem: itemCotacao,
              mensagem: itemCotacao.produto.descricao + ': ' + propsInvalidas + '.'
            }
            itemInvalido.push(item);
          }
        }
    });
    if(dadosGerais && dadosGerais.length){
      let item = {
          cotacaoItem: null,
          mensagem: 'Dados Gerais: ' + dadosGerais.join(', ')
      }
      itemInvalido.push(item)
    }
    return itemInvalido;
  }

  solitarEnviarProposta() {
    this.solicitar(() => this.enviarPropostas(), 'enviar');
  }

  solicitarSalvarProposta(){
    const propostas = this.rodada.itens.map(p => p.proposta);

    if(this.propostasValidas())
      this.permiteSalvarPropostas(propostas)
    else
      this.confirmarSalvarItensSemProposta(propostas)
  }

  solitarReenviarPropostas() {
    this.solicitar(() => this.reenviarPropostas(), 'reenviar');
  }

  permitirEditarProposta() {
    this.readonly = !this.readonly;
    this.permitirEditarPropostaEvent.emit();
  }

  permiteEditarProposta(): boolean {
    return moment().isBetween(moment(this.rodada.dataInicio), moment(this.rodada.dataEncerramento));
  }

  permiteSalvarPropostas(propostas: Array<CotacaoRodadaProposta>){
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.cotacaoRodadaService.salvarTodasPropostas(propostas).pipe(
    takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.itensSalvos.emit(this.rodada.itens.map((item) => item.idCotacaoItem))
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          }
        },
        (error) => {
          //TODO: Alterar exibição para que seja exibido apenas um item
            this.errorService.treatError(error);
        },
      );
  }

  voltar() {
    if(this.readonly){
      this.itensSalvos.emit(this.rodada.itens.map((item) => item.idCotacaoItem))
    }
    this.router.navigate(['/acompanhamentos'], { queryParams: { aba: 'cotacoes' } });
  }

  isNullOrWhitespace(input) {
    return input == null || input.toString().trim() === '';
  }

  private valideImpostosPadrao(itemCotacao: CotacaoItem, propostaValida: boolean) {
    if (this.isNullOrWhitespace(itemCotacao.proposta.pisAliquota)) {
      propostaValida = false;
    }

    if (this.isNullOrWhitespace(itemCotacao.proposta.confinsAliquota)) {
      propostaValida = false;
    }

    if (!itemCotacao.proposta.ncm || itemCotacao.proposta.ncm.length != 8) {
        propostaValida = false;
    }

    return propostaValida;
  }

  private valideImpostosProduto(itemCotacao: CotacaoItem, propostaValida: boolean) {
    if (this.isNullOrWhitespace(itemCotacao.proposta.ipiAliquota)) {
      propostaValida = false;
    }
    if (this.isNullOrWhitespace(itemCotacao.proposta.icmsAliquota)) {
      propostaValida = false;
    }
    if (this.isNullOrWhitespace(itemCotacao.proposta.difalAliquota)) {
      propostaValida = false;
    }
    if (this.isNullOrWhitespace(itemCotacao.proposta.stAliquota)) {
      propostaValida = false;
    }
    return propostaValida;
  }

  private valideImpostosServico(itemCotacao: CotacaoItem, propostaValida: boolean) {
    if (this.isNullOrWhitespace(itemCotacao.proposta.csllAliquota)) {
      propostaValida = false;
    }
    if (this.isNullOrWhitespace(itemCotacao.proposta.issAliquota)) {
      propostaValida = false;
    }
    if (this.isNullOrWhitespace(itemCotacao.proposta.irAliquota)) {
      propostaValida = false;
    }
    if (this.isNullOrWhitespace(itemCotacao.proposta.inssAliquota)) {
      propostaValida = false;
    }
    return propostaValida;
  }

  private checkReadonly() {
    const propostasEnviadas =
      this.rodada.itens &&
      this.rodada.itens.every(
        (item) => item.proposta && item.proposta.enviada,
      );
    this.readonly =
      !moment().isBetween(moment(this.rodada.dataInicio), moment(this.rodada.dataEncerramento)) ||
      propostasEnviadas;
  }

  private checkReenviarProposta() {
    const itensComPropostas = this.rodada.itens.filter((item) => item.proposta);
    const emAnalise =
      moment().isAfter(moment(this.rodada.dataEncerramento)) && !this.rodada.finalizada;
    if (emAnalise && itensComPropostas.length) {
      const idCotacaoParticipante = itensComPropostas[0].proposta.idCotacaoParticipante;
      this.obterPermissaoReenviarProposta(this.rodada.idCotacaoRodada, idCotacaoParticipante);
    }
  }

  private obterPermissaoReenviarProposta(idCotacaoRodada: number, idCotacaoParticipante: number) {
    this.blockUI.stop();
    this.cotacaoRodadaService
      .obterPermissaoReenvioProposta(idCotacaoRodada, idCotacaoParticipante)
      .subscribe(
        (response) => {
          this.blockUI.stop();
          if (response) { this.reenviarProposta = response; } else { this.reenviarProposta = false; }
        },
        (error) => {
          this.blockUI.stop();
        },
      );
  }

   todasPropostasPreenchidas(): boolean  {
    if (this.rodada.itens.some((item) => !item.proposta)) {
      return false;
    }
    if(!this.propostasValidas()){
      return false
    }
    return true;
  }

  private possuiItensSemProposta(): boolean {
    const itensSemProposta = this.obterItensSemProposta();
    return itensSemProposta && itensSemProposta.length > 0;
  }

  private obterItensSemProposta(incluirPropostasAtivas: boolean = true) {
    return this.rodada.itens.filter(
      (p) =>
        !p.proposta ||
        (p.proposta.ativo === incluirPropostasAtivas && !this.preenchendoProposta(p.proposta)),
    );
  }

  private preenchendoProposta(proposta: CotacaoRodadaProposta): boolean {
    const camposObrigatorios =
      proposta.marca ||
      proposta.precoUnidade ||
      proposta.embalagemEmbarque ||
      (proposta.incoterms !== TipoFrete.Cif && proposta.valorFrete);

    if (camposObrigatorios && !this.habilitarimpostoNcmCotacao) {
      return true;
    }

    const impostosObrigatorios =
      proposta.ipiAliquota ||
      proposta.pisAliquota ||
      proposta.confinsAliquota ||
      proposta.icmsAliquota ||
      proposta.difalAliquota ||
      proposta.stAliquota ||
      proposta.csllAliquota ||
      proposta.issAliquota ||
      proposta.irAliquota ||
      proposta.inssAliquota ||
      proposta.ncm;

    if (camposObrigatorios || (this.habilitarimpostoNcmCotacao && impostosObrigatorios)) {
      return true;
    }

    return false;
  }

  private incluirPropostas(propostas: CotacaoRodadaPropostaDto[], callback) {
    if (!propostas || !propostas.length) {
      return;
    }

    this.cotacaoRodadaService.inserirPropostas(propostas)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.atualizarPropostas(response);
            if (callback) {
              callback();
            }
          }
        },
        (error) => {
          this.errorService.treatError(error);
        },
      );
  }

  private atualizarPropostas(propostasSalvas: CotacaoRodadaPropostaDto[]) {
    this.rodada.itens.forEach((item) => {
      const propostaSalva = propostasSalvas.find((p) => p.idCotacaoItem === item.idCotacaoItem);

      if (propostaSalva) {
        item.proposta = { ...item.proposta, ...propostaSalva };
      }
    });
  }

  private criarItensSemPropostas(): CotacaoRodadaPropostaDto[] {
    return this.rodada.itens
      .filter((item) => !item.proposta)
      .map((item) => {
        const proposta = new CotacaoRodadaPropostaDto();
        proposta.idCotacaoItem = item.idCotacaoItem;
        proposta.idCotacaoRodada = this.rodada.idCotacaoRodada;
        proposta.ativo = false;
        return proposta;
      });
  }

  private async confirmarEnvioItensSemProposta(callback, mensagem) {
    const itensSemPropostas = this.obterItensSemProposta();

    let html = '';
    itensSemPropostas.forEach((item) => {
      html += `<p class="font-weight mb-3">${item.produto.descricao}</p>`;
    });

    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.titulo = `Existem itens não cotados. Deseja ${mensagem} a proposta mesmo assim?`;
    modalRef.componentInstance.confirmacao = html;
    modalRef.componentInstance.html = true;
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Não';
    modalRef.result.then(async (result) => {
      if (result) {
        this.incluirPropostas(this.criarItensSemPropostas(), callback);
      }
    });
  }

  private async confirmarSalvarItensSemProposta(propostas: Array<CotacaoRodadaProposta>) {
    const itensSemPropostas = this.itensInvalidos();

    let html = '';
    itensSemPropostas.forEach((item) => {
      html += `<p class="font-weight mb-3">${item.mensagem}</p>`;
    });

    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.titulo = `Os itens abaixo possuem informações inválidas ou não preenchidas. Deseja inativar esses itens? `;
    modalRef.componentInstance.confirmacao = html;
    modalRef.componentInstance.html = true;
    modalRef.componentInstance.confirmarLabel = 'Inativar e salvar itens';
    modalRef.componentInstance.cancelarLabel = 'Não';
    modalRef.result.then(async (result) => {
      if (result) {
        this.permiteInativarSalvarItens(propostas);
      }
    });
  }

  permiteInativarSalvarItens(propostas: Array<CotacaoRodadaProposta>){
    let itensSemPropostas = this.itensInvalidos();

    itensSemPropostas = itensSemPropostas.filter((item) => item.cotacaoItem);

    itensSemPropostas.forEach((item) => {
      const itemProposta = propostas.find( (p) =>
         item.cotacaoItem.idCotacaoItem === p.idCotacaoItem
      )
      itemProposta.ativo = false ;
    })
    this.permiteSalvarPropostas(propostas)

    this.filhos.forEach((filho) =>
      filho.veriqueInatividade()
    )
  }



  private inverterStatusPropostasNaoPreenchidas() {
    const itensSemPropostas = this.obterItensSemProposta(false);
    itensSemPropostas.forEach((item) => (item.proposta.ativo = !item.proposta.ativo));
  }

  private solicitar(callback, mensagem) {
    if (this.possuiItensSemProposta()) {
      this.confirmarEnvioItensSemProposta(callback, mensagem);
    } else {
      callback();
    }
  }

  private enviarPropostas() {
    if (this.todasPropostasPreenchidas() && this.propostasValidas()) {
      const propostas = this.mapearParaDto();
      this.blockUI.start();
      this.cotacaoRodadaService.enviarPropostas(this.rodada.idCotacaoRodada, propostas)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.itensSalvos.emit(this.rodada.itens.map((item) => item.idCotacaoItem));
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.voltar();
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          },
        );
    } else {
      this.inverterStatusPropostasNaoPreenchidas();
    }
  }

  private reenviarPropostas() {
    if (this.todasPropostasPreenchidas() && this.propostasValidas()) {
      const propostas = this.mapearParaDto();

      this.blockUI.start();
      this.cotacaoRodadaService.reenviarPropostas(this.rodada.idCotacaoRodada, propostas)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.voltar();
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          },
        );
    } else {
      this.inverterStatusPropostasNaoPreenchidas();
    }
  }

  private mapearParaDto() {
    return this.rodada.itens.map(
      (item) => new CotacaoRodadaPropostaDto({
        idCotacaoRodadaProposta: item.proposta.idCotacaoRodadaProposta,
        idCotacaoRodada: item.proposta.idCotacaoRodada,
        idCotacaoParticipante: item.proposta.idCotacaoParticipante,
        idCotacaoItem: item.proposta.idCotacaoItem,
        ativo: item.proposta.ativo,
        ncm: item.proposta.ncm,
        ca: item.proposta.ca,
        quantidadeDisponivel: item.proposta.quantidadeDisponivel,
        modelo: item.proposta.modelo,
        precoBruto: item.proposta.precoBruto,
        precoLiquido: item.proposta.precoLiquido,
        precoUnidade: item.proposta.precoUnidade,
        valorFrete: item.proposta.valorFrete,
        dataEntregaDisponivel: item.proposta.dataEntregaDisponivel,
        ipiAliquota: item.proposta.ipiAliquota,
        pisAliquota: item.proposta.pisAliquota,
        confinsAliquota: item.proposta.confinsAliquota,
        icmsAliquota: item.proposta.icmsAliquota,
        difalAliquota: item.proposta.difalAliquota,
        stAliquota: item.proposta.stAliquota,
        csllAliquota: item.proposta.csllAliquota,
        issAliquota: item.proposta.issAliquota,
        irAliquota: item.proposta.irAliquota,
        inssAliquota: item.proposta.inssAliquota,
        garantia: item.proposta.garantia,
        unidadeMedidaGarantia: item.proposta.unidadeMedidaGarantia,
        marca: item.proposta.marca,
        observacao: item.proposta.observacao,
        anexos: item.proposta.anexos,
        idUsuarioLiberacaoReenvio: item.proposta.idUsuarioLiberacaoReenvio,
        dataHoraLiberacaoReenvio: item.proposta.dataHoraLiberacaoReenvio,
        idCotacaoRodadaPropostaPai: item.proposta.idCotacaoRodadaPropostaPai,
        embalagemEmbarque: item.proposta.embalagemEmbarque,
        idUnidadeMedidaEmbalagemEmbarque: item.proposta.idUnidadeMedidaEmbalagemEmbarque,
        unidadeMedidaEmbalagemEmbarque: item.proposta.unidadeMedidaEmbalagemEmbarque,
        idCondicaoPagamento: item.proposta.idCondicaoPagamento,
        incoterms: item.proposta.incoterms,
        faturamentoMinimo: item.proposta.faturamentoMinimo,
        prazoEntrega: item.proposta.prazoEntrega,
      }),
    );
  }
}
