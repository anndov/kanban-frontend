import { Component, OnInit } from '@angular/core';
import { BoardColumn } from './boardcolumn';
import { Board } from './board';
import { BoardService } from './board.service';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kan-manage-board',
  templateUrl: './manage-board.component.html'
})
export class ManageBoardComponent implements OnInit {

  board: Board;
  boardColumns = [];

  constructor(private route: ActivatedRoute, private boardService: BoardService, private userService: UserService) {
    this.board = new Board(null, '', null, null, this.boardColumns);
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') != '0') {
      this.boardService.getBoardById(Number(this.route.snapshot.paramMap.get('id'))).then(response => {
        this.board = response;
        this.boardColumns = this.board.boardColumns.sort((a: BoardColumn, b: BoardColumn) => {
          if (a.columnOrder < b.columnOrder) {
            return -1;
          }
          if (a.columnOrder > b.columnOrder) {
            return 1;
          }

          return 0
        });
      });
    }
    else {
      this.boardColumns = [
        new BoardColumn(null, "To-do", null, 1),
        new BoardColumn(null, "In progress", null, 2),
        new BoardColumn(null, "Done", null, 3)
      ];
    }
  }

  onSubmit() {
    this.board.boardColumns = [];
    this.board.boardColumns = this.boardColumns;
    this.userService.getByAuthenticatedUser().then(response => {
      if (this.board.id == null) {
        this.board.participants = [];
        this.board.participants.push(response);
        this.board.owner = response;
        this.boardService.create(this.board)
          .then(response => {
            this.board = response;
            this.boardColumns = this.board.boardColumns.sort((a: BoardColumn, b: BoardColumn) => {
              if (a.columnOrder < b.columnOrder) {
                return -1;
              }
              if (a.columnOrder > b.columnOrder) {
                return 1;
              }
    
              return 0
            });
          });
      }
      else {
        this.boardService.update(this.board)
          .then(response => {
            this.board = response;
            this.boardColumns = this.board.boardColumns.sort((a: BoardColumn, b: BoardColumn) => {
              if (a.columnOrder < b.columnOrder) {
                return -1;
              }
              if (a.columnOrder > b.columnOrder) {
                return 1;
              }
    
              return 0
            });
          });
      }
    });
  }

  removeColumn(columnOrder: number) {
    this.boardColumns.forEach(bc => {
      var index = this.boardColumns.indexOf(bc);
      if (bc.columnOrder == columnOrder) {
        if (this.boardColumns.length > 1) {
          this.boardColumns.splice(index, 1);
        }
      }
    });

    this.boardColumns.forEach(bc => {
      var index = this.boardColumns.indexOf(bc);
      this.boardColumns[index].columnOrder = index + 1;
    });
  }

  addColumn() {
    this.boardColumns.push(Object.assign({}, new BoardColumn(null, "", null, this.boardColumns.length + 1)));
  }

}
