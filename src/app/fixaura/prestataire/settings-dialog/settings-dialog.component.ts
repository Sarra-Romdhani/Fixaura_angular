// import { Component, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { PrestataireService } from '../../services/prestataire.service';

// @Component({
//   standalone: true,
//   selector: 'app-settings-dialog',
//   templateUrl: './settings-dialog.component.html',
//   styleUrls: ['./settings-dialog.component.scss'],
//   imports: [
//     CommonModule,
//     MatDialogModule,
//     MatButtonModule,
//     MatSlideToggleModule
//   ]
// })
// export class SettingsDialogComponent {
//   isDarkMode = false;

//   constructor(
//     public dialogRef: MatDialogRef<SettingsDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { userId: string },
//     private prestataireService: PrestataireService
//   ) {
//     this.prestataireService.fetchDarkModePreference(this.data.userId).subscribe({
//       next: (darkMode: boolean) => this.isDarkMode = darkMode
//     });
//   }

//   toggleTheme(checked: boolean): void {
//     this.isDarkMode = checked;
//     this.prestataireService.updateDarkModePreference(this.data.userId, checked).subscribe({
//       next: () => document.documentElement.classList.toggle('dark-theme', checked)
//     });
//   }

//   close(): void {
//     this.dialogRef.close();
//   }
// }