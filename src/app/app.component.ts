import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChooseServicePageComponent } from './fixaura/choose-service-page/choose-service-page.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChooseServicePageComponent], // Import the component here
  template: `<app-choose-service-page></app-choose-service-page>`,
})
export class AppComponent {
  title = 'fixaura';
}
