import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'kan-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {

  model: any = {};
  msgs: Message[] = [];

  constructor(private authenticationService: AuthenticationService) { }

  signup() {
    this.authenticationService.signup(this.model.username, this.model.password, this.model.email)
      .then(response => {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: '200 Ok', detail: response });
      });
  }

}
