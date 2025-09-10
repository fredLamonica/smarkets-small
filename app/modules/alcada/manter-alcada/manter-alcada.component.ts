import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ModalConfirmacaoExclusao } from '../../../shared/components';
import { DualListColumn } from '../../../shared/components/data-list/dual-list/models/dual-list-column';
import { DualListConfig } from '../../../shared/components/data-list/dual-list/models/dual-list-config';
import { ColumnTypeEnum } from '../../../shared/components/data-list/models/column-type.enum';
import { CategoriaProduto } from '../../../shared/models';
import { Alcada } from '../../../shared/models/alcada';
import { AlcadaCategoria } from '../../../shared/models/alcada-categoria';
import { AlcadaNivel } from '../../../shared/models/alcada-nivel';
import { TipoAlcada } from '../../../shared/models/enums/tipo-alcada';
import { CategoriaProdutoService } from '../../../shared/providers';
import { AlcadaService } from '../../../shared/providers/alcada.service';
import { ErrorService } from '../../../shared/utils/error.service';
import { ModalAlcadaNivelComponent } from '../modal-alcada-nivel/modal-alcada-nivel.component';
import { IMenuItem } from './../../../shared/components/sdk-menu-item/menu-item';
import { Situacao } from './../../../shared/models/enums/situacao';
import { TranslationLibraryService } from './../../../shared/providers/translation-library.service';

