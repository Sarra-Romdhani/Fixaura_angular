import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() currentIndex: number = 0;
  @Input() unreadMessagesCount: number = 0;
  @Input() userId: string = '';

  constructor(private router: Router) {}
@Input() loggedId: string = ''; // Add input for loggedId
  onItemTapped(index: number): void {
    if (index === this.currentIndex) return;
    
    const routes = [
      `/home/${this.loggedId}`,
      `/messages/${this.loggedId}`,
      `/reservations/${this.loggedId}`,
      `/profile/${this.loggedId}`
    ];

    if (index === 3 && !this.loggedId) {
      this.router.navigate(['/login']);
      return;
    }
this.router.navigate([routes[index]], { queryParams: { loggedId: this.loggedId } });   // this.router.navigate([routes[index]]);
  }
}