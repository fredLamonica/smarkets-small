import { PessoaJuridicaService } from '../../../shared/providers/pessoa-juridica.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslationLibraryService, ArquivoService, FornecedorService } from '@shared/providers';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Usuario } from '@shared/models';
import { FornecedorInteressado } from '@shared/models/fornecedor-interessado';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Aceite } from '@shared/models/aceite';

@Component({
  selector: 'aceite-termos',
  templateUrl: './aceite-termos.component.html',
  styleUrls: ['./aceite-termos.component.scss']
})
export class AceiteTermosComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() fornecedor: FornecedorInteressado;
  @Input() usuario: Usuario;

  private aceiteDeTermos: Aceite;
  razaoSocialDoCliente: string;

  @Input('pdf') pdf: SafeUrl;
  @Output('clicado') clicadoEmmiter = new EventEmitter();

  constructor(
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    public sanitizer: DomSanitizer,
    public fornecedorServie: FornecedorService,
    public pessoaJuridicaService: PessoaJuridicaService
  ) {}

  ngOnInit() {
    this.obterRazaoSocialDoCliente();
  }

  private obterRazaoSocialDoCliente() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.obterPorIdTenant(this.fornecedor.idTenant).subscribe(
      response => {
        this.razaoSocialDoCliente = response.razaoSocial;
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public aceitarTermo() {
    this.gerarAceite(true);
  }

  public negarTermo() {
    this.gerarAceite(false);
  }

  private gerarAceite(aceita: boolean) {
    this.aceiteDeTermos = new Aceite(
      this.usuario.idUsuario,
      this.fornecedor.idFornecedor,
      this.usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica,
      aceita
    );
    this.inserirAceite(this.aceiteDeTermos);
  }

  private inserirAceite(aceiteDeTermos: Aceite) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorServie.inserirAceite(this.aceiteDeTermos).subscribe(
      response => {
        this.blockUI.stop();
        return response;
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
    this.encerrar();
  }

  private encerrar() {
    this.clicadoEmmiter.emit();
  }
}
