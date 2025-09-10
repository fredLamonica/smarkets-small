import { Situacao } from './../../../../shared/models/enums/situacao';
import { TransportadoraService } from '@shared/providers/transportadora.service';
import { StatusHomologacaoTransportadora } from './../../../../shared/models/enums/status-homologacao-transportadora.enum';
import { Transportadora } from '@shared/models/transportadora';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'manter-transportadora',
  templateUrl: './manter-transportadora.component.html',
  styleUrls: ['./manter-transportadora.component.scss']
})
export class ManterTransportadoraComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public maskCnpj = [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/
  ];
  public maskTelefone = [
    '(',
    /\d/,
    /\d/,
    ')',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  public maskCelular = [
    '(',
    /\d/,
    /\d/,
    ')',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];

  public idTransportadora: number;
  public transportadora: Transportadora;

  public statusHomologacaoTransportadora = StatusHomologacaoTransportadora;
  public situacao = Situacao;

  public form: FormGroup;

  public tabAtiva: string;

  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private authService: AutenticacaoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private transportadoraService: TransportadoraService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.contruirFormulario();
    this.selectTab();
    this.obterParametros();
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      cnpj: ['', Validators.compose([Validators.required, CustomValidators.cnpj])],
      razaoSocial: ['', Validators.required],
      nomeFantasia: [''],
      contato: [''],
      email: [''],
      telefone: ['', Validators.maxLength(20)],
      statusHomologacao: [StatusHomologacaoTransportadora, Validators.required],
      idPessoaJuridica: [0],
      codigoTransportadora: [''],
      situacao: []
    });
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idTransportadora = params['idTransportadora'];
      if (this.idTransportadora) {
        this.obterTransportadora();
      }
    });
  }

  private obterTransportadora() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.transportadoraService.obterPorId(this.idTransportadora).subscribe(
      response => {
        if (response) {
          this.preencherFormulario(response);
          this.transportadora = response;
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private preencherFormulario(transportadora: Transportadora) {
    this.form.patchValue(transportadora);
  }

  public selectTab(aba?: string) {
    if (!aba) this.tabAtiva = 'dados-gerais';
    else this.tabAtiva = aba;
  }

  public solicitarPersistencia() {
    if (!this.idTransportadora) {
      this.inserir();
    } else {
      this.alterar(this.construirTransportadora());
    }
  }

  private inserir() {
    // if (this.buscaDeUsuarioRealizada || this.form.controls.nomeUsuario.valid) {
    //   if (this.form.valid) {
    //     this.blockUI.start(this.translationLibrary.translations.LOADING);
    //     let form = this.form.value;
    //     //let fornecedorInteressado = this.obterFornecedorInteressado();
    //     let fornecedorInteressado = new Transportadora(
    //       0,
    //       0,
    //       0,
    //       SituacaoFornecedor.Interessado,
    //       OrigemFornecedor.Interessado,
    //       0,
    //       this.form.controls.cnpj.value,
    //       this.form.controls.razaoSocial.value,
    //       true,
    //       StatusHomologacaoFornecedor['Não Homologado']
    //     );
    //     //usuario
    //     if (this.usuario) {
    //       fornecedorInteressado.contato = this.usuario.pessoaFisica.nome;
    //       fornecedorInteressado.email = this.usuario.email;
    //       fornecedorInteressado.idUsuario = this.usuario.idUsuario;
    //     } else {
    //       fornecedorInteressado.contato = form.nomeUsuario;
    //       fornecedorInteressado.email = form.emailUsuario;
    //     }
    //     //categorias
    //     if (this.categoriasFornecimento && this.categoriasFornecimento.length) {
    //       fornecedorInteressado.categoriasFornecimento = this.form.value.categoriasFornecimento;
    //     }
    //     fornecedorInteressado.statusHomologacao = StatusHomologacaoFornecedor['Não Homologado'];
    //     this.inserir(fornecedorInteressado);
    //     this.blockUI.stop();
    //   } else {
    //     this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    //   }
    // } else {
    //   this.toastr.warning('Por favor confirme o usuário responsável clicando no botão de buscar');
    // }
  }

  private alterar(transportadora: Transportadora) {
    if (this.form.value.statusHomologacao != 0) {
      this.transportadoraService.alterar(transportadora).subscribe(
        response => {
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private construirTransportadora(): Transportadora {
    let form = this.form.value;
    let transportadora = new Transportadora();
    transportadora = this.transportadora;
    transportadora.statusHomologacao = form.statusHomologacao;
    transportadora.situacao = form.situacao;
    transportadora.contato = form.contato;
    transportadora.email = form.email;
    transportadora.telefone = form.telefone;

    return transportadora;
  }

  public cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }
}
