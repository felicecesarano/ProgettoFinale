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
          if (error.error.includes("Lo username è già stato preso")) {
            alert('Errore durante la registrazione: l\'email è già stata utilizzata.');
          } else {
            alert('Errore durante la registrazione: ' + error.error);
          }
        } else {
          console.error('Errore imprevisto durante la registrazione:', error);
          alert('Errore imprevisto durante la registrazione, riprovare più tardi.');
        }
      }
    );
  }
}
