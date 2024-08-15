import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router) { }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');  // Check if a token exists in localStorage
  }

  logout() {
    localStorage.removeItem('token');  // Remove token on logout
    this.router.navigate(['/login']);  // Redirect to login page after logout
  }
}
