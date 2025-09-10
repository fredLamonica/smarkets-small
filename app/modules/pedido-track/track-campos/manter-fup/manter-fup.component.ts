import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { SituacaoAceitePedidoTrack } from '../../../../shared/models/enums/Track/situacao-aceite-pedido-track';
import { SituacaoNotificacaoTrack } from '../../../../shared/models/enums/Track/situacao-notificacao-track';
import { SituacaoPedidoTrack } from '../../../../shared/models/enums/Track/situacao-pedido-track';
import { PedidoTrackDto } from '../../../../shared/models/pedido-track/pedido-track-dto';
import { EnumToArrayPipe } from '../../../../shared/pipes';
import { TranslationLibraryService } from '../../../../shared/providers';
import { PedidoTrackService } from '../../../../shared/providers/track/pedido-track.service';
import { ErrorService } from '../../../../shared/utils/error.service';

@Component({
  selector: 'smk-manter-fup',
  templateUrl: './manter-fup.component.html',
  styleUrls: ['./manter-fup.component.scss']
})
export class ManterFupComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  id: number;
  paradaManutencao: PedidoTrackDto;
  mascaraSomenteNumeros = RegExp('\[0-9\]');

  situacaoPedidoEnum = SituacaoPedidoTrack;
  situacaoAceitePedidoEnum = SituacaoAceitePedidoTrack;
  situacaoNotificacaoEnum = SituacaoNotificacaoTrack;
  idTenant: number;
  form: FormGroup;
  opcoesSituacao: Array<{ index: number, name: string }>;
  opcoesAceite: Array<{ index: number, name: string }>;
  opcoesNotificacao: Array<{ index: number, name: string }>;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private errorService: ErrorService,
    private pedidoTrackService: PedidoTrackService,
    public activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.opcoesSituacao = new EnumToArrayPipe().transform(SituacaoPedidoTrack) as Array<any>;
    this.opcoesAceite = new EnumToArrayPipe().transform(SituacaoAceitePedidoTrack) as Array<any>;
    this.opcoesNotificacao = new EnumToArrayPipe().transform(SituacaoNotificacaoTrack) as Array<any>;

    this.construaForm();
    this.obtenhaPorId();
  }

  private construaForm(): void {
    this.form = this.fb.group({
      id: [null],
      numeroPedido: [null],
      linha: [],
      descricaoPedido: [],
      dataPedido: [],
      dataRecebimento: [null],
      dataColetaImportacao: [null],
      fornecedor: [null],
      responsavel: [],
      situacaoPedido: [],
      aceitePedido: [],
      dataRemessa: [],
      dataRemessa2: [],
      motivo: [],
      notaFiscal: [],
      notificacao: [],
      observacao:[],
    });

    this.form.controls['numeroPedido'].disable();
    this.form.controls['linha'].disable();
    this.form.controls['descricaoPedido'].disable();
    this.form.controls['dataPedido'].disable();
    this.form.controls['dataRecebimento'].disable();
    this.form.controls['dataColetaImportacao'].disable();
    this.form.controls['fornecedor'].disable();
    this.form.controls['responsavel'].disable();
    this.form.controls['aceitePedido'].disable();
    this.form.controls['dataRemessa'];
    this.form.controls['dataRemessa2'];
    this.form.controls['motivo'];
    this.form.controls['notaFiscal'].disable();
    this.form.controls['notificacao'].disable();
    this.form.controls['observacao'];
  }

  private obtenhaPorId(): void {
    this.pedidoTrackService.obtenhaPorId(this.id).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (pedidoTrack: PedidoTrackDto) => {
          this.paradaManutencao = pedidoTrack;
          this.form.patchValue(
            {
              ...pedidoTrack,
              dataPedido: this.formateData(pedidoTrack.dataPedido),
            }
          );
          this.form.get('dataRemessa').setValue(this.formateData(pedidoTrack.dataRemessa));
          this.form.get('dataRemessa2').setValue(this.formateData(pedidoTrack.dataRemessa2));
          this.form.get('dataColetaImportacao').setValue(this.formateData(pedidoTrack.dataColetaImportacao));
          this.form.get('dataRecebimento').setValue(this.formateData(pedidoTrack.dataRecebimento));
        },
        (error: any) => {
          this.errorService.treatError(error);
        });
  }

  private formateData(data: any): string {
    if (!data) return '';
    const dataFormatada = new Date(data);

    return !isNaN(dataFormatada.getTime()) ? dataFormatada.toISOString().split('T')[0] : '';
  }



  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  salvar() {
    this.pedidoTrackService.altere(this.form.value).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response)
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.activeModal.close(true);
        },
        (error: any) => {
          this.errorService.treatError(error);
        });
  }

  cancelar() {
    this.activeModal.close();
  }


}
