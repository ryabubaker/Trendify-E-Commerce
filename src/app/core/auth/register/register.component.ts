import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  acceptedTerms: boolean = false;
  isLoading: boolean = false;
  showPassword = false;
  showRePassword = false;
  msgError: string = '';

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  confirmPassword(group: AbstractControl) {
    return group.get('password')?.value === group.get('rePassword')?.value
      ? null
      : { mismatch: true };
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.registerForm(this.registerForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log(res);
          if (res.message === 'success') {
            console.log('signup success');
            this.msgError = '';

            //navigate to login
            setTimeout(() => {
              this.router.navigate(['/login']);
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

  togglePasswordVisibility(field: 'password' | 'rePassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showRePassword = !this.showRePassword;
    }
  }

  initForm() {
    this.registerForm = new FormGroup(
      {
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        rePassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        phone: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^01[0125][0-9]{8}$/),
        ]),
      },
      {
        validators: [this.confirmPassword],
      }
    );
  }
}
