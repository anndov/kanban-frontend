import { Component } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Board } from '../board/board';
import { BoardService } from '../board/board.service';
import { BoardColumn } from '../board/boardcolumn';
import { User } from '../users/user';
import { Router } from '@angular/router';

@Component({
  selector: 'kan-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent {
  
  items: MenuItem[];

  boards: Board[] = [];

  boardItems: any[] = [];

  currentUser;

  constructor(private boardService: BoardService, private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).username;

    this.boardService.getBoards().then(response => {
      this.boards = response as Board[];
      for (let b of this.boards) {
        this.boardItems.push({
          label: b.name, command: (event: Event) => {
            this.router.navigate(['/board', b.id]);
          }
        });
      }
      this.boardItems.push({
        label: "Create board", icon: "fa-plus", command: (event: Event) => {
          this.router.navigate(['/manage-board', 0]);
        }
      });
      this.items = [
        { label: "Home", routerLink: "/home" },
        { label: "Select board", items: this.boardItems },
        { label: "Users", routerLink: "/users" }
      ];
    });
  }
}
