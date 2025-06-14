// import { Component, ViewChild, ElementRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule, MatDialog } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
// import { PublicationService } from '../../services/publication.service';
// import { Publication } from '../../classes/publication.model';
// import { environment } from '../../environments/environment';
// import { animate, style, transition, trigger } from '@angular/animations';
// import { CommentComponent } from '../comment/comment.component';
// import { EditPublicationDialogComponent } from '../edit-publication-dialog/edit-publication-dialog.component';
// import { AddPublicationDialogComponent } from '../add-publication-dialog/add-publication-dialog.component';
// import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

// @Component({
//   selector: 'app-publication',
//   standalone: true,
//   imports: [
//     CommonModule,
//     HttpClientModule,
//     ReactiveFormsModule,
//     MatButtonModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatMenuModule,
//     MatProgressSpinnerModule,
//     MatSnackBarModule
//   ],
//   templateUrl: './publication.component.html',
//   styleUrls: ['./publication.component.css'],
//   animations: [
//     trigger('cardAnimation', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(20px)' }),
//         animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
//       ])
//     ])
//   ]
// })
// export class PublicationComponent {
//   userId: string;
//   loggedInUserId: string;
//   isOwner: boolean;
//   publications: Publication[] = [];
//   isLoading: boolean = true;
//   hasError: boolean = false;
//   isLiking: boolean = false;
//   publicationForm: FormGroup;
//   imagePreview: string | null = null;
//   @ViewChild('fileInput') fileInput!: ElementRef;

//   constructor(
//     private route: ActivatedRoute,
//     private publicationService: PublicationService,
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private fb: FormBuilder
//   ) {
//     this.userId = this.route.snapshot.paramMap.get('userId') || '67e56c3ebfb0874c3c05fd40';
//     this.loggedInUserId = this.userId; // Adjust based on auth service
//     this.isOwner = this.userId === this.loggedInUserId;
//     this.publicationForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       image: [null]
//     });
//   }

//   ngOnInit() {
//     this.fetchPublications();
//   }

//   fetchPublications() {
//     this.isLoading = true;
//     this.publicationService.fetchPublications(this.userId).subscribe({
//       next: (data: Publication[]) => {
//         this.publications = data;
//         this.isLoading = false;
//         this.hasError = false;
//       },
//       error: (error: any) => {
//         this.hasError = true;
//         this.isLoading = false;
//         this.snackBar.open(`Error: ${error.message}`, 'Close', {
//           duration: 3000,
//           panelClass: ['bg-red-600', 'text-white']
//         });
//       }
//     });
//   }

//   normalizeImageUrl(url: string | undefined): string {
//     if (!url || url.includes('undefined')) return '';
//     if (url.startsWith('http')) return url;
//     return `${environment.baseUrl}${url}`;
//   }

//   triggerFileInput() {
//     this.fileInput.nativeElement.click();
//   }

//   onImageSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       this.imagePreview = URL.createObjectURL(file);
//       this.publicationForm.patchValue({ image: file });
//     } else {
//       this.snackBar.open('No image selected', 'Close', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//     }
//   }

//   handleImageError(event: any) {
//     event.target.style.display = 'none';
//   }

//   openEditDialog(publication: Publication | null) {
//     if (publication) {
//       // Edit mode
//       this.publicationForm.patchValue({
//         title: publication.title,
//         description: publication.description
//       });
//       this.imagePreview = this.normalizeImageUrl(publication.imageUrl);
//       const dialogRef = this.dialog.open(EditPublicationDialogComponent, {
//         width: '90%',
//         maxWidth: '500px',
//         panelClass: ['custom-dialog'],
//         data: { publication, form: this.publicationForm, imagePreview: this.imagePreview }
//       });

//       dialogRef.componentInstance.save.subscribe((data: any) => {
//         this.savePublication(data.publication, data.formValue);
//       });
//     } else {
//       // Add mode
//       this.publicationForm.reset();
//       this.imagePreview = null;
//       const dialogRef = this.dialog.open(AddPublicationDialogComponent, {
//         width: '90%',
//         maxWidth: '500px',
//         panelClass: ['custom-dialog'],
//         data: { form: this.publicationForm, imagePreview: this.imagePreview }
//       });

