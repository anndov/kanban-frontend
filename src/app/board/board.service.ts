import { Injectable } from "@angular/core";
import { AbstractService } from "../_services/abstract.service";
import { Router } from "@angular/router";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Board } from "./board";
import { Constants } from "../_confs/constants";
import { AuthenticationService } from "../_services/authentication.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class BoardService {

    private headers = new Headers();
    private boardsURL = Constants.URL + '/boards';

    constructor(private router: Router, private http: Http, private authenticationService: AuthenticationService) {
        this.headers.append('Content-Type', 'application/json; charset=utf-8');
        this.headers.append('Access-Control-Allow-Origin', '*');
        this.headers.append('Authorization', 'Bearer ' + this.authenticationService.token);
    }

    getBoards(): Promise<Board[]> {
        const url = this.boardsURL + '/username/' + JSON.parse(localStorage.getItem('currentUser')).username;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(response => response.json() as Board[])
        .catch(this.handleError);
    }

    getBoardById(id: number): Promise<Board> {
        const url = this.boardsURL + '/' + id;
        return this.http.get(url, { headers:this.headers })
        .toPromise()
        .then(response => response.json() as Board)
        .catch(this.handleError);
    }

    // getBoardsByParticipantId(): Promise<Board[]> {
    //     const url = this.boardsURL + '/username/' + JSON.parse(localStorage.getItem('currentUser')).username;
    //     return this.http.get(url, { headers: this.headers })
    //         .toPromise()
    //         .then(response => {
    //             return response.json() as Board[];
    //         })
    //         .catch(this.handleError);
    // }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}