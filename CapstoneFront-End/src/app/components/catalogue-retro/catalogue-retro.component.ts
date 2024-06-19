import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogue-retro',
  templateUrl: './catalogue-retro.component.html',
  styleUrls: ['./catalogue-retro.component.scss']
})
export class CatalogueRetroComponent {
  openModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');
    }
  }

  closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('role');
    }
  }
}
