import { Component, OnInit } from '@angular/core';
import { Board } from './board';
import { BoardColumn } from './boardcolumn';
import { BoardService } from './board.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BoardTask } from '../task/boardtask';
import { User } from '../users/user';
import { UserService } from '../users/user.service';
import { BoardTaskService } from '../task/boardtask.service';

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
  assignee: User;
  dueDate: Date;

  constructor(private taskService: BoardTaskService, private boardService: BoardService, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

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
      this.taskService.getTasksByBoardId(this.board.id)
        .then(response => {
          this.tasks = response;
        });
    });
  }

  showTask(t: BoardTask) {
    this.selectedTask = t;
    
    if(t.dueDate == null)
    this.dueDate = null;
    else
    this.dueDate = new Date(t.dueDate);
    
    this.filterUsers(t.assignee);
    this.assignee = new User();
    this.assignee.username = t.assignee;
    this.display = true;
  }

  submitTask() {
    if (this.selectedTask.id == null) {
      this.selectedTask.dueDate = this.dueDate;
      this.selectedTask.assignee = this.assignee.username;
      this.selectedTask.boardId = this.board.id;
      this.taskService.create(this.selectedTask).then(response => {
        let task: BoardTask = response;
        this.tasks.push(task);
        this.display = false;
      });
    }
    else {
      this.selectedTask.dueDate = this.dueDate;
      this.selectedTask.assignee = this.assignee.username;
      this.taskService.update(this.selectedTask).then(response => {
        let task: BoardTask = response;
        this.tasks.forEach((t, index) => {
          if (t.id == task.id) {
            this.tasks[index] = task;
          }
          this.display = false;
        });
      });
    }

  }

  filterUsers(event) {
    if (event != '') {
      this.userService.getUsersByUsernameAndBoardId(event, this.board.id)
        .then(response => {
          this.filteredUsers = response;
        })
    }
  }

  addTask(boardColumnId: number) {
    this.display = true;
    this.taskHeader = 'Add task';
    this.selectedTask = new BoardTask();
    this.selectedTask.boardColumnId = boardColumnId;
    this.assignee = new User();
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
      // this.draggedTask.boardColumnId = bc.id;
      // let draggedTaskIndex = this.findIndex(this.draggedTask);
      // this.tasks = [...this.tasks, this.draggedTask];
      // this.tasks = this.tasks.filter((val, i) => i != draggedTaskIndex);
      this.tasks.forEach((task, index) => {
        if (task.id == this.draggedTask.id)
          this.tasks[index].boardColumnId = bc.id;
      });
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
