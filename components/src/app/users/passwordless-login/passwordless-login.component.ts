import { Component, ChangeDetectorRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SetState } from 'src/app/state.decorator';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './passwordless-login.component.html',
})
export class PasswordlessLogin {

  form: FormGroup;
  formSub;
  isLoading = false;
  serverError;
  confirmation = false;

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, public auth: AuthService) {
    this.form = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
        ]
      ],
    });

    this.formSub = this.form.valueChanges.pipe(tap(v => this.cd.detectChanges())).subscribe();
  }

  get email() {
    return this.form.get('email');
  }

  async onSubmit() {
    this.setState('isLoading', true);
    this.setState('serverError', null);

    const res = await this.auth.sendPasswordlessEmail(this.email.value);

    this.setState('isLoading', false);
    this.setState('confirmation', true);
  }

  @SetState()
  setState(k, v) {
    this[k] = v;
  }


}
