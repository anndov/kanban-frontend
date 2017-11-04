import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Board } from '../board/board';
import { BoardService } from '../board/board.service';
import { BoardColumn } from '../board/boardcolumn';
import { User } from '../users/user';

@Component({
  selector: 'kan-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {

  items: MenuItem[];

  boards: Board[] = [];

  boardItems: any[] = [];

  currentUser;

  constructor(private boardService: BoardService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
    
    this.boardService.getBoards().then(response => {
      this.boards = response as Board[];
      for (let b of this.boards) {
        this.boardItems.push({ label: b.name, routerLink: "/board" });
      }
      
      this.boardItems.push({ label: "Create board", icon: "fa-plus", routerLink: "/manage-board" });
      
      this.items = [
        { label: "Home", routerLink: "/home" },
        { label: "Select board", items: this.boardItems },
        { label: "Users", routerLink: "/users" }
      ];
    });
  }

  ngOnInit(): void {
    
  }

}
