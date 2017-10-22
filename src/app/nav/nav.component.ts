import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'kan-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {

  items: MenuItem[];
  
      ngOnInit() {
          this.items = [
              {label: "Home", routerLink: "/home"},
              {label: "Dashboard", routerLink: "/dashboard"},
              {label: "Users", routerLink: "/users"}
          ];
      }
}
