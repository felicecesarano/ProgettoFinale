import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  scrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Controlla la quantità di scorrimento verticale della finestra
    if (window.scrollY > 0) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }
}
