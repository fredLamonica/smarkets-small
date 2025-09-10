import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MockAuthService } from '../../../../shared/services/mock/mock-auth.service';

@Component({
  selector: 'app-informacoes-pessoais',
  templateUrl: './informacoes-pessoais.component.html',
  styleUrls: ['./informacoes-pessoais.component.scss']
})
export class InformacoesPessoaisComponent implements OnInit {
  form: FormGroup;
  formAlteracaoDeEmail: FormGroup;
  formAlteracaoDeSenha: FormGroup;
  usuario: any;
  novaSenhaInputType = 'password';

  maskTelefone = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private fb: FormBuilder,
    private mockAuthService: MockAuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.initializeForms();
  }

  private loadUserData() {
    this.mockAuthService.getCurrentUser().subscribe(user => {
      this.usuario = user;
      this.populateForm();
    });
  }

  private initializeForms() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      ramal: [''],
      celular: [''],
      senha: ['']
    });

    this.formAlteracaoDeEmail = this.fb.group({
      novoEmail: ['', [Validators.required, Validators.email]],
      novoEmailConfirm: ['', Validators.required]
    });

    this.formAlteracaoDeSenha = this.fb.group({
      novaSenha: ['', Validators.required],
      novaSenhaConfirm: ['', Validators.required]
    });
  }

  private populateForm() {
    if (this.usuario) {
      this.form.patchValue({
        nome: this.usuario.pessoaFisica?.nome,
        email: this.usuario.email,
        telefone: this.usuario.pessoaFisica?.telefone,
        ramal: this.usuario.pessoaFisica?.ramal,
        celular: this.usuario.pessoaFisica?.celular,
        senha: '********'
      });
    }
  }

  salvar() {
    if (this.form.valid) {
      alert('Informações salvas com sucesso!');
    }
  }

  alterarEmail() {
    // Simular abertura de modal de alteração de email
    alert('Modal de alteração de email aberto (simulado)');
  }

  alterarSenha() {
    // Simular abertura de modal de alteração de senha
    alert('Modal de alteração de senha aberto (simulado)');
  }

  confirmarAlteracaoDeEmail(modal: any) {
    if (this.formAlteracaoDeEmail.valid) {
      alert('Email alterado com sucesso!');
      modal.close();
    }
  }

  confirmarAlteracaoDeSenha(modal: any) {
    if (this.formAlteracaoDeSenha.valid) {
      alert('Senha alterada com sucesso!');
      modal.close();
    }
  }

  modifiqueVisibilidadeSenha() {
    this.novaSenhaInputType = this.novaSenhaInputType === 'password' ? 'text' : 'password';
  }
}