//       dialogRef.componentInstance.save.subscribe((data: any) => {
//         this.savePublication(null, data.formValue);
//       });
//     }
//   }

//   savePublication(publication: Publication | null, formValue: any) {
//     const newPublication = new Publication({
//       id: publication?.id,
//       title: formValue.title,
//       description: formValue.description,
//       providerId: this.userId,
//       image: formValue.image,
//       imageUrl: publication?.imageUrl,
//       likes: publication?.likes ?? [],
//       comments: publication?.comments ?? [],
//       createdAt: publication?.createdAt,
//       updatedAt: publication?.updatedAt
//     });

//     const request = publication
//       ? this.publicationService.updatePublication(
//           publication.id!,
//           formValue.title,
//           formValue.description,
//           this.userId,
//           formValue.image
//         )
//       : this.publicationService.createPublication(newPublication);

//     request.subscribe({
//       next: () => {
//         this.fetchPublications();
//         this.snackBar.open('Publication saved successfully', 'Close', {
//           duration: 3000,
//           panelClass: ['bg-amber-200', 'text-black']
//         });
//         this.dialog.closeAll();
//       },
//       error: (error: any) => {
//         this.snackBar.open(`Error: ${error.message}`, 'Close', {
//           duration: 3000,
//           panelClass: ['bg-red-600', 'text-white']
//         });
//       }
//     });
//   }

// showDeleteConfirmation(publicationId: string | undefined) {
//   if (!publicationId || !/^[0-9a-fA-F]{24}$/.test(publicationId)) {
//     this.snackBar.open('Error: Invalid publication ID', 'Close', {
//       duration: 3000,
//       panelClass: ['bg-red-600', 'text-white']
//     });
//     return;
//   }
//   const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
//     width: '90%',
//     maxWidth: '400px',
//     panelClass: ['custom-dialog'],
//     data: { publicationId }
//   });

//   dialogRef.componentInstance.confirm.subscribe(() => {
//     this.deletePublication(publicationId);
//   });
// }

// deletePublication(publicationId: string) {
//   console.log('Deleting publication with ID:', publicationId);
//   this.publicationService.deletePublication(publicationId).subscribe({
//     next: () => {
//       this.fetchPublications();
//       this.snackBar.open('Publication deleted successfully', 'Close', {
//         duration: 3000,
//         panelClass: ['bg-amber-200', 'text-black']
//       });
//       this.dialog.closeAll();
//     },
//     error: (error: any) => {
//       console.error('Delete error:', error);
//       this.snackBar.open(`Error: ${error.message}`, 'Close', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//     }
//   });
// }

//   toggleLike(publicationId: string) {
//     if (this.isLiking) return;
//     this.isLiking = true;
//     this.publicationService.toggleLike(publicationId, this.loggedInUserId).subscribe({
//       next: () => {
//         this.fetchPublications();
//         this.isLiking = false;
//       },
//       error: (error: any) => {
//         this.snackBar.open(`Error: ${error.message}`, 'Close', {
//           duration: 3000,
//           panelClass: ['bg-red-600', 'text-white']
//         });
//         this.isLiking = false;
//       }
//     });
//   }

//   openCommentDialog(publication: Publication) {
//     this.dialog.open(CommentComponent, {
//       width: '90%',
//       maxWidth: '600px',
//       height: '70vh',
//       panelClass: ['custom-dialog'],
//       data: {
//         publication,
//         loggedInUserId: this.loggedInUserId,
//         baseUrl: environment.baseUrl,
//         publicationService: this.publicationService
//       }
//     });
//   }
// }










