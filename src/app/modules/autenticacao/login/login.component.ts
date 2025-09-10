import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockAuthService } from '../../../shared/services/mock/mock-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  passwordInputType = 'password';
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
      identificador: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  login() {
    if (this.form.valid) {
      this.loading = true;
      
      this.mockAuthService.login(this.form.value).subscribe(
        response => {
          this.loading = false;
          if (response.success) {
            this.router.navigate(['/dashboard']);
          }
        },
        error => {
          this.loading = false;
          console.error('Erro no login:', error);
        }
      );
    }
  }

  modificarVisibilidadeSenha() {
    this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
  }
}