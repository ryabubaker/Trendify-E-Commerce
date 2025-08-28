import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  acceptedTerms: boolean = false;
  isLoading: boolean = false;
  showPassword = false;
  msgError: string = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.loginForm(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log(res);
          if (res.message === 'success') {
            console.log('login success');
            this.msgError = '';

            //navigate to home
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          this.msgError = err.error.message;
        },
      });
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
