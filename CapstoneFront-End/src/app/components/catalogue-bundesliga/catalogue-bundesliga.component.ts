import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogue-bundesliga',
  templateUrl: './catalogue-bundesliga.component.html',
  styleUrls: ['./catalogue-bundesliga.component.scss']
})
export class CatalogueBundesligaComponent {
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