import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { PublicationService } from '../../services/publication.service';
import { Publication } from '../../classes/publication.model';
import { environment } from '../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommentComponent } from '../comment/comment.component';
import { EditPublicationDialogComponent } from '../edit-publication-dialog/edit-publication-dialog.component';
import { AddPublicationDialogComponent } from '../add-publication-dialog/add-publication-dialog.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { PublicationDetailsDialogComponent } from '../publication-details-dialog/publication-details-dialog.component';

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CommentComponent,
EditPublicationDialogComponent, // This is causing the error    AddPublicationDialogComponent,
    DeleteConfirmationDialogComponent,
    PublicationDetailsDialogComponent
  ],
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PublicationComponent {
  @Input() userId: string = '';
  @Input() loggedInUserId: string = '';
  publications: Publication[] = [];
  isOwner: boolean = false;
  isLoading: boolean = true;
  hasError: boolean = false;
  isLiking: boolean = false;
  publicationForm: FormGroup;
  imagePreviews: string[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '67e56c3ebfb0874c3c05fd40';
    this.loggedInUserId = this.userId;
    this.isOwner = this.userId === this.loggedInUserId;
    this.publicationForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      images: [null]
    });
  }

  ngOnInit() {
    this.fetchPublications();
  }

  fetchPublications() {
    this.isLoading = true;
    this.publicationService.fetchPublications(this.userId).subscribe({
      next: (data: Publication[]) => {
        this.publications = data;
        console.log('[Publications Debug] Loaded publications:', this.publications);
        this.isLoading = false;
        this.hasError = false;
      },
      error: (error: any) => {
        this.hasError = true;
        this.isLoading = false;
        this.snackBar.open(`Error: ${error.message}`, 'Close', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }

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
    const normalizedUrl = `${environment.baseUrl}${normalizedPath}`;
    console.log('[Image Debug] Constructed URL:', normalizedUrl);
    return normalizedUrl;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.error('[Image Error] Failed to load image:', imgElement.src);
    imgElement.src = '/assets/default-image.png';
    imgElement.classList.add('error');
  }

  openEditDialog(publication: Publication | null) {
    if (publication) {
      this.publicationForm.patchValue({
        title: publication.title,
        description: publication.description,
        images: null
      });
      this.imagePreviews = publication.imageUrls?.map(url => this.normalizeImageUrl(url)) || [];
      const dialogRef = this.dialog.open(EditPublicationDialogComponent, {
        width: '90%',
        maxWidth: '500px',
        panelClass: ['custom-dialog'],
        data: { publication, form: this.publicationForm, imagePreviews: this.imagePreviews }
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result?.success) {
          this.savePublication(publication, result.formValue);
        }
      });
    } else {
      this.publicationForm.reset();
      this.imagePreviews = [];
      const dialogRef = this.dialog.open(AddPublicationDialogComponent, {
        width: '90%',
        maxWidth: '500px',
        panelClass: ['custom-dialog'],
        data: { form: this.publicationForm, imagePreviews: this.imagePreviews, userId: this.userId, loggedInUserId: this.loggedInUserId, isDarkMode: false }
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result?.success) {
          this.savePublication(null, result.formValue);
        }
      });
    }
  }

  showDeleteConfirmation(publicationId: string) {
    if (!publicationId || !/^[0-9a-fA-F]{24}$/.test(publicationId)) {
      this.snackBar.open('Error: Invalid publication ID', 'Close', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '90%',
      maxWidth: '400px',
      panelClass: ['custom-dialog'],
      data: { publicationId }
    });

    dialogRef.componentInstance.confirm.subscribe(() => {
      this.deletePublication(publicationId);
    });
  }

  openDetailsDialog(publication: Publication) {
    this.dialog.open(PublicationDetailsDialogComponent, {
      width: '90%',
      maxWidth: '600px',
      panelClass: ['custom-dialog'],
      data: { publication, baseUrl: environment.baseUrl }
    });
  }


 savePublication(publication: Publication | null, formValue: any) {
    console.log('[Debug] savePublication Form Value:', formValue);

    const totalImages = (formValue.existingImages?.length || 0) + (formValue.images?.length || 0);
    if (totalImages > 10) {
      this.snackBar.open('Total images cannot exceed 10.', 'Close', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }

    const originalImages = publication?.imageUrls || [];
    const imagesToDelete = originalImages.filter(img => !formValue.existingImages?.includes(img));

    const request = publication
      ? this.publicationService.updatePublication(
          publication.id!,
          formValue.title,
          formValue.description,
          this.userId,
          formValue.images || null,
          formValue.existingImages || []
        )
      : this.publicationService.createPublication(new Publication({
          title: formValue.title,
          description: formValue.description,
          providerId: this.userId,
          image: formValue.images
        }));

    request.subscribe({
      next: (response) => {
        console.log('[Debug] Publication Saved Response:', response);

        // Clear cache for deleted images
        imagesToDelete.forEach(url => {
          const fullUrl = `${this.normalizeImageUrl(url)}?v=${Date.now()}`;
          fetch(fullUrl, {
            method: 'HEAD',
            cache: 'no-store' // More aggressive cache clearing
          })
            .then(() => console.log('[Debug] Cleared cache for image:', fullUrl))
            .catch(err => console.error('[Debug] Failed to clear cache for image:', fullUrl, err));
        });

        this.snackBar.open('Publication mise à jour avec succès', 'Close', {
          duration: 3000,
          panelClass: ['bg-amber-200', 'text-black']
        });

        // Refresh publications if editing
        if (publication) {
          this.fetchPublications();
        }

        this.router.navigate(['/profile', this.userId], {
          replaceUrl: true
        });

        this.dialog.closeAll();
      },
      error: (error: any) => {
        console.error('[Debug] Save Publication Error:', error);
        let errorMessage = error.message || 'Failed to save publication';
        if (error.message.includes('429')) {
          errorMessage = 'Trop de fichiers uploadés. Maximum 10 autorisés.';
        }
        this.snackBar.open(`Error: ${errorMessage}`, 'Close', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }

  // showDeleteConfirmation(publicationId: string) {
  //   if (!publicationId || !/^[0-9a-fA-F]{24}$/.test(publicationId)) {
  //     this.snackBar.open('Error: Invalid publication ID', 'Close', {
  //       duration: 3000,
  //       panelClass: ['bg-red-600', 'text-white']
  //     });
  //     return;
  //   }
  //   const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
  //     width: '90%',
  //     maxWidth: '400px',
  //     panelClass: ['custom-dialog'],
  //     data: { publicationId }
  //   });

  //   dialogRef.componentInstance.confirm.subscribe(() => {
  //     this.deletePublication(publicationId);
  //   });
  // }

  deletePublication(publicationId: string) {
    this.publicationService.deletePublication(publicationId).subscribe({
      next: () => {
        this.fetchPublications();
        this.snackBar.open('Publication deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['bg-amber-200', 'text-black']
        });
        this.dialog.closeAll();
      },
      error: (error: any) => {
        this.snackBar.open(`Error: ${error.message}`, 'Close', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }

  toggleLike(publicationId: string) {
    if (this.isLiking) return;
    this.isLiking = true;
    this.publicationService.toggleLike(publicationId, this.loggedInUserId).subscribe({
      next: () => {
        this.fetchPublications();
        this.isLiking = false;
      },
      error: (error: any) => {
        this.snackBar.open(`Error: ${error.message}`, 'Close', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
        this.isLiking = false;
      }
    });
  }

  openCommentDialog(publication: Publication) {
    this.dialog.open(CommentComponent, {
      width: '90%',
      maxWidth: '600px',
      height: '70vh',
      panelClass: ['custom-dialog'],
      data: {
        publication,
        loggedInUserId: this.loggedInUserId,
        baseUrl: environment.baseUrl,
        publicationService: this.publicationService
      }
    });
  }

  // openDetailsDialog(publication: Publication) {
  //   this.dialog.open(PublicationDetailsDialogComponent, {
  //     width: '90%',
  //     maxWidth: '600px',
  //     panelClass: ['custom-dialog'],
  //     data: { publication, baseUrl: environment.baseUrl }
  //   });
  // }
}