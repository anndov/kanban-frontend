import { Component, OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { BoardService } from './board/board.service';

@Component({
  selector: 'kan-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements DoCheck {
  
  ngDoCheck(): void {
    if (this.authenticationService.token != null) {
      this.isLoggedIn = true;
    }
    else {
      this.isLoggedIn = false;
    }
  }
  
  isLoggedIn;
  constructor(private boardService: BoardService, private authenticationService: AuthenticationService) { }
}
