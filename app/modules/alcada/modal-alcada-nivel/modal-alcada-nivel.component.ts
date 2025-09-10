import { CurrencyPipe, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionLike } from 'rxjs';
import { createNumberMask } from 'text-mask-addons';
import { ColumnTypeEnum } from '../../../shared/components/data-list/models/column-type.enum';
import { SelectionModeEnum } from '../../../shared/components/data-list/models/selection-mode.enum';
import { SizeEnum } from '../../../shared/components/data-list/models/size.enum';
import { TableColumn } from '../../../shared/components/data-list/table/models/table-column';
import { TableConfig } from '../../../shared/components/data-list/table/models/table-config';
import { AlcadaNivel } from '../../../shared/models/alcada-nivel';
import { AlcadaNivelUsuario } from '../../../shared/models/alcada-nivel-usuario';
import { TranslationLibraryService } from '../../../shared/providers/translation-library.service';
import { UtilitiesService } from '../../../shared/utils/utilities.service';
import { ModalAlcadaUsuarioComponent } from '../modal-alcada-usuario/modal-alcada-usuario.component';

@Component({
  selector: 'app-modal-alcada-nivel',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  templateUrl: './modal-alcada-nivel.component.html',
  styleUrls: ['./modal-alcada-nivel.component.scss'],
})
export class ModalAlcadaNivelComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  alcadaNivel: AlcadaNivel;
  usuariosSelecionados: Array<AlcadaNivelUsuario> = [];
  form: FormGroup;
  exibirNiveisParticipantes: boolean;
  locationSubscription: SubscriptionLike;

  tabelaConfig: TableConfig<AlcadaNivelUsuario> = new TableConfig<AlcadaNivelUsuario>({
    size: SizeEnum.Small,
    columns: [
      new TableColumn({ title: 'Participantes', name: 'nome', type: ColumnTypeEnum.Text }),
      new TableColumn({ title: 'Ordem', name: 'ordem', type: ColumnTypeEnum.Text })],
    useLocalPagination: true,
    selectionMode: SelectionModeEnum.Multiple,
  });

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
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private currencyPipe: CurrencyPipe,
    private modalService: NgbModal,
    private utilitiesService: UtilitiesService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.construirFormulario();

    if (this.alcadaNivel) {
      this.preencherFormulario(this.alcadaNivel);
    }

    this.locationSubscription = this.location.subscribe(() => this.activeModal.dismiss());
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }

  salvar() {
    if (this.formularioValido()) {
      this.removerMascaras(this.form.controls.valor.value);
      this.activeModal.close(this.form.value);
    }
  }

  incluir() {
    const ordemMaxima = this.form.controls.alcadaNivelUsuarios.value.length;
    const modalRef = this.modalService.open(ModalAlcadaUsuarioComponent, { centered: true });

    modalRef.componentInstance.ordemMaxima = ordemMaxima > 0 ? ordemMaxima + 1 : 1;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.setaUsuario(result);
        }
      },

      (reason) => { },
    );
  }

  editar() {
    const usuario = this.form.controls.alcadaNivelUsuarios.value.filter((u) => u.idUsuario === this.usuariosSelecionados[0].idUsuario)[0];
    const modalRef = this.modalService.open(ModalAlcadaUsuarioComponent, { centered: true });

    modalRef.componentInstance.alcadaNivelUsuario = usuario;
    modalRef.componentInstance.ordemMaxima = this.form.controls.alcadaNivelUsuarios.value.length;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.setaUsuario(result);
          this.resetUsuariosSelecionados();
        }
      },
      (reason) => { },
    );
  }

  cancelar() {
    this.activeModal.close();
  }

  remover() {
    const ids = this.usuariosSelecionados.map((us) => us.idUsuario);
    const newAlcadaNivelUsuarios = (): Array<AlcadaNivelUsuario> => {
      const aux = [];
      this.form.controls.alcadaNivelUsuarios.value.forEach((anu) => {
        if (ids.indexOf(anu.idUsuario) === -1) {
          aux.push(anu);
        }
      });

      return aux;
    };

    const usuariosOrdenados = newAlcadaNivelUsuarios().map((u, index) => {
      u.ordem = index + 1;
      return u;
    });

    this.form.controls.alcadaNivelUsuarios.patchValue(usuariosOrdenados);
    this.resetUsuariosSelecionados();
  }

  permitirExibirNiveisParticipantes() {
    if (!this.exibirNiveisParticipantes) {
      this.exibirNiveisParticipantes = true;
    }
  }

  selectUser(usuarios: any) {
    this.usuariosSelecionados = usuarios.map((u) => new AlcadaNivelUsuario({ idAlcadaNivel: u.idAlcadaNivel, idUsuario: u.idUsuario, nome: u.nome, ordem: u.ordem }));
  }

  private setaUsuario(usuario: AlcadaNivelUsuario) {
    const index = this.form.controls.alcadaNivelUsuarios.value.findIndex((u) => u.idUsuario === usuario.idUsuario);
    if (index !== -1) {
      this.form.controls.alcadaNivelUsuarios.value.splice(index, 1);
    }

    this.form.controls.alcadaNivelUsuarios.value.splice(usuario.ordem - 1, 0, usuario);
    return this.form.controls.alcadaNivelUsuarios.patchValue(this.ajustarOrdem());
  }

  private ajustarOrdem() {
    return this.form.controls.alcadaNivelUsuarios.value.map((u, i) => {
      u.ordem = i + 1;
      return u;
    });
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idAlcada: [null],
      idAlcadaNivel: [null],
      descricao: ['', Validators.required],
      valor: [null, Validators.required],
      alcadaNivelUsuarios: [[]],
    });
  }

  private preencherFormulario(nivel: AlcadaNivel) {
    this.form.patchValue(nivel);
    this.form.patchValue({ valor: this.obtenhaValorFormatado(nivel.valor) });
  }

  private removerMascaras(valor: string) {
    // Utiliza expressão regular para remover todos os pontos da string
    this.form.controls.valor.setValue(this.utilitiesService.getNumberWithoutFormat(valor));
  }

  private obtenhaValorFormatado(valor: number) {
    return this.currencyPipe.transform(valor, undefined, '', '1.2-4', 'pt-BR').trim();
  }

  private resetUsuariosSelecionados() {
    this.usuariosSelecionados = [];
  }
  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if (this.form.controls.alcadaNivelUsuarios.value.length === 0) {
      this.toastr.warning('Ao menos um participante deve ser informado.');
      return false;
    }

    return true;
  }
}
