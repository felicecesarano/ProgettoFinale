import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogue-serie-a',
  templateUrl: './catalogue-serie-a.component.html',
  styleUrls: ['./catalogue-serie-a.component.scss']
})
export class CatalogueSerieAComponent {
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
