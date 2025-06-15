import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Service } from '../../classes/service.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-service-details-dialog',
  templateUrl: './service-details-dialog.component.html',
  styleUrls: ['./service-details-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class ServiceDetailsDialogComponent {
  service: Service;
  baseUrl: string;
  isDarkMode: boolean = false; // Adjust based on your theme logic
  imageError: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ServiceDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { service: Service, baseUrl: string }
  ) {
    this.service = data.service;
    this.baseUrl = data.baseUrl.endsWith('/') ? data.baseUrl : data.baseUrl + '/';
  }

  getImageUrl(): string {
    if (!this.service.photo || this.service.photo.trim() === '') {
      this.imageError = true;
      return '';
    }
    const normalizedPath = this.service.photo.startsWith('/') ? this.service.photo.slice(1) : this.service.photo;
    return `${this.baseUrl}${normalizedPath}`;
  }

  handleImageError(event: Event) {
    this.imageError = true;
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  closeDialog() {
    this.dialogRef.close();
  }
}