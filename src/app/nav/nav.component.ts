import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'kan-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  items: MenuItem[];
  
      ngOnInit() {
          this.items = [
              {label: "Dashboard"},
              {label: "Users", routerLink: "/users"}
          ];
      }
}
