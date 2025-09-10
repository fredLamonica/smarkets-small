import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { SituacaoFluxoIntegracaoErp } from '../../../models/enums/situacao-fluxo-integracao-erp.enum';

@Directive({
  selector: '[appSituacaoFluxoIntegracaoErpClass]',
})
export class SituacaoFluxoIntegracaoErpClassDirective implements AfterViewInit {

  // tslint:disable-next-line: no-input-rename
  @Input('appSituacaoFluxoIntegracaoErpClass') situacaoFluxoIntegracaoErp: SituacaoFluxoIntegracaoErp;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.el.nativeElement, this.getClass());
  }

  private getClass(): string {
    switch (this.situacaoFluxoIntegracaoErp) {
      case SituacaoFluxoIntegracaoErp.integradoComSucesso:
        return 'sucesso';

      case SituacaoFluxoIntegracaoErp.erroDeIntegracao:
        return 'erro';
    }
  }

}
