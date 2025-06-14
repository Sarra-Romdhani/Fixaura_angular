import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BottomNavigationBarClientComponent } from './bottom-navigation-bar-client/bottom-navigation-bar-client.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, RouterModule, BottomNavigationBarClientComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

}
