import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'planos-acao-fornecedor',
  templateUrl: './planos-acao-fornecedor.component.html',
  styleUrls: ['./planos-acao-fornecedor.component.scss']
})
export class PlanosAcaoFornecedorComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  idPessoaJuridicaFornecedor: number = 0;

  ngOnInit() {
    this.idPessoaJuridicaFornecedor = this.route.parent.snapshot.params.id;
  }
}
