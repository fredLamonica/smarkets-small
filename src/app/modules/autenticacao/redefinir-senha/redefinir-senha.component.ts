import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockAuthService } from '../../../shared/services/mock/mock-auth.service';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.scss']
})
export class RedefinirSenhaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  
  // Validações de senha
  senhaMaiorOitoCaracter = false;
  senhaContemLetraMinuscula = false;
  senhaContemLetraMaiuscula = false;
  senhaContemNumero = false;
  senhaContemCaracterEspecial = false;
  senhaIguais = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mockAuthService: MockAuthService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      novaSenha: ['', Validators.required],
      confirmacaoNovaSenha: ['', Validators.required]
    });
  }

  validarSenha() {
    const senha = this.form.get('novaSenha').value;
    
    this.senhaMaiorOitoCaracter = senha.length >= 8;
    this.senhaContemLetraMinuscula = /[a-z]/.test(senha);
    this.senhaContemLetraMaiuscula = /[A-Z]/.test(senha);
    this.senhaContemNumero = /\d/.test(senha);
    this.senhaContemCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    
    this.validarSenhasIguais();
  }

  validarSenhasIguais() {
    const senha = this.form.get('novaSenha').value;
    const confirmacao = this.form.get('confirmacaoNovaSenha').value;
    
    this.senhaIguais = senha === confirmacao && senha.length > 0;
  }

  redefinirSenha() {
    if (this.form.valid && this.todasValidacoesPassaram()) {
      this.loading = true;
      
      this.mockAuthService.redefinirSenha(this.form.value).subscribe(
        response => {
          this.loading = false;
          if (response.success) {
            alert('Senha redefinida com sucesso!');
            this.router.navigate(['/auth/login']);
          }
        },
        error => {
          this.loading = false;
          console.error('Erro na redefinição:', error);
        }
      );
    }
  }

  private todasValidacoesPassaram(): boolean {
    return this.senhaMaiorOitoCaracter &&
           this.senhaContemLetraMinuscula &&
           this.senhaContemLetraMaiuscula &&
           this.senhaContemNumero &&
           this.senhaContemCaracterEspecial &&
           this.senhaIguais;
  }
}