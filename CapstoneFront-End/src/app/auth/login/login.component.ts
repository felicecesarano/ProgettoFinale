import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  log = {
    email: '',
    password: ''
  };

  constructor(private authSrv: AuthService, private router: Router) { }

  login(): void {
    this.authSrv.login(this.log).subscribe(
      (response) => {
        if (response.accessToken) {
          this.authSrv.setToken(response.accessToken);
          this.router.navigate(['/']); // Redirect to home page or desired route
        }
      },
      (error) => {
        console.error('Errore di autenticazione:', error);
      }
    );
  }
}
