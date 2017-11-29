import { Component, OnInit } from '@angular/core';
import { Board } from './board';
import { BoardColumn } from './boardcolumn';
import { BoardService } from './board.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BoardTask } from '../task/boardtask';
import { User } from '../users/user';
import { UserService } from '../users/user.service';

@Component({
  selector: 'kan-board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit {

  board: Board;
  boardColumns: BoardColumn[];
  draggedTask: BoardTask;
  display = false;
  selectedTask: BoardTask;
  tasks: BoardTask[] = [];
  taskHeader = 'Edit task';
  filteredUsers: User[] = [];
  user: any;

  constructor(private boardService: BoardService, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
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

  showTask(t: BoardTask) {
    this.display = true;
    this.selectedTask = t;
  }

  filterUsers(event) {
    this.userService.getUsersByUsernameAndBoardId(event, this.board.id)
    .then(response => {
      this.filteredUsers = response;
    })
  }

  addTask() {
    this.display = true;
    this.taskHeader = 'Add task';
    this.selectedTask = new BoardTask();
  }

  closeTask() {
    this.display = false;
  }

  saveTask() {
    this.display = false;;
  }

  dragStart(event, t: BoardTask) {
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

  findIndex(t: BoardTask) {
    let index = -1;
    for (let i = 0; i < this.tasks.length; i++) {
      if (t.boardColumnId === this.tasks[i].boardColumnId) {
        index = i;
        break;
      }
    }
    return index;
  }

  edit() {
    this.router.navigate(['/manage-board', this.board.id]);
  }

}
