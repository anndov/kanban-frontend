import { Component, OnInit, ViewChild } from '@angular/core';
import { BoardColumn } from './boardcolumn';
import { Board } from './board';
import { BoardService } from './board.service';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'kan-manage-board',
  templateUrl: './manage-board.component.html'
})
export class ManageBoardComponent implements OnInit {

  board: Board;
  boardColumns = [];
  msgs: Message[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private boardService: BoardService, private userService: UserService) {
    this.board = new Board(null, '', null, null, this.boardColumns);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] != '0') {
        this.boardService.getBoardById(Number(params['id'])).then(response => {
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
        this.board.name = '';
        this.boardColumns = [
          new BoardColumn(null, "To-do", null, 1),
          new BoardColumn(null, "In progress", null, 2),
          new BoardColumn(null, "Done", null, 3)
        ];
      }
    }
    );
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
            if(this.board.id != null) {
              
              this.msgs = [];
              this.msgs.push({severity:'success', summary:'Created', detail:'Board has successfully created'});
              this.router.navigate(['/manage-board', this.board.id]);
            }
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
              this.msgs = [];
              this.msgs.push({severity:'success', summary:'Created', detail:'Board has successfully updated'});
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
