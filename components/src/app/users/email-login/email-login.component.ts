import { Component, ChangeDetectorRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SetState } from 'src/app/state.decorator';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './email-login.component.html',
})
export class EmailLoginComponent implements AfterViewInit, OnDestroy {

  @Input() showSignout = false;

  type: 'login' | 'signup' | 'reset password' = 'signup';
  form: FormGroup;
  formSub;

  serverError;
  isLoading = false;


  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, public auth: AuthService) {
    this.form = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
        ]
      ],
      'password': ['', [
        // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
        ],
      ],
      'passwordConfirm': ['']
    });

    this.formSub = this.form.valueChanges.pipe(tap(v => this.cd.detectChanges())).subscribe();
  }

  ngAfterViewInit() {

  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isReset() {
    return this.type === 'reset password';
  }

  get passwordMatch() {
    const p1 = this.password.value;
    const p2 = this.passwordConfirm.value;
    return this.type !== 'signup' || p1 === p2;
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  async onSubmit() {
    this.setState('isLoading', true);
    this.setState('serverError', null);
    if (this.type === 'login') {
      const { res, serverError } = await this.auth.emailLogin(this.email.value, this.password.value);
      this.setState('serverError', serverError);
    }
    if (this.type === 'signup')  {
      const { res, serverError } =  await this.auth.emailSignup(this.email.value, this.password.value);
      this.setState('serverError', serverError);
    }

    this.setState('isLoading', false);
  }

  @SetState()
  async resetPassword() {
    this.setState('isLoading', true);
    try {
      await this.auth.resetPassword(this.email.value);
      this.serverError = 'Sent! Check your email for instructions';
    } catch (err) {
      this.serverError = err.message;
    }
    this.setState('isLoading', false);
  }

  @SetState()
  toggleForm(val) {
    this.type = val;
  }

  @SetState()
  setState(k, v) {
    this[k] = v;
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }
}
