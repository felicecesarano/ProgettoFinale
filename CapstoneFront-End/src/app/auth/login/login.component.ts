import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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
        if (response.accessToken && response.utente) {
          this.authSrv.setToken(response.accessToken);
          this.authSrv.setUser(response.utente);
          const role = response.utente.role;

          if (role === 'User' || role === 'Admin') {
            console.log('Utente autenticato con ruolo:', role);
            this.authSrv.setUserName(response.utente.nome);
            this.router.navigate(['/']);
          } else {
            console.error('Utente non autorizzato.');
          }
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          alert('Errore di autenticazione: Email o password errata.');
        } else if (error.status === 404) {
          alert('Errore di autenticazione: Email non registrata.');
        } else {
          alert('Errore di autenticazione: Si è verificato un errore imprevisto.');
        }
        console.error('Errore di autenticazione:', error);
      }
    );
  }
}
