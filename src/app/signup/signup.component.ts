import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'kan-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  model: any = {};
  signupStatus;

  constructor(private authenticationService: AuthenticationService) { }

  signup() {
    this.authenticationService.signup(this.model.username, this.model.password, this.model.email)
    .then(response => this.signupStatus = response);
}

}
