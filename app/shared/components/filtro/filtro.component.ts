import { Component, OnInit, Input } from '@angular/core';
import { OperadorRelacional, OperadorLogico } from '@shared/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent implements OnInit {

  public OperadorRelacional = OperadorRelacional;
  public OperadorLogico = OperadorLogico;

  public filtros: Array<FormGroup>;

  @Input('propriedades') propriedades: Array<string> = new Array<string>();

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.filtros = new Array<FormGroup>();
    this.filtros.push(this.contruirFiltro());
  }

  public adicionarFiltro() {
    this.filtros[this.filtros.length-1].controls.operadorLogico.setValidators(Validators.required);
    this.filtros[this.filtros.length-1].controls.operadorLogico.updateValueAndValidity();
    this.filtros.push(this.contruirFiltro());
  }

  public removerFiltro(index: number) {
    if(index == this.filtros.length-1) {
      this.filtros[index-1].controls.operadorLogico.clearValidators();
      this.filtros[index-1].controls.operadorLogico.updateValueAndValidity();
    }
    this.filtros.splice(index, 1);
  }

  public contruirFiltro(): FormGroup {
    return this.fb.group({
      propriedade: ['', Validators.required],
      operadorRelacional: [OperadorRelacional.igual, Validators.required],
      termo: [''],
      operadorLogico: [null]
    });
  }

}
