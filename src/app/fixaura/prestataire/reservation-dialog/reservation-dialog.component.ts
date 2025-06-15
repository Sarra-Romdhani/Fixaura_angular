// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'app-reservation-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatButtonModule
//   ],
//   templateUrl: './reservation-dialog.component.html',
//   styleUrls: ['./reservation-dialog.component.scss']
// })
// export class ReservationDialogComponent {
//   constructor(
//     public dialogRef: MatDialogRef<ReservationDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { message: string; isError: boolean; reservationId?: string }
//   ) {
//     console.log('[DEBUG] ReservationDialog opened with data:', data);
//   }

//   onOkClick(): void {
//     console.log('[DEBUG] OK button clicked, closing dialog');
//     this.dialogRef.close();
//   }
// }


import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reservation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.scss']
})
export class ReservationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; isError: boolean; reservationId?: string }
  ) {
    console.log('[DEBUG] ReservationDialog opened with data:', data);
  }

  onOkClick(): void {
    console.log('[DEBUG] OK button clicked, closing dialog');
    this.dialogRef.close();
  }
}