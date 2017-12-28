import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { AuthGuard } from './_guards/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { BoardComponent } from './board/board.component';
import { ManageBoardComponent } from './board/manage-board.component';
import { ChangePasswordComponent } from './users/change-password.component';
import { UpdateProfileComponent } from './users/update-profile.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: 'update-profile', component: UpdateProfileComponent, canActivate: [AuthGuard] },
    { path: 'board/:id', component: BoardComponent, canActivate: [AuthGuard] },
    { path: 'manage-board/:id', component: ManageBoardComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
function newFunction(): string {
    return 'board';
}
