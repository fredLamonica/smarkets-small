import { Component, OnInit } from '@angular/core';
import { SuporteService } from '@shared/providers';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent implements OnInit {
  public telefone: string;
  public email: string = 'suporteplataforma@smarkets.com.br';
  public suportJira: string = 'http://suporte.smarkets.com.br';
  
  constructor(private suporteService: SuporteService) {}

  ngOnInit() {
    this.telefone = this.suporteService.telefone;
    this.email = this.suporteService.email;
  }
}
