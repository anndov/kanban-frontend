import { Component, OnInit, Input, Output } from '@angular/core';
import { Response } from '@angular/http';
import { UserService } from './user.service';
import { User } from './user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent } from 'primeng/primeng';
import { AuthorityName } from './AuthorityName';
import { Authority } from './Authority';

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
  authorities = [
    new AuthorityName('ROLE_ADMIN','Role Admin'),
    new AuthorityName('ROLE_USER','Role User')
  ];
  // authorities = [
  //   { key: "ROLE_ADMIN", value: "Role Admin" },
  //   { key: "ROLE_USER", value: "Role User" }
  // ];
  auth: AuthorityName[];
  filteredAuthorities: AuthorityName[];

  constructor(private userService: UserService, private confirmationService: ConfirmationService) { }

  filterAuthority(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered : AuthorityName[] = [];
    for(let i = 0; i < this.authorities.length; i++) {
        let authority = this.authorities[i];
        if(authority.value.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            filtered.push(authority);
        }
    }
    this.filteredAuthorities = filtered;
}

  save() {
    if (this.newUser) {
      this.user.enabled = true;
      this.user.authorities = [];
      for(let i=0; i < this.auth.length; i++) {
        this.user.authorities.push(new Authority(this.auth[i].key));
      }
      this.userService.create(this.user).then(user => {
        this.user = user;
        this.users.push(user);
        this.totalRecords++;
      });
    }
    else {
      for(let i=0; i < this.auth.length; i++) {
        this.user.authorities.push(new Authority(this.auth[i].key));
      }
      this.userService.update(this.user).then(user => {
        this.users[this.findSelectedUserIndex()] = user;
      });
    }
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
    this.auth = [];
    for(let i = 0; i < this.user.authorities.length; i++)
      for(let k = 0; k < this.authorities.length; k++)
      if(this.user.authorities[i].name == this.authorities[k].key)
      this.auth.push(this.authorities[k]);
    
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
      this.userService.getUsers((event.first / 20), event.rows).then(res => {
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
    this.filteredAuthorities = [];
    this.auth = [];
    this.user = new User();
    this.display = true;
  }

}
