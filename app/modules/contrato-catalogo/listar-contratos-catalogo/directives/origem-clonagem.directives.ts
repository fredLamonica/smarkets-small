import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[smkOrigemClonagem]',
})
export class OrigemClonagemDirective implements OnInit {

  @Input() clonagem: boolean;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.processeSituacao();
  }

  private processeSituacao(): void {
    let classe: string;

    if(this.clonagem)
      classe = 'success';
    else
      classe = 'secondary';

    this.el.nativeElement.classList.add(classe);
  }
}
