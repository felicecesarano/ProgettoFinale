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
          this.setUser(response.utente); // Salva l'oggetto utente completo
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

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  setUserName(name: string): void {
    localStorage.setItem('userName', name);
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utenti`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/utenti/${userId}`);
  }

  updateUserRole(userId: number, role: string): Observable<any> {
    const formData = new FormData();
    formData.append('role', role);
    return this.http.put<any>(`${this.apiUrl}/utenti/${userId}/role`, formData);
  }
  
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
  }
}
