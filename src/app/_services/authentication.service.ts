import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { User } from '../users/user';
import { Constants } from '../_confs/constants';

@Injectable()
export class AuthenticationService {
    public token: string;
    private url = Constants.URL;
    private headers = new Headers();

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.headers.append('Content-Type', 'application/json; charset=utf-8');
        this.headers.append('Access-Control-Allow-Origin', '*');
    }

    login(username: string, password: string): Promise<boolean> {
        return this.http.post(this.url + '/auth', JSON.stringify({ username: username, password: password })
            , { headers: this.headers }).toPromise().then(response => {
                if (response.status == 200) {
                    let token = response.json() && response.json().token;
                    this.token = token;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
                    return true;
                }

                else
                    return false;
            }).catch((error: any) => {
                return false;
            }
            );
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }

    signup(username: string, password: string, email: string): Promise<any> {
        return this.http.post(this.url + '/registration/signup'
            , JSON.stringify({ username: username, password: password, email: email })
            , { headers: this.headers })
            .toPromise()
            .then(response => response.text())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}