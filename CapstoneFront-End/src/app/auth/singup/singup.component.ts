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
        this.router.navigate(['/login']);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.error('Accesso negato:', error);
        } else {
          console.error('Errore durante la registrazione:', error);
        }
      }
    );
  }
}
