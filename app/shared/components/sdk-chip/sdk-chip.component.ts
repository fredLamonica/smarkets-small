import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sdk-chip',
  templateUrl: './sdk-chip.component.html',
  styleUrls: ['./sdk-chip.component.scss']
})
export class SdkChipComponent implements OnInit {
  @Input() icon: string = '';
  @Input() shadow: boolean = false;
  @Input() content: string = '';
  @Input() disabled: boolean = false;
  @Input('is-button') isButton: boolean = false;
  @Input() removable: boolean = false;
  @Input('icon-color') iconColor: string = '#16C723';
  @Input('content-color') contentColor: string = '#F5F5F5';
  @Input('icon-text-color') iconTextColor: string = '#FFFFFF';
  @Input('content-text-color') contentTextColor: string = '#16C723';

  @Output('on-remove') onRemove = new EventEmitter();
  @Output('on-click') onClick = new EventEmitter();

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {}

  remove() {
    if (!this.disabled) {
      this.onRemove.emit();
      this.elRef.nativeElement.remove();
    }
  }

  callback() {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
}