@Component({
  selector: 'app-manter-alcada',
  templateUrl: './manter-alcada.component.html',
  styleUrls: ['./manter-alcada.component.scss'],
})
export class ManterAlcadaComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  alcada: Alcada;
  abaAtual: string;
  form: FormGroup;
  idAlcada: number;
  isCreate = false;
  itens: Array<IMenuItem>;
  rotaVoltar: string;
  tipoAlcada = TipoAlcada;

  opcoesTipoAlcada = Object.values(this.tipoAlcada).filter(
    (e) => typeof e === 'number',
  );
  tipoAlcadaDisplay = new Map<number, string>([
    [1, 'Usuário'],
    [2, 'Hierarquia'],
  ]);

  labelDadosGerais = 'Dados Gerais';
  labelCategorias = 'Categorias';
  labelNiveis = 'Níveis';

  dualListConfig: DualListConfig<CategoriaProduto> = new DualListConfig({
    name: 'Categorias',
    sourceTitle: 'Categorias não Selecionadas',
    destinationTitle: 'Categorias Selecionadas',
    searchCompareTo: (item: any, search: string) => item.nome.toLowerCase().includes(search.toLowerCase()),
    compareTo: (a: CategoriaProduto, b: CategoriaProduto) => a.idCategoriaProduto === b.idCategoriaProduto,
    columns: [
      new DualListColumn({ name: 'nome', type: ColumnTypeEnum.Text }),
    ],
  });
  categorias: Array<CategoriaProduto> = new Array<CategoriaProduto>();

  // listagem de níveis
  iconSpotColor = '#52BDE9';
  iconSpotColorHover = '#27ADE4';
  borderColor = '#B8CAD1';
  borderWidth = '1px';
  borderStyle = 'solid';
  borderColorHover = '#3DB5E7';
  rectangleButtonColor = '#C4C4C4';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translationLibrary: TranslationLibraryService,
    private alcadaService: AlcadaService,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private categoriaProdutoService: CategoriaProdutoService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormulario();
    this.obterParametros();
    this.loadMenu();
    this.obterCategorias();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  voltar() {
    this.router.navigate([this.rotaVoltar]);
  }

  salvar() {
    if (this.form.valid && true) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      if (this.isCreate) {
        this.inserir();
      } else {
        this.alterar();
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  getStatusMessage(statusAlcada: Situacao): string {
    switch (statusAlcada) {
      case Situacao.Ativo:
        return 'Ativo';
      case Situacao.Inativo:
        return 'Inativo';
      default:
        return 'Em Configuração';
    }
  }

  getStatusColor(statusAlcada: Situacao): string {
    switch (statusAlcada) {
      case Situacao.Ativo:
        return '#8BC34A';
      case Situacao.Inativo:
        return '#9E9E9E';
      default:
        return '#FF9800';
    }
  }

  getMenuIcon(): string {
    return 'fas fa-gavel';
  }

  getMenuIconColor(tipoAlcada: TipoAlcada): string {
    switch (tipoAlcada) {
      case TipoAlcada.usuario:
        return '#27ADE4';
      case TipoAlcada.nivel:
        return '#FF9800';
      default:
        return '#B8CAD1';
    }
  }

  setAbaAtual(menuItem: IMenuItem) {
    this.abaAtual = menuItem.label;
  }

  changeNiveis(niveis: Array<AlcadaNivel>) {
    this.form.patchValue({ alcadaNiveis: niveis });
  }

  categoriasSelecionadasChange(categorias: Array<CategoriaProduto>) {
    this.form.patchValue({ alcadaCategorias: categorias.map((categoria) => new AlcadaCategoria({ idCategoriaProduto: categoria.idCategoriaProduto })) });
  }

  // região de listar níveis
  adicionarNivel() {
    this.modalService
      .open(ModalAlcadaNivelComponent, { centered: true, size: 'lg' })
      .result.then(
        (alcadaNivel) => {
          if (alcadaNivel) {
            this.persistaArrayDeNivelAlcada([...this.form.get('alcadaNiveis').value, alcadaNivel]);
          }
        },
        (reason) => { },
      );
  }

  editarNivel(item: AlcadaNivel) {
    const modalRef = this.modalService.open(ModalAlcadaNivelComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.alcadaNivel = item;

    modalRef.result.then(
      (result) => {
        if (result) {
          const index = this.form.get('alcadaNiveis').value.findIndex((nivel) => JSON.stringify(nivel) === JSON.stringify(item));
          const arrayDeAlcadaNivel = this.form.get('alcadaNiveis').value;

          arrayDeAlcadaNivel[index] = result;

          this.persistaArrayDeNivelAlcada(arrayDeAlcadaNivel);
        }

      },
      (reason) => { },
    );
  }

  solicitarExclusao(alcadaNivel: AlcadaNivel) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => {
          if (result) {
            this.excluir(alcadaNivel);
          }
        },
        (reason) => { },
      );
  }

  private loadMenu() {
    this.itens = [
      <IMenuItem>{
        label: this.labelDadosGerais,
        locked: false,
      },
      <IMenuItem>{
        label: this.labelCategorias,
        locked: false,
      },
      <IMenuItem>{
        label: this.labelNiveis,
        locked: false,
      },
    ];
  }

  private obterParametros() {
    this.blockUI.start();
    this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        if (params['idAlcada']) {
          this.idAlcada = +params['idAlcada'];
          this.obterAlcadaPorId();
        } else {
          this.isCreate = true;
          this.blockUI.stop();
        }
      });
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idAlcada: [null],
      idTenant: [0],
      descricao: [null, Validators.required],
      codigo: [null],
      tipo: [null, Validators.required],
      alcadaCategorias: [[]],
      alcadaNiveis: [[], Validators.required],
    });

    this.form.get('idAlcada').disable();

    this.form.get('tipo').valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((tipo: TipoAlcada) => {
        if (this.alcada) {
          this.alcada.tipo = tipo;
        } else {
          this.alcada = { tipo } as Alcada;
        }
      });
  }

  private obterAlcadaPorId() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.alcadaService.obterPorId(this.idAlcada).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.alcada = response;
            this.preencherFormulario();
          }
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private preencherFormulario() {
    this.form.patchValue(this.alcada);
  }

  private inserir() {
    this.alcadaService.inserir(this.form.value).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['alcada']);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private alterar() {
    this.alcadaService.editar(this.idAlcada, this.form.getRawValue()).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['alcada']);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private obterCategorias() {
    this.categoriaProdutoService.listarAtivas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.categorias = res;
      });
  }

  private excluir(alcadaNivel: AlcadaNivel) {
    const index = this.form.get('alcadaNiveis').value.findIndex((nivel) => JSON.stringify(nivel) === JSON.stringify(alcadaNivel));
    const arrayDeAlcadaNivel = this.form.get('alcadaNiveis').value;

    arrayDeAlcadaNivel.splice(index, 1);

    this.persistaArrayDeNivelAlcada(arrayDeAlcadaNivel);
  }

  private persistaArrayDeNivelAlcada(arrayDeAlcadaNivel: Array<AlcadaNivel>) {
    arrayDeAlcadaNivel.sort((a, b) => a.valor - b.valor);
    this.form.get('alcadaNiveis').setValue(arrayDeAlcadaNivel);
  }
}
