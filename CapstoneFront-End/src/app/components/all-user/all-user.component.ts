import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.scss']
})
export class AllUserComponent implements OnInit {
  users: any[] = []; // Array per contenere gli utenti

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data: any[]) => {
        this.users = data;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  confirmDelete(userId: number): void {
    // Mostra un alert di conferma prima di procedere con l'eliminazione
    const result = window.confirm('Sei sicuro di voler eliminare questo utente?');
    if (result) {
      this.authService.deleteUser(userId).subscribe(
        response => {
          console.log(`Utente con ID ${userId} eliminato con successo`);
          // Rimuovi l'utente dall'array users localmente
          this.users = this.users.filter(user => user.id !== userId);
        },
        error => {
          console.error(`Errore durante l'eliminazione dell'utente con ID ${userId}:`, error);
        }
      );
    }
  }

  changeUserRole(userId: number, role: string): void {
    this.authService.updateUserRole(userId, role).subscribe(
      response => {
        console.log(`Ruolo dell'utente con ID ${userId} cambiato a ${role} con successo`);
        // Aggiorna il ruolo dell'utente nell'array users localmente
        const updatedUserIndex = this.users.findIndex(user => user.id === userId);
        if (updatedUserIndex !== -1) {
          this.users[updatedUserIndex].role = role;
        }
        // Forza l'aggiornamento della vista
        this.cdr.detectChanges();
      },
      error => {
        console.error(`Errore durante il cambio di ruolo dell'utente con ID ${userId}:`, error);
      }
    );
  }
}
