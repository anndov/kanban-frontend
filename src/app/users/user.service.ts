import { Injectable } from '@angular/core';
import { User } from './user';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { Constants } from '../_confs/constants';

@Injectable()
export class UserService {

  private headers = new Headers();
  private usersUrl = Constants.URL + '/rest/users';

  constructor(private router: Router, private http: Http, private authenticationService: AuthenticationService) {
    this.headers.append('Content-Type', 'application/json; charset=utf-8');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Authorization', 'Bearer ' + this.authenticationService.token);
  }

  delete(userid: number): Promise<void> {
    const url = `${this.usersUrl}/${userid}`;
    return this.http.delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(user: User): Promise<User> {
    return this.http.post(this.usersUrl, JSON.stringify(user), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as User)
      .catch(this.handleError);
  }

  update(user: User): Promise<User> {
    return this.http.put(this.usersUrl, JSON.stringify(user), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as User)
      .catch(this.handleError);
  }

  getUsers(page: number, size: number): Promise<User[]> {
    let pages: any[] = [];
    const url = `${this.usersUrl}?page=${page}&size=${size}`;
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => {
        pages[0] = res.json().content as User[];
        pages[1] = res.json().totalElements as number;
        return pages;
      })
      .catch(this.handleError);
  }

  getUsersByUsernameAndBoardId(username: string, boardId: number): Promise<User[]> {
    let url = this.usersUrl + '/username/' + username + '/board-id/' + boardId;

    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  getUsersByBoardId(boardId: number): Promise<User[]> {
    let url = this.usersUrl + '/board-id/' + boardId;

    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  getByAuthenticatedUser(): Promise<User> {
    let url = this.usersUrl + '/' + JSON.parse(localStorage.getItem('currentUser')).username;
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  changePassword(id: number, oldPassword: string, newPassword: string): Promise<boolean> {
    return this.http.patch(this.usersUrl + '/password-change/' + id,
      JSON.stringify({ "oldPassword": oldPassword, "newPassword": newPassword }),
      { headers: this.headers })
      .toPromise().then(res => {
        return true;
      }
      ).catch((error: any) => {
        return false;
      }
      );
  }

  updateProfile(id: number, firstName: string, lastName: string) {
    this.http.patch(this.usersUrl + '/update-profile/' + id, 
    JSON.stringify({"firstName": firstName, "lastName": lastName}), {headers: this.headers})
    .toPromise()
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
