import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ColumnTypeEnum } from '../../../shared/components/data-list/models/column-type.enum';
import { SelectionModeEnum } from '../../../shared/components/data-list/models/selection-mode.enum';
import { SizeEnum } from '../../../shared/components/data-list/models/size.enum';
import { TableColumn } from '../../../shared/components/data-list/table/models/table-column';
import { TableConfig } from '../../../shared/components/data-list/table/models/table-config';
import { ConfiguracaoColunaDto } from '../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoColunaUsuarioDto } from '../../../shared/models/configuracao-coluna-usuario-dto';
import { PedidoEntregaProgramadaPrevistaDto } from '../../../shared/models/pedido/pedido-entrega-programada-prevista-dto';

@Component({
  selector: 'smk-manter-data-prevista-programada',
  templateUrl: './manter-data-prevista-programada.component.html',
  styleUrls: ['./manter-data-prevista-programada.component.scss'],
})
export class ManterDataPrevistaProgramadaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  dtosEntregas: PedidoEntregaProgramadaPrevistaDto[] = [];
  dataEntregaPrevista: Date;
  form: FormGroup;
  tableConfig: TableConfig<PedidoEntregaProgramadaPrevistaDto>;
  colunasConfig: ConfiguracaoColunaUsuarioDto;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.construirFormulario();
    this.configureTable();
  }

  salvar() {
    this.activeModal.close(this.dtosEntregas);
  }

  fechar() {
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

  private construirFormulario() {
    this.form = this.fb.group({
      dataEntregaPrevista: [null],
    });
  }

  private configureTable(): void {
    this.tableConfig = new TableConfig<PedidoEntregaProgramadaPrevistaDto>({
      size: SizeEnum.Small,
      useLocalPagination: true,
      selectionMode: SelectionModeEnum.None,
      columns: [
        new TableColumn({ title: 'Descrição', name: 'descricao', type: ColumnTypeEnum.Text }),
        new TableColumn({ title: 'Data de Entrega Prevista', name: 'dataEntregaPrevista', type: ColumnTypeEnum.CustomTemplate })],
    });
    this.colunasConfig = new ConfiguracaoColunaUsuarioDto({ colunas: Array<ConfiguracaoColunaDto>() });
  }
}
