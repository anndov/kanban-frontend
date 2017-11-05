import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class AbstractService {

    private headers = new Headers();

    constructor(private router:Router, private http: Http, private authenticationService: AuthenticationService) {
        this.headers.append('Content-Type', 'application/json; charset=utf-8');
        this.headers.append('Access-Control-Allow-Origin', '*');
        this.headers.append('Authorization', 'Bearer ' + this.authenticationService.token);
      }

      private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
      }

}