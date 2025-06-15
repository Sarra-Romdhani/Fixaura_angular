import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-discuter-avec-ai',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './discuter-avec-ai.component.html',
  styleUrls: ['./discuter-avec-ai.component.css']
})
export class DiscuterAvecAiComponent {
  searchQuery: string = '';

  constructor(private router: Router) {}


  startChatting() {
    console.log('Start chatting clicked');
  }
}