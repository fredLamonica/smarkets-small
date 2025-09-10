import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PedidoEntregaProgramadaPrevistaDto } from '../../../shared/models/pedido/pedido-entrega-programada-prevista-dto';
import { PedidoItemDataEntregaPrevistaDto } from '../../../shared/models/pedido/pedido-item-data-entrega-prevista-dto';
import { ManterDataPrevistaProgramadaComponent } from '../manter-data-prevista-programada/manter-data-prevista-programada.component';

@Component({
  selector: 'smk-manter-data-entrega-prevista',
  templateUrl: './manter-data-entrega-prevista.html',
  styleUrls: ['./manter-data-entrega-prevista.scss'],
})
export class ManterDataEntregaPrevistaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  dtosEntregas: PedidoItemDataEntregaPrevistaDto[] = [];
  validacaoAtiva: boolean = false;
  dataEntregaPrevista: Date;
  form: FormGroup;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.construirFormulario();

    if (this.dataEntregaPrevista) {
      this.preencherFormulario(this.dataEntregaPrevista);
    }
  }

  salvar() {
    if (this.estaValido()) {
      this.activeModal.close(this.dtosEntregas);
    }
  }

  cancelar() {
    this.activeModal.close();
  }

  aplicarTodosItens() {
    if (this.form.value.dataEntregaPrevista) {
      this.dtosEntregas.forEach(
        (entrega) => {
          entrega.dataEntregaPrevista = this.form.value.dataEntregaPrevista;
        },
      );
    }
  }

  exibirEntregasProgramadas(entregasProgramadas: PedidoEntregaProgramadaPrevistaDto[]) {
    const modalRef = this.modalService.open(ManterDataPrevistaProgramadaComponent, { centered: true, backdrop: 'static', size: 'lg' });

    modalRef.componentInstance.dtosEntregas = entregasProgramadas;
  }

  private construirFormulario() {
    this.form = this.fb.group({
      dataEntregaPrevista: [null],
    });
  }

  private preencherFormulario(dataEntregaPrevista: Date) {
    this.form.patchValue({ 'dataEntregaPrevista': dataEntregaPrevista });
  }

  private estaValido(): boolean {
    if (this.validacaoAtiva && this.dtosEntregas.some(
      (item) => this.itemSemDataEntregaPrevista(item)
        || this.entregasProgramadasSemDataEntregaPrevista(item),
    )) {
      this.toastr.warning('Favor preencher a data entrega real de todos os itens aprovados.');
      return false;
    }

    return true;
  }

  private entregasProgramadasSemDataEntregaPrevista(entrega: PedidoItemDataEntregaPrevistaDto): boolean {
    return (entrega.entregasProgramadas && entrega.entregasProgramadas.length && entrega.entregasProgramadas.some((ep) => !ep.dataEntregaPrevista));
  }

  private itemSemDataEntregaPrevista(entrega: PedidoItemDataEntregaPrevistaDto): boolean {
    return (!entrega.entregasProgramadas || !entrega.entregasProgramadas.length) && !entrega.dataEntregaPrevista;
  }
}
