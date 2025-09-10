import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { SituacaoPedidoTrack } from '../../../../shared/models/enums/Track/situacao-pedido-track';
import { AltereCamposParadaManutencaoDto } from '../../../../shared/models/fltros/track/altere-campos-parada-manutencao-dto';
import { PedidoTrackDto } from '../../../../shared/models/pedido-track/pedido-track-dto';
import { EnumToArrayPipe } from '../../../../shared/pipes';
import { TranslationLibraryService } from '../../../../shared/providers';
import { PedidoTrackService } from '../../../../shared/providers/track/pedido-track.service';
import { ErrorService } from '../../../../shared/utils/error.service';

@Component({
  selector: 'smk-manter-fup-campos',
  templateUrl: './manter-fup-campos.component.html',
  styleUrls: ['./manter-fup-campos.component.scss']
})
export class ManterFupCamposComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  opcoesSituacao: Array<{ index: number, name: string }>;
  idTenant: number;
  paradaManutencaoSelecionados: PedidoTrackDto[];
  form: FormGroup;
  altereCamposParadaManutencaoDto: AltereCamposParadaManutencaoDto;

  ngOnInit(): void {
    this.opcoesSituacao = new EnumToArrayPipe().transform(SituacaoPedidoTrack) as Array<any>;
    this.construaForm();
  }

  constructor(
    private toastr: ToastrService,
    private errorService: ErrorService,
    private pedidoTrackService: PedidoTrackService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService
  ) {
   super();
  }

  private construaForm(): void {
    this.form = this.fb.group({
      situacaoPedido: [],
      dataRemessa: [],
      dataRemessa2: [],
      motivo: [],
      observacao:[],
    });
  }

  salvarCampos() {
    this.altereCamposParadaManutencaoDto =  {
      idsPedido: this.paradaManutencaoSelecionados.map(e => e.id),
      idTenant: this.idTenant,
      situacaoPedido: this.form.value.situacaoPedido,
      dataRemessa: this.form.value.dataRemessa,
      dataRemessa2: this.form.value.dataRemessa2,
      motivo: this.form.value.motivo,
      observacao: this.form.value.observacao,
    }

    this.pedidoTrackService.avanceCampos(this.altereCamposParadaManutencaoDto)
     .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.activeModal.close(true);
          }
        },
        (error) => {
          this.errorService.treatError(error);
          this.activeModal.close();
        }
    )
  }

  cancelar() {
    this.activeModal.close();
  }
}
