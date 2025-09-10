import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-rede-fornecedora',
  templateUrl: './rede-fornecedora.component.html',
  styleUrls: ['./rede-fornecedora.component.scss']
})
export class RedeFornecedoraComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  constructor(private router: Router) {}

  ngOnInit() {}

  get fornecedoresLocal() {
    if (this.router.url.includes('/fornecedores/local')) {
      return true;
    }
    return false;
  }
}
