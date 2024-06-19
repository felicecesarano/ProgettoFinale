import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogue-la-liga',
  templateUrl: './catalogue-la-liga.component.html',
  styleUrls: ['./catalogue-la-liga.component.scss']
})
export class CatalogueLaLigaComponent {
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
