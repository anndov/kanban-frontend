import { Component, OnInit } from '@angular/core';
import { BoardColumn } from './boardcolumn';
import { Board } from './board';

@Component({
  selector: 'kan-manage-board',
  templateUrl: './manage-board.component.html'
})
export class ManageBoardComponent {

  board: Board;
  boardColumns = [
    new BoardColumn(null, "To-do", null, 1),
    new BoardColumn(null,  "In progress", null, 2),
    new BoardColumn(null, "Done", null, 3)
  ];
  constructor() {
     this.board = new Board(null, '', null, null, this.boardColumns);
   }

  onSubmit() {
    
  }

  removeColumn(columnOrder: number) {
    let removed = false;
    for(let c of this.boardColumns) {
      var index = this.boardColumns.indexOf(c);
      if(removed) {
        this.boardColumns[index].columnOrder = this.boardColumns[index].columnOrder - 1;
      }
      if(c.columnOrder == columnOrder) {
        if(this.boardColumns.length > 1) {
          this.boardColumns.splice(index, 1);
        removed = true;
        }
      }
    }
  }

  addColumn() {
    this.boardColumns.push(new BoardColumn(null, "", null, this.boardColumns.length + 1));
  }

}
