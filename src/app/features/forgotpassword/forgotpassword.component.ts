import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';
import { error } from 'node:console';
import { AuthService } from '../../core/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-forgotpassword',
  imports: [
    StepperModule,
    ButtonModule,
    InputOtp,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ForgotpasswordComponent {
  ngOnInit(): void {
    this.generateEmail();
    this.generateCode();
    this.generateNewPassword();
  }

  // inject services
  private readonly formBuilder = inject(FormBuilder);

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  private readonly cookie = inject(CookieService);

  // properites
  verifyEmail!: FormGroup;
  verifyCode!: FormGroup;
  verifyNewPassword!: FormGroup;
  value: any;
  isPasswordVisible: boolean = false;
  isloading: boolean = false;

  // (generate Forms) ==>   Form (1) generate object => Email
  generateEmail() {
    this.verifyEmail = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  //   Form (2)  generate object => code
  generateCode() {
    this.verifyCode = this.formBuilder.group({
      resetCode: [null, [Validators.pattern(/^[0-9]{6}$/)]],
    });
  }

  // Form (3) generate object => Email and new Password
  generateNewPassword() {
    this.verifyNewPassword = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      newPassword: [
        null,
        [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)],
      ],
    });
  }

  // Send Email
  sendEmailUser(activateCallback: any) {
    this.isloading = true;

    if (this.verifyEmail.valid) {
      this.authService.forgotPassword(this.verifyEmail.value).subscribe({
        next: (res) => {
          this.isloading = false;

          console.log(res);

          activateCallback(2);
        },
        error: (err) => {
          this.isloading = false;
        },
      });
    } else {
      this.verifyEmail.markAllAsTouched();
    }
  }

  // send code
  verifyResetCode(activateCallback: any) {
    this.isloading = true;
    if (this.verifyCode.valid) {
      this.authService.verifyResetCode(this.verifyCode.value).subscribe({
        next: (res) => {
          if (res.status == 'Success') {
            this.isloading = false;

            console.log(res);

            activateCallback(3);
          }
        },
        error: (err) => {
          this.isloading = false;
          activateCallback(1);
          this.verifyCode.reset();
        },
      });
    } else {
      this.verifyCode.markAllAsTouched();
    }
  }

  // send new Password

  resetPassword() {
    this.isloading = true;

    this.authService.resetNewPassword(this.verifyNewPassword.value).subscribe({
      next: (res) => {
        this.isloading = false;

        console.log(res);

        this.cookie.set('userToken', res.token);

        this.authService.saveUserData();

        this.router.navigate(['/home']);
      },
      error: () => {
        this.isloading = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
