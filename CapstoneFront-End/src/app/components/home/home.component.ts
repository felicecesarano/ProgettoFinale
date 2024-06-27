import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userName: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userName = this.authService.getUserName();
  }
}
