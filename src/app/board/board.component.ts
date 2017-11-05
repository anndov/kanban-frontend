import { Component, OnInit } from '@angular/core';
import { Board } from './board';
import { BoardColumn } from './boardcolumn';
import { Task } from '../task/task';
import { BoardService } from './board.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'kan-board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit {

  board: Board;
  boardColumns: BoardColumn[];

  constructor(private boardService: BoardService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.boardService.getBoardById(Number(this.route.snapshot.paramMap.get('id'))).then(response => {
      this.board = response;
      this.boardColumns = this.board.boardColumns;
    });
  }

  tasks: Task[] = [
    new Task(null, 'Name', 'Description', 1, 'red', null)
  ];
  // columns = [
  //   new BoardColumn(null, "To-do", null, 1),
  //   new BoardColumn(null, "In progress", null, 2),
  //   new BoardColumn(null, "Done", null, 3)
  // ];

  draggedTask: Task;
  display = false;
  selectedTask: Task;

  showTask(t: Task) {
    this.display = true;
    this.selectedTask = t;
  }

  closeTask() {
    this.display = false;
  }

  saveTask() {
    this.display = false;;
    console.log(this.selectedTask.name);
  }

  dragStart(event, t: Task) {
    this.draggedTask = t;
  }

  drop(event, bc: BoardColumn) {
    if (this.draggedTask) {
      this.draggedTask.boardColumnId = bc.columnOrder;
      let draggedTaskIndex = this.findIndex(this.draggedTask);
      this.tasks = [...this.tasks, this.draggedTask];
      this.tasks = this.tasks.filter((val, i) => i != draggedTaskIndex);
      this.draggedTask = null;
    }
  }

  dragEnd(event) {
    this.draggedTask = null;
  }

  findIndex(t: Task) {
    let index = -1;
    for (let i = 0; i < this.tasks.length; i++) {
      if (t.boardColumnId === this.tasks[i].boardColumnId) {
        index = i;
        break;
      }
    }
    return index;
  }

}
