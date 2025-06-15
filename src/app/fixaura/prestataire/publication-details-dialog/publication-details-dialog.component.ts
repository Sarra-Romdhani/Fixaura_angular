import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Publication } from '../../classes/publication.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-publication-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './publication-details-dialog.component.html',
  styleUrls: ['./publication-details-dialog.component.css']
})
export class PublicationDetailsDialogComponent {
  currentImageIndex: number = 0;
  touchStartX: number = 0;
  touchEndX: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { publication: Publication; baseUrl: string },
    public dialogRef: MatDialogRef<PublicationDetailsDialogComponent>
  ) {}

  normalizeImageUrl(url: string | undefined): string {
    if (!url || url.includes('undefined') || url.trim() === '') {
      console.warn('[Image Error] Invalid or undefined URL:', url);
      return '/assets/default-image.png';
    }
    if (url.startsWith('http')) {
      console.log('[Image Debug] Using absolute URL:', url);
      return url;
    }
    const fileName = url.split('/').pop() || '';
    const normalizedPath = url.toLowerCase().startsWith('/uploads/') ? url : `/Uploads/publications/${fileName}`;
    const normalizedUrl = `${this.data.baseUrl}${normalizedPath}`;
    console.log('[Image Debug] Constructed URL:', normalizedUrl);
    return normalizedUrl;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.error('[Image Error] Failed to load image:', imgElement.src);
    imgElement.src = '/assets/default-image.png';
    imgElement.classList.add('error');
  }

  nextImage() {
    if (this.data.publication.imageUrls && this.currentImageIndex < this.data.publication.imageUrls.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  onTouchStart(event: TouchEvent | MouseEvent) {
    this.touchStartX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  }

  onTouchEnd(event: TouchEvent | MouseEvent) {
    this.touchEndX = 'changedTouches' in event ? event.changedTouches[0].clientX : event.clientX;
    const swipeThreshold = 50; // Pixels
    if (this.touchStartX - this.touchEndX > swipeThreshold) {
      this.nextImage(); // Swipe left
    } else if (this.touchEndX - this.touchStartX > swipeThreshold) {
      this.prevImage();
    }
  }
}