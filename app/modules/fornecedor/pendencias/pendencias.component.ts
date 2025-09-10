import { AutenticacaoService } from '@shared/providers';
import { PerfilUsuario } from '../../../shared/models/enums/perfil-usuario';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pendencias-fornecedor',
  templateUrl: './pendencias.component.html',
  styleUrls: ['./pendencias.component.scss']
})
export class PendenciasComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: AutenticacaoService) {}

  idPessoaJuridicaFornecedor: number = 0;
  habilitarResponderPendencia: boolean = false;

  ngOnInit() {
    this.idPessoaJuridicaFornecedor = this.route.parent.snapshot.params.id;
    this.habilitarResponderPendencia = this.authService.perfil() === PerfilUsuario.Fornecedor;
  }
}
