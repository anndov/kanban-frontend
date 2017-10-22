import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { routing } from './app.routing';

import { MenubarModule, ButtonModule, DataListModule
       , DataTableModule, SharedModule, DialogModule,
         InputTextModule, PasswordModule, ConfirmDialogModule
         , ConfirmationService, LazyLoadEvent, PanelModule, AutoCompleteModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { UsersComponent } from './users/users.component';
import { UserService } from './users/user.service';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './_services/authentication.service';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    UsersComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    routing,
    MenubarModule, ButtonModule, DataListModule, DataTableModule,SharedModule, DialogModule,
    InputTextModule, PasswordModule, ConfirmDialogModule, PanelModule, AutoCompleteModule
  ],
  providers: [ UserService, ConfirmationService, AuthenticationService, AuthGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
