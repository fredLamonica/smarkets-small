import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaProduto, ClassificacaoPreco, Cotacao, CotacaoItem, Moeda, Situacao, TipoFrete, TipoRequisicao, UnidadeMedidaTempo } from '@shared/models';
import { CotacaoRodadaService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { CotacaoParticipante } from './../../../shared/models/cotacao/cotacao-participante';
import { IncluirFornecedorComponent } from './../manter-cotacao-participantes/incluir-fornecedor/incluir-fornecedor.component';

@Component({
  selector: 'app-manter-cotacao-rodada',
  templateUrl: './manter-cotacao-rodada.component.html',
  styleUrls: ['./manter-cotacao-rodada.component.scss'],
})
export class ManterCotacaoRodadaComponent extends Unsubscriber implements OnInit {

  get currentDate(): string {
    return moment().format('YYYY-MM-DDTHH:mm');
  }

  get dataInicial(): string {
    return moment().add(10, 'minute').format('YYYY-MM-DDTHH:mm');
  }

  get dataFinal(): string {
    return moment().add(1, 'day').endOf('day').format('YYYY-MM-DDTHH:mm');
  }

  @BlockUI() blockUI: NgBlockUI;

  Moeda = Moeda;
  TipoFrete = TipoFrete;
  UnidadeMedidaTempo = UnidadeMedidaTempo;
  ClassificacaoPreco = ClassificacaoPreco;
  TipoRequisicao = TipoRequisicao;

  cotacao: Cotacao;
  itens: Array<CotacaoItem>;

  participantesProximaRodada: Array<CotacaoParticipante> = new Array<CotacaoParticipante>();
  novosParticipantesProximaRodada: Array<CotacaoParticipante> = new Array<CotacaoParticipante>();
  categoriasProduto: Array<CategoriaProduto> = new Array<CategoriaProduto>();

  form: FormGroup;

  maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 12,
  });

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoRodadaService: CotacaoRodadaService,
    private activeModalService: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormulario();
  }

  cancelar() {
    this.activeModalService.close();
  }

  confirmar() {
    if (this.form.valid) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      const rodada = this.form.value;
      if (rodada.itens) {
        rodada.itens.forEach((item) => {
          item.targetPrice = this.removerMascara(item.targetPrice);
        });
      }

      this.cotacaoRodadaService.criarRodada(rodada).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.activeModalService.close(response);
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  removerMascara(targetPrice: string): number {
    let value: number;
    if (targetPrice) {
      value = +(targetPrice.replace(/\./g, '').replace(',', '.'));
    }

    return value;
  }

  obterParticipantes() {
    this.cotacaoRodadaService.GetParticipantesProximaRodada(this.cotacao.idCotacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.participantesProximaRodada = response;
            Object.assign(this.novosParticipantesProximaRodada, this.participantesProximaRodada); // clona lista
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  incluirFornecedor() {
    const modalRef = this.modalService.open(IncluirFornecedorComponent, { centered: true, size: 'lg' });

    this.cotacao.itens.forEach((item) => {
      this.categoriasProduto.push(item.produto.categoria);
    });

    this.categoriasProduto = this.categoriasProduto.filter((item, index) => this.categoriasProduto.indexOf(item) === index); // remove itens repetidos
    modalRef.componentInstance.categoriasProduto = this.categoriasProduto;

    modalRef.result.then((result) => {
      if (result) {
        const cotacaoParticipante: CotacaoParticipante = new CotacaoParticipante(0, this.cotacao.idCotacao, moment().format(), result.idPessoaJuridica, result, Situacao.Ativo, false, result.categoriasProduto);
        this.AdicionaParticipanteProximaRodada(cotacaoParticipante);
      }
    });
  }

  onExcluirClick(idPessoaJuridica: number) {
    this.novosParticipantesProximaRodada.forEach((item, index) => {
      if (item.idPessoaJuridica === idPessoaJuridica) { this.novosParticipantesProximaRodada.splice(index, 1); }
    });
  }

  participanteAdicionado(idCotacaoParticipante: number): boolean {
    if (this.participantesProximaRodada.filter((item) => item.idCotacaoParticipante === idCotacaoParticipante).length > 0) {
      return false;
    }

    return true;
  }

  obtenhaDataDeEntrega(cotacaoItem: CotacaoItem): string {
    if (cotacaoItem) {
      if (cotacaoItem.requisicaoItem && cotacaoItem.requisicaoItem.entregaProgramada) {
        if (cotacaoItem.requisicaoItem.entregaProgramadaUltimaDataDto) {
          return cotacaoItem.requisicaoItem.entregaProgramadaUltimaDataDto.ultimaDataEntregaDias;
        }
      } else {
        if (cotacaoItem.dataEntrega) {
          return moment(cotacaoItem.dataEntrega).format('DD/MM/YYYY');
        }
      }
    }

    return '--';
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      idCotacaoRodada: [0],
      idCotacao: [this.cotacao.idCotacao],
      dataInicio: [this.dataInicial, Validators.required],
      dataEncerramento: [this.dataFinal, Validators.required],
      ordem: [this.cotacao.rodadaAtual.ordem + 1],
      finalizada: [false],
      itens: [this.itens],
    });
  }

  private AdicionaParticipanteProximaRodada(participante: CotacaoParticipante) {

    let participanteJaExiste = false;
    this.novosParticipantesProximaRodada.forEach((item) => {
      if (item.idPessoaJuridica === participante.idPessoaJuridica) {
        return participanteJaExiste = true;
      }
    });

    if (!participanteJaExiste) {
      this.novosParticipantesProximaRodada.push(participante);
    }

  }

}
