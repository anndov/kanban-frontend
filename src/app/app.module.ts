import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { MenubarModule, ButtonModule, DataListModule
       , DataTableModule, SharedModule, DialogModule,
         InputTextModule, PasswordModule, ConfirmDialogModule
         , ConfirmationService, LazyLoadEvent } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { UsersComponent } from './users/users.component';

import { UserService } from './users/user.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: 'users', component: UsersComponent}
    ]),
    MenubarModule, ButtonModule, DataListModule, DataTableModule,SharedModule, DialogModule,
    InputTextModule, PasswordModule, ConfirmDialogModule
  ],
  providers: [ UserService, ConfirmationService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
