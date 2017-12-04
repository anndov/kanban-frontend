import { Component, OnInit } from '@angular/core';
import { Board } from './board';
import { BoardColumn } from './boardcolumn';
import { BoardService } from './board.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BoardTask } from '../task/boardtask';
import { User } from '../users/user';
import { UserService } from '../users/user.service';
import { BoardTaskService } from '../task/boardtask.service';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'kan-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
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

  constructor(private taskService: BoardTaskService, private boardService: BoardService
    , private route: ActivatedRoute, private router: Router, private userService: UserService
    , private confirmationService: ConfirmationService) { }

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

  setStyles(task: BoardTask) {
    let styles = {
      'background': task.color
    };
    return styles;
  }

  showTask(t: BoardTask) {
    this.selectedTask = t;

    if (t.dueDate == null)
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

  addTask(boardColumnId: number) {
    this.display = true;
    this.taskHeader = 'Add task';
    this.selectedTask = new BoardTask();
    this.selectedTask.color = '#e8f0f7';
    this.selectedTask.boardColumnId = boardColumnId;
    this.selectedTask.boardId = this.board.id;
    this.assignee = new User();
  }

  deleteTask(task: BoardTask) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        let index = this.findIndex(task);
        this.tasks.splice(index, 1);
        this.taskService.deleteTask(task.id);
        this.selectedTask = null;
        this.display = false;
      },
      reject: () => {

      }
    });
  }

  filterUsers(event) {
    if (event != '') {
      this.userService.getUsersByUsernameAndBoardId(event, this.board.id)
        .then(response => {
          this.filteredUsers = response;
        })
    }
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
      this.tasks.forEach((task, index) => {
        if (task.id == this.draggedTask.id) {
          this.tasks[index].boardColumnId = bc.id;
          this.taskService.update(this.tasks[index]);
        }
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
