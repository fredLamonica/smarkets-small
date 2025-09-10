import { Component, OnInit, ViewChild } from '@angular/core';
import { MatrizResponsabilidadeComponent } from '../matriz-responsabilidade/matriz-responsabilidade.component';
import { PessoaJuridica } from '@shared/models';
import { AutenticacaoService } from '@shared/providers';

@Component({
  selector: 'app-matriz-tab',
  templateUrl: './matriz-tab.component.html',
  styleUrls: ['./matriz-tab.component.scss']
})
export class MatrizTabComponent implements OnInit {

  @ViewChild('matrizResponsabilidadeComponent') matrizResponsabilidadeComponent: MatrizResponsabilidadeComponent;

  public termo: string;
  public empresa: PessoaJuridica;

  constructor(
    private authService: AutenticacaoService
  ) { }

  ngOnInit() {
    this.empresa = this.authService.usuario().permissaoAtual.pessoaJuridica;
  }

  public buscar(termo) {
    this.matrizResponsabilidadeComponent.resetPaginacao();
    this.matrizResponsabilidadeComponent.obterMatriz(termo);
  }

  public onScroll() {
    this.matrizResponsabilidadeComponent.onScroll();
  }
}
