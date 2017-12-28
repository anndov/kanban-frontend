import { Component, OnInit, NgZone } from '@angular/core';
import { Board } from './board';
import { BoardColumn } from './boardcolumn';
import { BoardService } from './board.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BoardTask } from '../task/boardtask';
import { User } from '../users/user';
import { UserService } from '../users/user.service';
import { BoardTaskService } from '../task/boardtask.service';
import { ConfirmationService, Message } from 'primeng/primeng';
import { InviteTokenService } from '../invitetoken/invitetoken.service';
import { BoardColumnService } from './boardcolumn.service';

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
  boardMembersDisplay = false;
  invitedMembersDisplay = false;
  members: User[];
  inviteLabel: '';
  memberEmail: '';
  invitedMembers: string[];
  isOwner = false;
  username: string;
  userInfo: string;
  msgs: Message[] = [];

  constructor(private taskService: BoardTaskService, private boardService: BoardService
    , private route: ActivatedRoute, private router: Router, private userService: UserService
    , private confirmationService: ConfirmationService, private inviteTokenService: InviteTokenService
    , private boardColumnService: BoardColumnService) { }

  
    ngOnInit(): void {
    this.route.params
      .subscribe(params => this.handleRouteChange(params));
  }

  delete() {
    this.confirmationService.confirm({
      header: 'Delete board',
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
          this.boardService.delete(this.board.id);
          this.router.navigate(['/']);
      }
  });
  }

  handleRouteChange(params) {
    this.boardService.getBoardById(Number(params['id'])).then(response => {
      this.board = response;
      this.username = JSON.parse(localStorage.getItem("currentUser")).username;
      if (this.board.owner.username == this.username)
        this.isOwner = true;
      if (this.board.owner.firstname != null || this.board.owner.lastname != null)
        this.userInfo = this.board.owner.firstname + ' ' + this.board.owner.lastname;
      else
        this.userInfo = this.username;
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

      this.userService.getUsersByBoardId(this.board.id)
        .then(response => this.members = response);

    });
  }

  inviteMember() {
    this.inviteTokenService.sendInvitation(this.memberEmail, this.board.id);
    this.memberEmail = '';
  }

  showMembers() {
    this.invitedMembersDisplay = true;
    this.inviteTokenService.getInvitedMembers(this.board.id).then(response => {
      this.invitedMembers = response;
    });
  }

  boardMembers() {
    this.boardMembersDisplay = true;
  }

  setStyles(task: BoardTask) {
    let styles = {
      'background': task.color
    };
    return styles;
  }

  showTask(t: BoardTask) {
    this.selectedTask = t;
    this.selectedTask.dueDate = new Date(this.selectedTask.dueDate);
    this.filterUsers(t.assignee);
    this.assignee = new User();
    this.assignee.username = t.assignee;
    this.display = true;
  }

  submitTask() {
    this.boardColumns.forEach(bc => {
      if(bc.id == this.selectedTask.boardColumnId) {
        if(bc.current <= bc.max || bc.max == null) {
          if (this.selectedTask.id == null) {
            bc.current = bc.current + 1;
            this.boardColumnService.update(bc);
            this.boardColumns[this.findIndexBoardColumn(bc)] = bc;
            this.selectedTask.assignee = this.assignee.username;
            this.taskService.create(this.selectedTask).then(response => {
              let task: BoardTask = response;
              this.tasks.push(task);
              this.display = false;
            });
          }
          else {
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
      }
    });

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

  closeMembersDisplay() {
    this.boardMembersDisplay = false;
  }

  dragStart(event, t: BoardTask) {
    this.draggedTask = t;
  }

  drop(event, bc: BoardColumn) {
    if(bc.current != bc.max) {
      bc.current = bc.current + 1;
      this.boardColumnService.update(bc);
      this.boardColumns[this.findIndexBoardColumn(bc)] = bc;
      console.log(this.boardColumns);
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
    else {
      this.msgs = [{severity:'info', summary:'Limit', detail:'Column task limit reached'}];
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

  findIndexBoardColumn(t: BoardColumn) {
    let index = -1;
    for (let i = 0; i < this.boardColumns.length; i++) {
      if (t.id === this.boardColumns[i].id) {
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
