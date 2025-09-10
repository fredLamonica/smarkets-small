import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { UsuarioDto } from '@shared/models/dto/usuario-dto';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sdk-user-select',
  templateUrl: './sdk-user-select.component.html',
  styleUrls: ['./sdk-user-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SdkUserSelectComponent),
      multi: true,
    },
  ],
})
export class SdkUserSelectComponent implements OnInit, ControlValueAccessor {

  get value(): number {
    return this._value;
  }

  @Input() set value(value: number) {
    this._value = value;
    this.propagateChange(this._value);
  }
  @ViewChild('userSelect') ngSelect: NgSelectComponent;

  @BlockUI() blockUI: NgBlockUI;

  @Input() termo: string = '';
  @Input() placeholder: string = 'Insira o e-mail';
  @Input() disabled: boolean = false;
  @Input() users = [];

  // tslint:disable-next-line: no-output-rename
  @Output('button-click') buttonClickEmitter = new EventEmitter<string>();
  // tslint:disable-next-line: no-output-rename
  @Output('blur') blurEmitter = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('change') changeEmitter = new EventEmitter();

  wasSearched = false;
  isOpen = false;
  private _value: number;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
  ) { }
  ngOnInit() { }

  buttonClick() {
    if (this.wasSearched) {
      this.value = null;
      this.wasSearched = false;
    } else {
      this.getUsers();
    }
  }

  userCustomSearchFn(term: string, item: UsuarioDto) {
    term = term.toLowerCase();
    return (
      item.email.toLowerCase().indexOf(term) > -1 || item.nome.toLowerCase().indexOf(term) > -1
    );
  }

  getSearchText(event) {
    this.termo = event;
  }

  blur() {
    this.blurEmitter.emit();
  }

  onChangeUser(event) {
    this.isOpen = false;
  }

  propagateChange = (_: any) => { };

  registerOnTouched(fn: any): void { }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  private getUsers() {
    if (this.termo.length < 3) {
      this.toastr.warning('São necessários ao menos 3 caracteres para realizar a pesquisa');
    } else {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.usuarioService.getUsersFilter(this.termo).subscribe(
        (response) => {
          if (response) {
            this.users = response;
          } else {
            this.users = new Array<UsuarioDto>();
          }
          this.isOpen = null;
          setTimeout(() => {
            this.ngSelect.handleArrowClick();
          }, 100);
          this.wasSearched = true;
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    }
  }
}
