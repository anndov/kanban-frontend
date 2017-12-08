import { Injectable } from "@angular/core";
import { Constants } from "../_confs/constants";
import { Http, Headers } from "@angular/http";
import { Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { BoardTask } from "./boardtask";

@Injectable()
export class BoardTaskService {

    private headers = new Headers();
    private tasksUrl = Constants.URL + '/rest/tasks';

    constructor(private router: Router, private http: Http, private authenticationService: AuthenticationService) {
        this.headers.append('Content-Type', 'application/json; charset=utf-8');
        this.headers.append('Access-Control-Allow-Origin', '*');
        this.headers.append('Authorization', 'Bearer ' + this.authenticationService.token);
    }

    create(boardTask: BoardTask): Promise<BoardTask> {
        return this.http.post(this.tasksUrl, JSON.stringify(boardTask), { headers: this.headers })
            .toPromise()
            .then(response => response.json() as BoardTask)
            .catch(this.handleError);
    }

    update(boardTask: BoardTask): Promise<BoardTask> {
        return this.http.put(this.tasksUrl, JSON.stringify(boardTask), { headers: this.headers })
            .toPromise()
            .then(response => response.json() as BoardTask)
            .catch(this.handleError);
    }

    deleteTask(id: number): Promise<void> {
        return this.http.delete(this.tasksUrl + '/' + id, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    getTasksByBoardColumnId(boardColumnId: number): Promise<BoardTask[]> {
        return this.http.get(this.tasksUrl + '/board-column-id/' + boardColumnId, { headers: this.headers })
            .toPromise()
            .then(response => response.json().content as BoardTask[])
            .catch(this.handleError);
    }

    getTasksByBoardId(boardId: number): Promise<BoardTask[]> {
        return this.http.get(this.tasksUrl + '/board-id/' + boardId, { headers: this.headers })
            .toPromise()
            .then(response => response.json().content as BoardTask[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}