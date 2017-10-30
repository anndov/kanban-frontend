import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'kan-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {

  items: MenuItem[];

  currentUser;

  constructor(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
  }
  
      ngOnInit() {
          this.items = [
              {label: "Home", routerLink: "/home"},
              {label: "Select board", items:[
                {label: "My board", routerLink:"/board"},
                {label: "Create board", icon: "fa-plus", routerLink:"/manage-board"}
              ]},
              {label: "Users", routerLink: "/users"}
          ];
      }
}
