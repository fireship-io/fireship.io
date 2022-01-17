
import { Component, ChangeDetectorRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './passwordless-handler.component.html',
})
export class PasswordlessHandler implements AfterViewInit {

    constructor(public auth: AuthService) {}

    async ngAfterViewInit() {
        const { res, serverError } = await this.auth.passwordlessSignin();
    }
}