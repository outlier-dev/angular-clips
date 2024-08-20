import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root', templateUrl: './app.component.html', styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'clips-no-ssr';

  constructor(public auth: AuthService) {
  }

  ngOnInit() {
  }
}
