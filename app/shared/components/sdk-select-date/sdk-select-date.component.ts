import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'sdk-select-date',
  templateUrl: './sdk-select-date.component.html',
  styleUrls: ['./sdk-select-date.component.scss']
})
export class SdkSelectDateComponent implements OnInit {
  @Input() placeHolder: string = '';
  @Input() class: string = '';
  @Output() event = new EventEmitter();
  public form: FormGroup;
  public iconIsVisible = true;
  @ViewChild('input')
  private input: ElementRef;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.construirFormulario();
  }

  private construirFormulario() {
    this.form = this.fb.group({
      valueInput: [null]
    });
  }

  public setInputDate() {
    this.input.nativeElement.type = 'date';
    this.iconIsVisible = false;
  }

  public setInputText(value) {
    this.input.nativeElement.type = 'text';

    this.input.nativeElement.placeholder = value
      ? moment(value).format('DD/MM/YYYY').toString()
      : this.placeHolder;

    this.form.setValue({ valueInput: null });

    this.iconIsVisible = true;
  }

  public emitEvent() {
    const value = this.form.get('valueInput').value;

    this.setInputText(value);

    if (value) {
      this.event.emit(value);
    }
  }
}
