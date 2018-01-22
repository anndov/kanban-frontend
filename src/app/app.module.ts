import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { routing } from './app.routing';

import { MenubarModule, ButtonModule, DataListModule
       , DataTableModule, SharedModule, DialogModule,
         InputTextModule, PasswordModule, ConfirmDialogModule
         , ConfirmationService, LazyLoadEvent, PanelModule
         , AutoCompleteModule, DragDropModule, CalendarModule
         , InputTextareaModule, ColorPickerModule, MessagesModule
         , MessageModule, GrowlModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { UsersComponent } from './users/users.component';
import { UserService } from './users/user.service';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './_services/authentication.service';
import { AuthGuard } from './_guards/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { BoardComponent } from './board/board.component';
import { ManageBoardComponent } from './board/manage-board.component';
import { BoardService } from './board/board.service';
import { BoardTaskService } from './task/boardtask.service';
import { InviteTokenService } from './invitetoken/invitetoken.service';
import { BoardColumnService } from './board/boardcolumn.service';
import { ChangePasswordComponent } from './users/change-password.component';
import { UpdateProfileComponent } from './users/update-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    UsersComponent,
    LoginComponent,
    SignupComponent,
    BoardComponent,
    ManageBoardComponent,
    ChangePasswordComponent,
    UpdateProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    routing,
    MenubarModule, ButtonModule, DataListModule, DataTableModule,SharedModule, DialogModule,
    InputTextModule, PasswordModule, ConfirmDialogModule, PanelModule, AutoCompleteModule, 
    DragDropModule, CalendarModule, InputTextareaModule, ColorPickerModule, MessagesModule, 
    MessageModule, GrowlModule
  ],
  providers: [ BoardColumnService, InviteTokenService, ConfirmationService, AuthenticationService, UserService, AuthGuard, BoardService, BoardTaskService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
