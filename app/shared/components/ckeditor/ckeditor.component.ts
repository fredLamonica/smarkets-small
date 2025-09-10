import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ck-editor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CkeditorComponent), multi: true }
  ],
})

/**
 * CKEditor component
 * Usage on TwoWay data binding:
 *  <ck-editor [(ngModel)]="content" [readonly]="false"></ck-editor>
 *
 * Usage on Reactive Forms:
 *  <ck-editor formControlName="content" [readonly]="false"></ck-editor>
 */

export class CkeditorComponent implements OnInit, ControlValueAccessor {

  public config = {
    uiColor: '#FFFFFF',
    toolbarGroups: [
      { name: 'document', groups: ['mode', 'document', 'doctools'] },
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      { name: 'styles', groups: ['styles'] },
      { name: 'colors', groups: ['colors'] },
      { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
      { name: 'forms', groups: ['forms'] },
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
      { name: 'links', groups: ['links'] },
      { name: 'insert', groups: ['insert'] },
      { name: 'tools', groups: ['tools'] },
      { name: 'others', groups: ['others'] },
      { name: 'about', groups: ['about'] }
    ],
    removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,TextField,Textarea,Select,Checkbox,Radio,Button,ImageButton,HiddenField,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Image,Flash,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About,CopyFormatting,Indent,Outdent,Strike,Table,HorizontalRule'
  }

  @Input() readonly: boolean;

  private _value: string;

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.propagateChange(this._value);
  }

  constructor() { }

  ngOnInit() {

  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

}
