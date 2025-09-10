import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { TipoPedidoFluxoIntegracaoErp } from '../../../models/enums/tipo-pedido-fluxo-integracao-erp.enum';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appTipoFluxoIntegracaoErpText]',
})
export class TipoFluxoIntegracaoErpTextDirective implements AfterViewInit {

  // tslint:disable-next-line: no-input-rename
  @Input('appTipoFluxoIntegracaoErpText') tipoFluxoIntegracaoErp: TipoPedidoFluxoIntegracaoErp;

  constructor(private renderer: Renderer2, private el: ElementRef) { }
  ngAfterViewInit(): void {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.getText());
  }

  private getText(): string {
    switch (this.tipoFluxoIntegracaoErp) {
      case TipoPedidoFluxoIntegracaoErp.integracao:
        return 'DADOS';

      case TipoPedidoFluxoIntegracaoErp.upload:
        return 'ANEXO';
    }
  }

}
