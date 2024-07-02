import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(data: { email: string, password: string }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/login`, data, { headers }).pipe(
      tap(response => {
        console.log('Login response:', response); // Log della risposta per debug
        if (response.accessToken && response.utente) {
          this.setToken(response.accessToken);
          this.setUserName(response.utente.nome); // Imposta il nome dell'utente
        }
      })
    );
  }

  signup(data: { password: string, nome: string, cognome: string, email: string }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/signup`, data, { headers });
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setUserName(name: string): void {
    localStorage.setItem('userName', name);
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
  }
}