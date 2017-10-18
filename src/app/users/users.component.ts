import { Component, OnInit, Input, Output } from '@angular/core';
import { Response } from '@angular/http';
import { UserService } from './user.service';
import { User } from './user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent } from 'primeng/primeng';

@Component({
  selector: 'kan-users',
  templateUrl: './users.component.html',
  providers: [UserService]
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  display: boolean = false;
  user: User;
  selectedUser: User;
  newUser: boolean;
  totalRecords: number;
  roles: string[];

  constructor(private userService: UserService, private confirmationService: ConfirmationService) { }

  save() {
    if (this.newUser) {
      this.user.enabled = true;
      this.userService.create(this.user).then(user => {
        this.user = user;
        this.users.push(user);
        this.totalRecords++;
      });
    }
    else
      this.userService.update(this.user).then(user => {
        this.users[this.findSelectedUserIndex()] = user;
      });
    this.display = false;
  }

  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        let index = this.findSelectedUserIndex();
        this.users.splice(index, 1);
        this.userService.delete(this.user.id);
        this.totalRecords--;
        this.user = null;
        this.display = false;
      },
      reject: () => {

      }
    });
  }

  onRowSelect(event) {
    this.newUser = false;
    this.user = this.cloneUser(event.data);
    this.display = true;
  }

  cloneUser(u: User): User {
    let user = new User();
    for (let prop in u) {
      user[prop] = u[prop];
    }
    return user;
  }

  loadUsersLazy(event: LazyLoadEvent) {
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    //imitate db connection over a network
    setTimeout(() => {
      this.userService.getUsers((event.first / 5), event.rows).then(res => {
        let page: any[] = res;
        this.users = page[0] as User[];
      });
    }, 250);
  }

  ngOnInit() {
    this.userService.getUsers(0, 5).then(res => {
      let page: any[] = res;
      this.users = page[0] as User[];
      this.totalRecords = page[1];
    });
  }

  findSelectedUserIndex(): number {
    return this.users.indexOf(this.selectedUser);
  }

  showDialogToAdd() {
    this.newUser = true;
    this.user = new User();
    this.display = true;
  }

}
