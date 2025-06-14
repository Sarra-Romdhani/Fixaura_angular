import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
})
export class RatingDialogComponent {
  rating: number = 0;

  constructor(
    public dialogRef: MatDialogRef<RatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservationId: string }
  ) {}

  submit(): void {
    this.dialogRef.close(this.rating);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}