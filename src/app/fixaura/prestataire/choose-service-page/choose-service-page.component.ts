import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common'; // Import NgStyle

@Component({
  selector: 'app-choose-service-page',
  standalone: true,
  imports: [CommonModule, NgStyle],
  templateUrl: './choose-service-page.component.html',
  styleUrl: './choose-service-page.component.css'
})
export class ChooseServicePageComponent {
  selectedButton: string | null = null;

  buttons = [
    { emojis: ['🛠'], size: 150, position: { x: 0, y: 0 }, label: 'Réparations' }, // Smaller size
    { emojis: ['🚌'], size: 90, position: { x: -120, y: -120 }, label: 'Transport' }, // Smaller size
    { emojis: ['🧹', '👩‍🌾', '🌻'], size: 130, position: { x: 120, y: -120 }, label: 'Maison' }, // Smaller size
    { emojis: ['🩺', '💉', '💊'], size: 120, position: { x: -120, y: 120 }, label: 'Santé' }, // Smaller size
    { emojis: ['💇‍♀️', '💅', '💆‍♀️'], size: 110, position: { x: 120, y: 120 }, label: 'Beauté' }, // Smaller size
  ];

  onButtonClick(label: string) {
    this.selectedButton = this.selectedButton === label ? null : label;
    // Removed the alert popup
  }

  getEmojiPosition(index: number, total: number, size: number): { left: string, top: string } {
    // Reduce the radius for buttons with 3 emojis to bring them closer
    const radius = total === 3 ? size / 4 : size / 3; // Smaller radius for 3 emojis
    const angle = (2 * Math.PI * index) / total;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
  
    return {
      left: `${size / 2 + x - 20}px`, // Adjusted positioning
      top: `${size / 2 + y - 20}px`, // Adjusted positioning
    };
  }
}
