import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
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
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);

  acceptedTerms: boolean = false;
  isLoading: boolean = false;
  showPassword = false;
  msgError: string = '';
  subscription: Subscription = new Subscription();

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }
  submitForm(): void {
    if (this.loginForm.valid) {
      this.subscription.unsubscribe();

      this.isLoading = true;

      this.subscription = this.authService
        .loginForm(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            console.log(res);
            if (res.message === 'success') {
              this.msgError = '';
              this.cookieService.set('token', res.token);

              //navigate to home
              setTimeout(() => {
                this.authService.saveUserData();

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
    } else {
      //show all errors
      this.loginForm.markAllAsTouched();
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
}
