import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class BookingDialogComponent {
  isDarkMode: boolean = false; // Default to false
  dateControl = new FormControl(new Date(), [Validators.required]);
  timeControl = new FormControl('', [
    Validators.required,
    Validators.pattern('([0-1]?[0-9]|2[0-3]):[0-5][0-9]')
  ]);
  minDate = new Date();
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogRef.close('delete');
  }

  onConfirm(): void {
    if (!this.dateControl.valid || !this.timeControl.valid) {
      alert('Please enter a valid date and time in HH:mm format');
      return;
    }
    this.dialogRef.close({ date: this.dateControl.value, time: this.timeControl.value });
  }
}