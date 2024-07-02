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
        if (response.accessToken && response.utente) {
          this.authSrv.setToken(response.accessToken);
          const role = response.utente.role;

          if (role === 'User' || role === 'Admin') {
            // Puoi fare ulteriori azioni in base al ruolo se necessario
            console.log('Utente autenticato con ruolo:', role);

            this.authSrv.setUserName(response.utente.nome);
            this.router.navigate(['/']); // Redirect to home page or desired route
          } else {
            console.error('Utente non autorizzato.');
            // Gestire l'autenticazione fallita o reindirizzare a una pagina di errore
          }
        }
      },
      (error) => {
        console.error('Errore di autenticazione:', error);
      }
    );
  }
}
