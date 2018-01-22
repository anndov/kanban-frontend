import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/primeng';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { Authority } from '../users/Authority';
import { BoardService } from '../board/board.service';

@Component({
    selector: 'kan-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    model: any = {};
    loading = false;
    error = '';
    msgs: Message[] = [];

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password).then(response => {
            if (response) {
                this.router.navigate(['/']);
                this.userService.getByAuthenticatedUser().then(res => {
                    localStorage.setItem("currentRoles", JSON.stringify(res.authorities));
                    localStorage.setItem("currentUserId", JSON.stringify(res.id));
                }
                );
            }

            else {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: '403 Forbidden', detail: 'Username or password is incorrect' });
            }
        });
    }

}
