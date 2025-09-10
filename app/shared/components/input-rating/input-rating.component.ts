import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


@Component({
  selector: 'input-rating',
  templateUrl: './input-rating.component.html',
  styleUrls: ['./input-rating.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputRatingComponent), multi: true }
  ],
})
export class InputRatingComponent implements OnInit, ControlValueAccessor {
  
  @Input() max: number = 5;
  @Input() readonly: boolean = false;
  @Input() rating: number;
  @Input() index: number;
  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();

  private _rate: any;

  get rate() {
    return this._rate;
  }

  set rate(value) {
    this._rate = value;
    this.propagateChange(this._rate);
  }

  constructor() { }

  writeValue(obj: any): void {
    this.rate = obj;
  }  
  
  propagateChange = (_: any) => { };
  
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  ngOnInit() {
    
  }

  onClick(rating: number): void {
    this.rating = rating;
    this.ratingClick.emit({
      index: this.index,
      rating: rating
    });
  }
}
