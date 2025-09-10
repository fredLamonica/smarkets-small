import { indexOf } from 'lodash';
import { EnderecoDto } from './../../models/dto/endereco-dto';
import { Component, OnInit, forwardRef, Output, EventEmitter, Input } from '@angular/core';
import { Endereco, TipoEndereco } from '@shared/models';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManterEnderecoComponent } from './manter-endereco/manter-endereco.component';
import { ModalConfirmacaoExclusao } from '../modals/confirmacao-exclusao/confirmacao-exclusao.component';

@Component({
  selector: 'input-enderecos',
  templateUrl: './input-enderecos.component.html',
  styleUrls: ['./input-enderecos.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputEnderecosComponent),
      multi: true
    }
  ]
})
export class InputEnderecosComponent implements OnInit, ControlValueAccessor {
  @Output('delete') deleteEmitter = new EventEmitter();

  private _tiposEnderecosDisponiveis: Array<TipoEndereco> = new Array<TipoEndereco>(
    TipoEndereco.Cobrança,
    TipoEndereco.Entrega,
    TipoEndereco.Faturamento,
    TipoEndereco.Institucional
  );

  get tiposEnderecosDisponiveis(): Array<TipoEndereco> {
    if (
      this._value &&
      this._value.length &&
      this._value.filter(t => t.tipo != TipoEndereco.Entrega)
    ) {
      const itens = this._value.filter(end => end.tipo != TipoEndereco.Entrega);
      itens.forEach(item => {
        if (item.tipo !== TipoEndereco.Entrega) {
          let index = this._tiposEnderecosDisponiveis.indexOf(item.tipo);
          if (index != -1) this._tiposEnderecosDisponiveis.splice(index, 1);
        }
      });
    }
    return this._tiposEnderecosDisponiveis;
  }

  public TipoEndereco = TipoEndereco;

  public disabled: boolean;

  private _value: Array<Endereco>;

  get value(): Array<Endereco> {
    this.tiposEnderecosDisponiveis;
    return this._value;
  }

  set value(value: Array<Endereco>) {
    this._value = value;
    this.propagateChange(value);
  }

  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  public incluir() {
    const modalRef = this.modalService.open(ManterEnderecoComponent, {
      centered: true,
      size: 'lg'
    });

    modalRef.componentInstance.tiposEnderecos = this._tiposEnderecosDisponiveis;
    modalRef.componentInstance.hasAddress = this._value.length > 0;
    modalRef.result.then(result => {
      if (result) {
        const endereco = <Endereco & EnderecoDto>result;
        let enderecos = new Array<Endereco>();
        let tipos = endereco.tipos;
        tipos.forEach(tipo => {
          let e = new Endereco(
            0,
            0,
            endereco.idPais,
            endereco.idEstado,
            endereco.idCidade,
            endereco.cidade,
            endereco.cep,
            endereco.logradouro,
            endereco.numero,
            endereco.complemento,
            endereco.referencia,
            endereco.bairro,
            null,
            endereco.principal,
            tipo
          );
          enderecos.push(e);
        });

        this.value = this.value.concat(enderecos);
      }
    });
  }

  public editar(index: number) {
    const modalRef = this.modalService.open(ManterEnderecoComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.endereco = this.value[index];
    modalRef.result.then(result => {
      if (result) {
        this.value[index] = result;
      }
    });
  }

  public solicitarExclusao(index: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.excluir(index),
        reason => {}
      );
  }

  private excluir(index: number) {
    this.deleteEmitter.emit(this.value[index]);
    this.value.splice(index, 1);
  }

  // #region Accessors Methods
  writeValue(obj: any): void {
    if (obj) {
      this._value = obj;
    } else {
      this._value = new Array<Endereco>();
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  // #endregion
}
