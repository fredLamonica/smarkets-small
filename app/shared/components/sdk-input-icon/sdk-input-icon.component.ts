import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sdk-input-icon',
  templateUrl: './sdk-input-icon.component.html',
  styleUrls: ['./sdk-input-icon.component.scss']
})
export class SdkInputIconComponent implements OnInit {
  @Input() icon: string;
  @Input() inputClass: string;
  @Input() label: string;
  @Input() placeHolder: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Output() event = new EventEmitter();

  public form: FormGroup;
  public IconIsVisible = true;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.construirFormulario();
  }

  private construirFormulario() {
    this.form = this.fb.group({
      valueInput: [null]
    });
  }

  public emitEvent() {
    this.event.emit(this.form.get('valueInput').value);
  }

  public hidenIcon() {
    this.IconIsVisible = false;
  }

  public showIcon() {
    this.IconIsVisible = true;
  }
}
