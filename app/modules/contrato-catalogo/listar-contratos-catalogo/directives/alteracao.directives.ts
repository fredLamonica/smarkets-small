import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[smkAlteracao]',
})
export class AlteracaoDirective implements OnInit {

  @Input() possuiAlteracao: boolean;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.processeSituacao();
  }

  private processeSituacao(): void {
    let classe: string;

    if(this.possuiAlteracao)
      classe = 'success';

    this.el.nativeElement.classList.add(classe);
  }
}
