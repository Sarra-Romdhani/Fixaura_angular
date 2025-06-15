// import { Component, EventEmitter, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// @Component({
//   selector: 'app-delete-confirmation-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatButtonModule,
//     MatDialogModule
//   ],
//   templateUrl: './delete-confirmation-dialog.component.html',
//   styleUrls: ['./delete-confirmation-dialog.component.css']
// })
// export class DeleteConfirmationDialogComponent {
//   confirm = new EventEmitter<void>();

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: { publicationId: string },
//     public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>
//   ) {}
// }









import { Component, Inject, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent {
  confirm = new EventEmitter<void>();
  isDarkMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { publicationId: string, isDarkMode: boolean }
  ) {
    this.isDarkMode = data.isDarkMode || false;
  }

  onConfirm(): void {
    this.confirm.emit();
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}