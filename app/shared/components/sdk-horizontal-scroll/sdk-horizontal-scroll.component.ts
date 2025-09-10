import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'sdk-horizontal-scroll',
  templateUrl: './sdk-horizontal-scroll.component.html',
  styleUrls: ['./sdk-horizontal-scroll.component.scss']
})
export class SdkHorizontalScrollComponent implements OnInit {
  @ViewChild('widgetsContent') widgetsContent: ElementRef;

  @Input() html: string = '';
  @Input() iconSize: string = 'fa-2x';
  @Input() contentColor: string = '';

  public get leftArrowVisible(): boolean {
    return this.widgetsContent.nativeElement.scrollLeft > 0;
  }

  public get rightArrowVisible(): boolean {
    var maxScrollLeft =
      this.widgetsContent.nativeElement.scrollWidth - this.widgetsContent.nativeElement.clientWidth;

    return this.widgetsContent.nativeElement.scrollLeft + 150 <= maxScrollLeft;
  }

  constructor() {}

  ngOnInit() {}

  public scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  }

  public scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }
}
