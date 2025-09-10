import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-area-usuario',
  templateUrl: './area-usuario.component.html',
  styleUrls: ['./area-usuario.component.scss']
})
export class AreaUsuarioComponent implements OnInit {
  configuracoes = [
    {
      titulo: 'Informações Pessoais',
      texto: 'Gerencie suas informações pessoais, contato e segurança',
      icone: 'fas fa-user',
      rota: '/area-usuario/informacoes-pessoais',
      acaoBotao: 'Configurar',
      class: 'link-configuracoes'
    },
    {
      titulo: 'Histórico de Compras',
      texto: 'Visualize seu histórico completo de compras realizadas',
      icone: 'fas fa-history',
      rota: '/area-usuario/historico-compras',
      acaoBotao: 'Visualizar',
      class: 'link-configuracoes'
    },
    {
      titulo: 'Produtos Favoritos',
      texto: 'Gerencie sua lista de produtos favoritos',
      icone: 'fas fa-heart',
      rota: '/area-usuario/produtos-favoritos',
      acaoBotao: 'Gerenciar',
      class: 'link-configuracoes'
    },
    {
      titulo: 'Notificações',
      texto: 'Configure suas preferências de notificação',
      icone: 'fas fa-bell',
      rota: '/area-usuario/notificacoes',
      acaoBotao: 'Configurar',
      class: 'link-configuracoes'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  abrirConfiguracoes(rota: string) {
    this.router.navigate([rota]);
  }
}