import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'kan-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  private headers = new Headers();
  hello;
  constructor(private http: Http, private authenticationService: AuthenticationService) {
    this.headers.append('Authorization', 'Bearer ' + this.authenticationService.token);
  }

  ngOnInit() {
    // console.log(this.http.get("http://localhost:8080/protected", { headers: this.headers })
    //   .toPromise().then(res => res.json));
  }

}
