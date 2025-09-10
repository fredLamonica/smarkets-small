import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CarrinhoResumo } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { CarrinhoService } from '../../../shared/providers/carrinho.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'resumo-carrinho',
  templateUrl: './resumo-carrinho.component.html',
  styleUrls: ['./resumo-carrinho.component.scss'],
})
export class ResumoCarrinhoComponent extends Unsubscriber implements OnInit {

  static atualizarCarrinho: Subject<any> = new Subject();
  static carrinhoAtualizadoObserver: Observable<CarrinhoResumo>;

  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-output-rename
  @Output('ir-carrinho') irCarrinhoEmitter = new EventEmitter();

  atualizando: boolean;
  resumo: CarrinhoResumo;
  valorTotal: number;
  itens: number;

  private carrinhoAtualizadoMessenger: Subject<CarrinhoResumo> = new Subject<CarrinhoResumo>();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private carrinhoService: CarrinhoService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    ResumoCarrinhoComponent.carrinhoAtualizadoObserver = this.carrinhoAtualizadoMessenger.asObservable();

    ResumoCarrinhoComponent.atualizarCarrinho.subscribe((message) => {
      this.obterCarrinho();
    });

    this.obterCarrinho();
  }

  obterCarrinho() {
    this.atualizando = true;
    this.carrinhoService.obterResumo().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.atualizando = false))
      .subscribe(
        (response) => {
          if (response) {
            this.resumo = response;
          } else {
            this.resumo = new CarrinhoResumo({
              valor: 0,
              quantidadeItensRequisicao: 0,
              quantidadeItensCatalogo: 0,
              quantidadeItensRegularizacao: 0,
            });
          }

          this.carrinhoAtualizadoMessenger.next(this.resumo);
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  irCarrinho() {
    this.irCarrinhoEmitter.emit();
    this.router.navigate(['/carrinho']);
  }

}
