import { Component, OnInit, forwardRef, Output, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'input-bookmark',
  templateUrl: './input-bookmark.component.html',
  styleUrls: ['./input-bookmark.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputBookmarkComponent), multi: true }
  ],
})
export class InputBookmarkComponent implements OnInit {

  @Input('valor') valor: boolean = false;
  
  constructor() { }

  ngOnInit() { }
}
