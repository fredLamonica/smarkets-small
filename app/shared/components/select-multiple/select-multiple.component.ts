import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, forwardRef, HostListener, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectMultipleOptionPainelComponent } from '../select-multiple-option-panel/select-multiple-option-painel.component';

@Component({
  selector: 'select-multiple',
  templateUrl: './select-multiple.component.html',
  styleUrls: ['./select-multiple.component.scss'],
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectMultipleComponent),
        multi: true,
      },
    ],
})
export class SelectMultipleComponent implements OnInit, ControlValueAccessor {

  @Input() itensPreCarregados = true;
  @Input() itens: any[] = [];
  @Input() linhas: any[] = [];
  @Input() descricao: string = 'descricao';
  @Input() valor: string = 'valor';
  @Input() apenasNumeros: boolean = false;
  @Input() multiplasLinhasPorInput = false;
  @Input() separadorLinhas = ' ';

  @ViewChild('selectMultipleElement') selectMultipleElement!: ElementRef;
  private painelRef?: ComponentRef<SelectMultipleOptionPainelComponent>;

  value: any[] = [];
  aberto = false;

  descricaoInput = '';

  todosSelecionados = false;

  constructor(
    private renderer: Renderer2,
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit(
  ) {
    if (this.itensPreCarregados) {
      this.apenasNumeros = false;
      this.linhas = this.itens.map(item => ({
        descricao: item[this.descricao],
        valor: item[this.valor],
      }));
    }
  }

  expanda(cliqueNoInput: boolean = false) {
    if (this.painelRef) {
      if (!cliqueNoInput) {
        this.fechePainel();
      }
      return;
    }

    this.criePainel();

    this.posicionePainel();
  }

  limpeSelecao() {
    if (this.itensPreCarregados) {
      this.linhas.forEach((linha) => {
        linha.selecionado = false;
      });
    } else {
      this.linhas.splice(0, this.linhas.length);
    }

    this.atualizeValor();
  }

  private criePainel() {
    const component = this.resolver.resolveComponentFactory(SelectMultipleOptionPainelComponent)
    this.painelRef = this.vcr.createComponent(component);
    this.painelRef.instance.itensPreCarregados = this.itensPreCarregados;
    this.painelRef.instance.itens = this.linhas;
    this.painelRef.instance.updateValueEmitter.subscribe(() => {
      this.atualizeValor();
    });

    // Adiciona o painel ao final do body
    this.renderer.appendChild(document.body, this.painelRef.location.nativeElement);

    // Detecta mudanças para o componente dinâmico
    this.painelRef.changeDetectorRef.detectChanges();
  }

  handleEnter() {
    if (this.itensPreCarregados)
      return;

    if(this.isNullOrWhitespace(this.descricaoInput))
      return;

    let linhasInput: string[];

    if (this.multiplasLinhasPorInput) {
      linhasInput = this.descricaoInput.split(this.separadorLinhas);
    } else {
      linhasInput = [this.descricaoInput]
    }

    linhasInput.forEach((input) => {
      this.linhas.push({
        descricao: input,
        valor: input,
        selecionado: false,
      });
    })

    this.descricaoInput = '';

    this.atualizeValor();
  }

  private isNullOrWhitespace(input: string) {
    return !input || !input.toString().trim();
  }

  private posicionePainel() {
    if (!this.painelRef)
      return;

    const target = this.selectMultipleElement.nativeElement;

    let rect = target.getBoundingClientRect();
    const containerDiv = this.painelRef.location.nativeElement.querySelector('#container');

    const absoluteTop = rect.top + window.scrollY;
    this.renderer.setStyle(containerDiv, 'top', `${absoluteTop + target.offsetHeight}px`);

    rect = target.getBoundingClientRect();
    const absoluteLeft = rect.left + window.scrollX;
    const width = rect.width;

    this.renderer.setStyle(containerDiv, 'left', `${absoluteLeft}px`);
    this.renderer.setStyle(containerDiv, 'width', `${width}px`);

    // Abre o painel
    this.renderer.addClass(this.painelRef.location.nativeElement.querySelector('#dropdown'), 'open');
    this.aberto = true;
  }

  fechePainel() {
    if (this.painelRef) {
      this.aberto = false;
      this.renderer.removeChild(document.body, this.painelRef.location.nativeElement);

      this.painelRef.destroy();
      this.painelRef = undefined;
    }
  }

  @HostListener('document:click', ['$event'])
  captureCliqueFora(event: MouseEvent) {
    const cliqueNoInput = this.selectMultipleElement.nativeElement.contains(event.target);
    const cliquenoPainel = this.painelRef && this.painelRef.location.nativeElement.contains(event.target);

    if (!cliqueNoInput && !cliquenoPainel) {
      this.fechePainel();
    }
  }

  private atualizeValor() {
    if (this.itensPreCarregados) {
      this.value.splice(0, this.value.length);
      this.linhas.filter((linha) => linha.selecionado)
        .forEach((item) => {
          this.value.push(item.valor);
        });

      this.atualizeDescricaoInput();
    } else {
      this.value.splice(0, this.value.length);
      this.linhas.forEach((linha) => {
        this.value.push(linha.valor);
      });
    }

    this.onChange(this.value);
  }

  private atualizeDescricaoInput() {
    if (this.itensPreCarregados) {
      const numeroItensSelecionados = this.linhas.filter((item) => item.selecionado).length;
      if (numeroItensSelecionados > 1) {
        this.descricaoInput = `${numeroItensSelecionados} itens selecionados`;
      } else if (numeroItensSelecionados === 1) {
        this.descricaoInput =  this.linhas.filter((linha) => linha.selecionado)[0].descricao;
      } else {
        this.descricaoInput = '';
      };
    }
  }

  //#region ControlValueAcessor

  onChange = (value: any) => {};

  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ? value : [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onBlur(): void {
    this.onTouched();
  }


}
