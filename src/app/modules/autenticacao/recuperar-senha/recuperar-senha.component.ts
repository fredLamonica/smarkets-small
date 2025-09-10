import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockAuthService } from '../../../shared/services/mock/mock-auth.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {
  form: FormGroup;
  loading = false;

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
      identificador: ['', [Validators.required, Validators.email]]
    });
  }

  recuperarSenha() {
    if (this.form.valid) {
      this.loading = true;
      
      this.mockAuthService.recuperarSenha(this.form.value.identificador).subscribe(
        response => {
          this.loading = false;
          if (response.success) {
            alert('Email de recuperação enviado com sucesso!');
            this.router.navigate(['/auth/login']);
          }
        },
        error => {
          this.loading = false;
          console.error('Erro na recuperação:', error);
        }
      );
    }
  }

  voltar() {
    this.router.navigate(['/auth/login']);
  }
}