import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common'; 
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-choose-service-page',
  standalone: true,
  imports: [CommonModule, NgStyle],
  templateUrl: './choose-service-page.component.html',
  styleUrl: './choose-service-page.component.css'
})
export class ChooseServicePageComponent {
  selectedButton: string | null = null;
  clientId: string;

  buttons = [
    { emojis: ['🛠'], size: 150, position: { x: 0, y: 0 }, label: 'Réparations et entretien' }, 
    { emojis: ['🚌'], size: 90, position: { x: -120, y: -120 }, label: 'Déménagement' },
    { emojis: ['🧹', '👩‍🌾', '🌻'], size: 130, position: { x: 120, y: -120 }, label: 'Maison et aménagement' }, // Smaller size
    { emojis: ['🩺', '💉', '💊'], size: 120, position: { x: -120, y: 120 }, label: 'Santé' }, 
    { emojis: ['💇‍♀️', '💅', '💆‍♀️'], size: 110, position: { x: 120, y: 120 }, label: 'Beauté' }, 
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Client ID:', this.clientId);
  }

  onButtonClick(label: string) {
    this.selectedButton = this.selectedButton === label ? null : label;
    if (this.selectedButton) {
      this.router.navigate(['/client/top-bar-home'], {
        queryParams: {
          clientId: this.clientId,
          category: label
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    this.router.navigate(['/login']);
  }

  getEmojiPosition(index: number, total: number, size: number): { left: string, top: string } {
    const radius = total === 3 ? size / 4 : size / 3; // Smaller radius for 3 emojis
    const angle = (2 * Math.PI * index) / total;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
  
    return {
      left: `${size / 2 + x - 20}px`, 
      top: `${size / 2 + y - 20}px`, 
    };
  }
}