import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SingupComponent {
  sign = {
    nome: '',
    cognome: '',
    email: '',
    password: ''
  };

  constructor(private authSrv: AuthService, private router: Router) {}

  signup(): void {
    this.authSrv.signup(this.sign).subscribe(
      (response) => {
        console.log('Registrazione avvenuta con successo:', response);
        this.router.navigate(['/login']);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.error('Errore durante la registrazione:', error.error);
          // Esempio: Mostra un messaggio di errore all'utente
          alert('Errore durante la registrazione: ' + error.error.message);
        } else {
          console.error('Errore imprevisto durante la registrazione:', error);
        }
      }
    );
  }
}
