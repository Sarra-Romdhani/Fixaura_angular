// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatCardModule } from '@angular/material/card';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { ThemeService } from './services/theme.service';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     FormsModule,
//     ReactiveFormsModule,
//     MatToolbarModule,
//     MatButtonModule,
//     MatIconModule,
//     MatCardModule,
//     MatSnackBarModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatProgressSpinnerModule,
//     MatSlideToggleModule,
//   ],
//   template: `
//     <mat-toolbar>
//       <span>{{ title }}</span>
//       <span style="flex: 1 1 auto;"></span>
//       <mat-slide-toggle
//         [checked]="themeService.isDarkMode$ | async"
//         (change)="themeService.toggleTheme()"
//         aria-label="Toggle dark mode"
//       >
//         {{ (themeService.isDarkMode$ | async) ? 'Dark' : 'Light' }} Mode
//       </mat-slide-toggle>
//     </mat-toolbar>
//     <router-outlet></router-outlet>
//   `,
//   styles: [`
//     mat-toolbar {
//       background-color: var(--white-background);
//       color: var(--text-primary);
//       border-bottom: 1px solid var(--accent);
//     }
//     mat-slide-toggle {
//       color: var(--text-primary);
//       --mdc-switch-selected-track-color: var(--primary);
//       --mdc-switch-selected-handle-color: var(--accent);
//     }
//   `]
// })
// export class AppComponent implements OnInit {
//   title = 'fixaura';

//   constructor(public themeService: ThemeService) {}

//   ngOnInit() {
//     this.themeService.initializeTheme();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  template: `
   
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'fixaura';

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.initializeTheme();
  }
}