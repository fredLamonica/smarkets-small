import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '@shared/providers';

@Component({
  selector: 'listar-pessoa-juridica-escolha',
  templateUrl: './listar-pessoa-juridica-escolha.component.html',
  styleUrls: ['./listar-pessoa-juridica-escolha.component.scss']
})
export class ListarPessoaJuridicaEscolhaComponent implements OnInit {
  constructor(public authService: AutenticacaoService) {}

  ngOnInit() {}
}
