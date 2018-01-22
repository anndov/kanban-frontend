import { Component, OnInit, DoCheck, AfterViewChecked, AfterViewInit, AfterContentChecked, AfterContentInit, OnChanges } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Board } from '../board/board';
import { BoardService } from '../board/board.service';
import { BoardColumn } from '../board/boardcolumn';
import { User } from '../users/user';
import { Router } from '@angular/router';
import { Authority } from '../users/Authority';
import { NavService } from '../_services/nav.service';

@Component({
  selector: 'kan-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {

  items: MenuItem[];
  boards: Board[] = [];
  boardItems: any[] = [];
  currentUser;
  authorities: Authority[];
  isAdmin = false;

  constructor(private boardService: BoardService) {
  }

  ngOnInit(): void {
    this.authorities = JSON.parse(localStorage.getItem("currentRoles"));
    if (this.authorities != null)
      this.authorities.forEach(auth => {
        if (auth.name == 'ROLE_ADMIN')
          this.isAdmin = true;
      });
    this.loadNav();
    
  }

  loadNav() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).username;

    this.boardService.getBoards().then(response => {
      this.boards = response as Board[];
      for (let b of this.boards) {
        this.boardItems.push({
          label: b.name, routerLink: ['/board', b.id]
        });
      }
      this.boardItems.push({
        label: "Create board", icon: "fa-plus", routerLink: ['/manage-board', 0]
      });
      this.items = [
        { label: "Select board", items: this.boardItems },
        {
          label: "Settings", items: [
            { label: "Change password", routerLink: "/change-password" },
            { label: "Update profile", routerLink: "/update-profile" }
          ]
        },
        { label: "Users", routerLink: "/users", visible: this.isAdmin }
      ];
    });
  }
}
