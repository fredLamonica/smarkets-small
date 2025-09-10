import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { SituacaoFluxoIntegracaoErp } from '../../../models/enums/situacao-fluxo-integracao-erp.enum';

@Directive({
  selector: '[appSituacaoFluxoIntegracaoErpText]',
})
export class SituacaoFluxoIntegracaoErpTextDirective implements AfterViewInit {

  // tslint:disable-next-line: no-input-rename
  @Input('appSituacaoFluxoIntegracaoErpText') situacaoFluxoIntegracaoErp: SituacaoFluxoIntegracaoErp;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.getText());
  }

  private getText(): string {
    switch (this.situacaoFluxoIntegracaoErp) {
      case SituacaoFluxoIntegracaoErp.integradoComSucesso:
        return 'INTEGRADO COM SUCESSO';

      case SituacaoFluxoIntegracaoErp.erroDeIntegracao:
        return 'ERRO DE INTEGRAÇÃO';
    }
  }

}
