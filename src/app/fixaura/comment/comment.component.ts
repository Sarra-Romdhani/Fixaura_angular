// import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
// import { MatListModule } from '@angular/material/list';
// import { PublicationService } from '../../services/publication.service';
// import { UserService } from '../../services/user.service';
// import { Publication } from '../../classes/publication.model';
// import { Comment } from '../../classes/comment.model';
// import { animate, style, transition, trigger } from '@angular/animations';
// import { HttpErrorResponse } from '@angular/common/http';

// interface User {
//   id: string;
//   name?: string;
//   type?: 'client' | 'prestataire' | string;
//   photo?: string | null;
//   job?: string;
// }

// @Component({
//   selector: 'app-comment',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatButtonModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatProgressSpinnerModule,
//     MatMenuModule,
//     MatSnackBarModule,
//     MatListModule
//   ],
//   templateUrl: './comment.component.html',
//   styleUrls: ['./comment.component.css'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   animations: [
//     trigger('dialogAnimation', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'scale(0.95)' }),
//         animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
//       ])
//     ])
//   ]
// })
// export class CommentComponent implements OnInit {
//   publication: Publication;
//   loggedInUserId: string;
//   baseUrl: string;
//   commentForm: FormGroup;
//   editCommentControl: FormControl;
//   isSending: boolean = false;
//   editingCommentId: string | null = null;
//   userCache: Map<string, { id: string; type: string; name: string; photo: string | null; commentTextLength: number; editTextLength: number; job?: string }> = new Map();
//   isLoadingUsers: boolean = true;

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: { publication: Publication; loggedInUserId: string; baseUrl: string; publicationService: PublicationService },
//     public dialogRef: MatDialogRef<CommentComponent>,
//     private fb: FormBuilder,
//     private userService: UserService,
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private cdr: ChangeDetectorRef
//   ) {
//     this.publication = data.publication;
//     this.loggedInUserId = data.loggedInUserId;
//     this.baseUrl = data.baseUrl;
//     this.commentForm = this.fb.group({
//       newComment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
//     });
//     this.editCommentControl = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]);
//   }

//   ngOnInit() {
//     this.loadUserData();
//     this.commentForm.get('newComment')?.valueChanges.subscribe(value => {
//       console.log('newComment value changed:', value);
//       const user = this.userCache.get(this.loggedInUserId) || { id: this.loggedInUserId, type: 'unknown', name: 'Utilisateur inconnu', photo: null, commentTextLength: 0, editTextLength: 0 };
//       user.commentTextLength = (value || '').length;
//       this.userCache.set(this.loggedInUserId, user);
//       this.cdr.markForCheck();
//     });
//     this.editCommentControl.valueChanges.subscribe(value => {
//       const user = this.userCache.get(this.loggedInUserId) || { id: this.loggedInUserId, type: 'unknown', name: 'Utilisateur inconnu', photo: null, commentTextLength: 0, editTextLength: 0 };
//       user.editTextLength = (value || '').length;
//       this.userCache.set(this.loggedInUserId, user);
//       this.cdr.markForCheck();
//     });
//   }

//   async loadUserData() {
//     this.isLoadingUsers = true;
//     // Pre-cache logged-in user
//     if (!this.userCache.has(this.loggedInUserId)) {
//       try {
//         const user: User | undefined = await this.userService.getUser(this.loggedInUserId).toPromise();
//         console.log('Logged-in user data:', user);
//         console.log('User photo field:', user?.photo);
//         if (user) {
//           const userData = {
//             id: user.id,
//             type: user.type || 'unknown',
//             name: user.name || 'Utilisateur inconnu',
//             photo: user.photo || null,
//             commentTextLength: 0,
//             editTextLength: 0,
//             job: user.job || undefined
//           };
//           this.userCache.set(this.loggedInUserId, userData);
//         } else {
//           console.warn(`No user data for ${this.loggedInUserId}`);
//           this.userCache.set(this.loggedInUserId, {
//             id: this.loggedInUserId,
//             type: 'unknown',
//             name: 'Utilisateur inconnu',
//             photo: null,
//             commentTextLength: 0,
//             editTextLength: 0
//           });
//         }
//       } catch (error) {
//         console.error(`Error fetching logged-in user ${this.loggedInUserId}:`, error);
//         this.userCache.set(this.loggedInUserId, {
//           id: this.loggedInUserId,
//           type: 'unknown',
//           name: 'Utilisateur inconnu',
//           photo: null,
//           commentTextLength: 0,
//           editTextLength: 0
//         });
//       }
//     }

//     const userPromises = this.publication.comments.map(comment => {
//       if (!this.userCache.has(comment.userId)) {
//         return this.userService.getUser(comment.userId).toPromise().then(
//           (user: User | undefined) => {
//             console.log(`User data for ${comment.userId}:`, user);
//             console.log(`User photo field for ${comment.userId}:`, user?.photo);
//             if (user) {
//               const userData = {
//                 id: user.id,
//                 type: user.type || 'unknown',
//                 name: user.name || 'Utilisateur inconnu',
//                 photo: user.photo || null,
//                 commentTextLength: 0,
//                 editTextLength: 0,
//                 job: user.job || undefined
//               };
//               this.userCache.set(comment.userId, userData);
//             } else {
//               console.warn(`No user data for ${comment.userId}`);
//               this.userCache.set(comment.userId, {
//                 id: comment.userId,
//                 type: 'unknown',
//                 name: 'Utilisateur inconnu',
//                 photo: null,
//                 commentTextLength: 0,
//                 editTextLength: 0
//               });
//             }
//           },
//           (error: any) => {
//             console.error(`Error fetching user ${comment.userId}:`, error);
//             this.userCache.set(comment.userId, {
//               id: comment.userId,
//               type: 'unknown',
//               name: 'Utilisateur inconnu',
//               photo: null,
//               commentTextLength: 0,
//               editTextLength: 0
//             });
//           }
//         );
//       }
//       return Promise.resolve();
//     });

//     await Promise.all(userPromises);
//     console.log('User cache after loading:', this.userCache);
//     this.isLoadingUsers = false;
//     this.cdr.markForCheck();
//   }

//   getUserImage(userId: string): string {
//     const user = this.userCache.get(userId);
//     if (user && user.photo) {
//       const normalizedUrl = this.normalizeImageUrl(user.photo);
//       console.log(`Image URL for user ${userId}:`, normalizedUrl);
//       return normalizedUrl;
//     }
//     console.log(`No image for user ${userId}, using fallback`);
//     return '/assets/default-avatar.png';
//   }

//   normalizeImageUrl(url: string | null | undefined): string {
//     if (!url || url.includes('undefined') || url.includes('null')) {
//       return '/assets/default-avatar.png';
//     }
//     if (url.startsWith('http://') || url.startsWith('https://')) {
//       return url;
//     }
//     const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
//     const path = url.startsWith('/') ? url.slice(1) : url;
//     const normalizedUrl = `${base}${path}`;
//     console.log(`Normalized URL: ${url} -> ${normalizedUrl}`);
//     return normalizedUrl;
//   }

//   handleImageError(event: any) {
//     console.log('Image failed to load:', event.target.src);
//     event.target.classList.add('error');
//     // No need to manually show fallback icon; CSS handles it
//   }

//   addComment() {
//     const commentText = this.commentForm.get('newComment')?.value;
//     console.log('Add Comment - Form valid:', this.commentForm.valid);
//     console.log('Add Comment - newComment value:', commentText);
//     console.log('Add Comment - newComment errors:', this.commentForm.get('newComment')?.errors);
//     console.log('Add Comment - isSending:', this.isSending);
//     console.log('Add Comment - publication.id:', this.publication.id);
//     console.log('Add Comment - loggedInUserId:', this.loggedInUserId);

//     if (this.isSending) {
//       this.snackBar.open('Envoi en cours, veuillez patienter', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }

//     const trimmedComment = (commentText || '').trim();
//     if (!trimmedComment) {
//       this.snackBar.open('Le commentaire ne peut pas être vide', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }

//     if (trimmedComment.length < 3) {
//       this.snackBar.open('Minimum 3 caractères', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }

//     if (trimmedComment.length > 500) {
//       this.snackBar.open('Maximum 500 caractères', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }

//     if (!this.loggedInUserId) {
//       this.snackBar.open('Vous devez être connecté pour commenter', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }

//     if (!this.publication.id || !/^[0-9a-fA-F]{24}$/.test(this.publication.id)) {
//       this.snackBar.open('Erreur : ID de publication invalide', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }

//     this.isSending = true;
//     this.cdr.markForCheck();
//     const timeoutId = setTimeout(() => {
//       this.isSending = false;
//       this.snackBar.open('Erreur : La requête a pris trop de temps', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       this.cdr.markForCheck();
//     }, 10000);

//     const cachedUser = this.userCache.get(this.loggedInUserId);
//     if (cachedUser) {
//       this.submitComment(trimmedComment, cachedUser.name, cachedUser.photo, cachedUser.type, timeoutId);
//     } else {
//       this.userService.getUser(this.loggedInUserId).subscribe({
//         next: (user: User | undefined) => {
//           console.log('Fetched user for comment:', user);
//           console.log('User photo field for comment:', user?.photo);
//           if (user) {
//             const userName = user.name || 'Utilisateur inconnu';
//             const userImageUrl = user.photo || null;
//             const userType = user.type || 'unknown';
//             this.userCache.set(this.loggedInUserId, {
//               id: this.loggedInUserId,
//               type: userType,
//               name: userName,
//               photo: userImageUrl,
//               commentTextLength: 0,
//               editTextLength: 0,
//               job: user.job || undefined
//             });
//             this.submitComment(trimmedComment, userName, userImageUrl, userType, timeoutId);
//           } else {
//             console.warn(`No user data for ${this.loggedInUserId} in submitComment`);
//             const userName = 'Utilisateur inconnu';
//             const userType = 'unknown';
//             this.userCache.set(this.loggedInUserId, {
//               id: this.loggedInUserId,
//               type: userType,
//               name: userName,
//               photo: null,
//               commentTextLength: 0,
//               editTextLength: 0
//             });
//             this.submitComment(trimmedComment, userName, null, userType, timeoutId);
//           }
//           this.cdr.markForCheck();
//         },
//         error: (error) => {
//           console.error('Error fetching user for comment:', error);
//           const userName = 'Utilisateur inconnu';
//           const userType = 'unknown';
//           this.userCache.set(this.loggedInUserId, {
//             id: this.loggedInUserId,
//             type: userType,
//             name: userName,
//             photo: null,
//             commentTextLength: 0,
//             editTextLength: 0
//           });
//           this.submitComment(trimmedComment, userName, null, userType, timeoutId);
//           this.cdr.markForCheck();
//         }
//       });
//     }
//   }

//   private submitComment(text: string, userName: string, userImageUrl: string | null, userType: string, timeoutId: any) {
//     console.log('Submitting comment:', { publicationId: this.publication.id, userId: this.loggedInUserId, text, userName, userImageUrl, userType });
//     this.data.publicationService.addComment(
//       this.publication.id!,
//       this.loggedInUserId,
//       text,
//       userName,
//       userImageUrl || undefined,
//       userType
//     ).subscribe({
//       next: (response) => {
//         console.log('Comment added successfully:', response);
//         this.snackBar.open('Commentaire ajouté avec succès', 'OK', {
//           duration: 3000,
//           panelClass: ['bg-green-600', 'text-white']
//         });
//         this.fetchPublication();
//         this.commentForm.reset();
//         this.isSending = false;
//         clearTimeout(timeoutId);
//         this.cdr.markForCheck();
//       },
//       error: (error: HttpErrorResponse) => {
//         console.error('Error adding comment:', error);
//         let errorMessage = 'Impossible d\'ajouter le commentaire';
//         if (error.status === 401) errorMessage = 'Vous devez être connecté';
//         else if (error.status === 404) errorMessage = 'Publication non trouvée';
//         else if (error.status === 400 && error.error?.message) errorMessage = error.error.message;
//         this.snackBar.open(`Erreur : ${errorMessage}`, 'Fermer', {
//           duration: 3000,
//           panelClass: ['bg-red-600', 'text-white']
//         });
//         this.isSending = false;
//         clearTimeout(timeoutId);
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   startEditing(comment: Comment) {
//     if (!comment.id) {
//       console.error('Cannot edit comment: Missing comment ID', comment);
//       this.snackBar.open('Erreur : Commentaire invalide (ID manquant)', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }
//     console.log('Start Editing - Comment:', comment);
//     this.editingCommentId = comment.id;
//     this.editCommentControl.setValue(comment.text);
//     this.cdr.markForCheck();
//   }

//   isEditingComment(commentId: string | undefined): boolean {
//     return this.editingCommentId === commentId;
//   }

//   cancelEditing() {
//     this.editingCommentId = null;
//     this.editCommentControl.reset();
//     this.cdr.markForCheck();
//   }

//   saveEditedComment(comment: Comment) {
//     if (!comment.id) {
//       console.error('Cannot save edited comment: Missing comment ID', comment);
//       this.snackBar.open('Erreur : Commentaire invalide (ID manquant)', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }
//     const newText = this.editCommentControl.value;
//     if (!newText || newText.trim().length === 0) {
//       this.snackBar.open('Le commentaire ne peut pas être vide', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }
//     if (newText.trim().length < 3) {
//       this.snackBar.open('Minimum 3 caractères', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }
//     if (newText.trim().length > 500) {
//       this.snackBar.open('Maximum 500 caractères', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }
//     console.log('Saving edited comment:', { publicationId: this.publication.id, commentId: comment.id, newText });
//     this.data.publicationService.updateComment(this.publication.id!, comment.id, newText.trim()).subscribe({
//       next: () => {
//         this.snackBar.open('Commentaire modifié avec succès', 'OK', {
//           duration: 3000,
//           panelClass: ['bg-green-600', 'text-white']
//         });
//         this.fetchPublication();
//         this.editingCommentId = null;
//         this.editCommentControl.reset();
//         this.cdr.markForCheck();
//       },
//       error: (error: HttpErrorResponse) => {
//         console.error('Error updating comment:', error);
//         let errorMessage = 'Impossible de modifier le commentaire';
//         if (error.status === 401) errorMessage = 'Vous devez être connecté';
//         else if (error.status === 404) errorMessage = 'Commentaire non trouvé';
//         else if (error.status === 400 && error.error?.message) errorMessage = error.error.message;
//         this.snackBar.open(`Erreur : ${errorMessage}`, 'Fermer', {
//           duration: 3000,
//           panelClass: ['bg-red-600', 'text-white']
//         });
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   deleteComment(comment: Comment) {
//     if (!comment.id || !this.publication.id) {
//       console.error('Cannot delete comment: Missing IDs', { commentId: comment.id, publicationId: this.publication.id });
//       this.snackBar.open('Erreur : IDs manquants pour la suppression', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }
//     const isValidPubId = /^[0-9a-fA-F]{24}$/.test(this.publication.id);
//     const isValidCommentId = /^[0-9a-fA-F]{24}$/.test(comment.id);
//     if (!isValidPubId || !isValidCommentId) {
//       console.error('Invalid ID format', { publicationId: this.publication.id, commentId: comment.id });
//       this.snackBar.open('Erreur : Format d’ID invalide', 'Fermer', {
//         duration: 3000,
//         panelClass: ['bg-red-600', 'text-white']
//       });
//       return;
//     }
//     console.log('Deleting comment:', { publicationId: this.publication.id, commentId: comment.id });
//     this.data.publicationService.deleteComment(this.publication.id, comment.id).subscribe({
//       next: () => {
//         this.snackBar.open('Commentaire supprimé avec succès', 'OK', {
//           duration: 3000,
//           panelClass: ['bg-green-600', 'text-white']
//         });
//         this.fetchPublication();
//         this.cdr.markForCheck();
//       },
//       error: (error: HttpErrorResponse) => {
//         console.error('Error deleting comment:', error);
//         let errorMessage = 'Impossible de supprimer le commentaire';
//         if (error.status === 401) errorMessage = 'Vous n’êtes pas autorisé à supprimer ce commentaire';
//         else if (error.status === 404) errorMessage = 'Commentaire ou publication non trouvé';
//         else if (error.status === 400 && error.error?.message) errorMessage = error.error.message;
//         this.snackBar.open(`Erreur : ${errorMessage}`, 'Fermer', {
//           duration: 3000,
//           panelClass: ['bg-red-600', 'text-white']
//         });
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   fetchPublication() {
//     this.data.publicationService.fetchPublications(this.publication.providerId).subscribe({
//       next: (publications: Publication[]) => {
//         const updatedPublication = publications.find(p => p.id === this.publication.id);
//         if (updatedPublication) {
//           this.publication = updatedPublication;
//           // Log comments to inspect IDs
//           console.log('Fetched publication comments:', updatedPublication.comments);
//           updatedPublication.comments.forEach((comment, index) => {
//             console.log(`Comment ${index}:`, { id: comment.id, text: comment.text, userId: comment.userId });
//             if (!comment.id) {
//               console.warn(`Comment at index ${index} is missing ID`, comment);
//             }
//           });
//           this.loadUserData();
//         } else {
//           console.error('Publication not found in response', { publicationId: this.publication.id });
//           this.snackBar.open('Publication non trouvée', 'Fermer', {
//             duration: 3000,
//             panelClass: ['bg-red-600', 'text-white']
//           });
//         }
//         this.cdr.markForCheck();
//       },
//       error: (error: HttpErrorResponse) => {
//         console.error('Error fetching publication:', error);
//         this.snackBar.open(`Erreur : ${error.message || 'Impossible de charger la publication'}`, 'Fermer', {
//           duration: 3000,
//           panelClass: ['bg-red-600', 'text-white']
//         });
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   logFormState() {
//     console.log('Form value:', this.commentForm.value);
//     console.log('Form valid:', this.commentForm.valid);
//     console.log('newComment errors:', this.commentForm.get('newComment')?.errors);
//   }

//   logInput(event: Event) {
//     console.log('Raw input value:', (event.target as HTMLTextAreaElement).value);
//   }
// }
import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { PublicationService } from '../../services/publication.service';
import { UserService } from '../../services/user.service';
import { Publication } from '../../classes/publication.model';
import { Comment } from '../../classes/comment.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';

interface User {
  id: string;
  name?: string;
  type?: 'client' | 'prestataire' | string;
  photo?: string | null;
  job?: string;
}

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatListModule
  ],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class CommentComponent implements OnInit {
  publication: Publication;
  loggedInUserId: string;
  baseUrl: string;
  commentForm: FormGroup;
  editCommentControl: FormControl;
  isSending: boolean = false;
  editingCommentId: string | undefined = undefined; // Changed to string | undefined
  userCache: Map<string, { id: string; type: string; name: string; photo: string | null; commentTextLength: number; editTextLength: number; job?: string }> = new Map();
  isLoadingUsers: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { publication: Publication; loggedInUserId: string; baseUrl: string; publicationService: PublicationService },
    public dialogRef: MatDialogRef<CommentComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.publication = data.publication;
    this.loggedInUserId = data.loggedInUserId;
    this.baseUrl = data.baseUrl;
    this.commentForm = this.fb.group({
      newComment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
    });
    this.editCommentControl = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]);
    // Validate publication.id
    if (!this.isValidId(this.publication.id)) {
      console.error('[Debug] Invalid publication ID:', this.publication.id);
      this.snackBar.open('Erreur : ID de publication invalide', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      this.dialogRef.close();
    }
  }

  ngOnInit() {
    this.loadUserData();
    this.commentForm.get('newComment')?.valueChanges.subscribe(value => {
      console.log('newComment value changed:', value);
      const user = this.userCache.get(this.loggedInUserId) || { id: this.loggedInUserId, type: 'unknown', name: 'Utilisateur inconnu', photo: null, commentTextLength: 0, editTextLength: 0 };
      user.commentTextLength = (value || '').length;
      this.userCache.set(this.loggedInUserId, user);
      this.cdr.markForCheck();
    });
    this.editCommentControl.valueChanges.subscribe(value => {
      const user = this.userCache.get(this.loggedInUserId) || { id: this.loggedInUserId, type: 'unknown', name: 'Utilisateur inconnu', photo: null, commentTextLength: 0, editTextLength: 0 };
      user.editTextLength = (value || '').length;
      this.userCache.set(this.loggedInUserId, user);
      this.cdr.markForCheck();
    });
  }

  async loadUserData() {
    this.isLoadingUsers = true;
    // Pre-cache logged-in user
    if (!this.userCache.has(this.loggedInUserId)) {
      try {
        const user: User | undefined = await this.userService.getUser(this.loggedInUserId).toPromise();
        console.log('Logged-in user data:', user);
        console.log('User photo field:', user?.photo);
        if (user) {
          const userData = {
            id: user.id,
            type: user.type || 'unknown',
            name: user.name || 'Utilisateur inconnu',
            photo: user.photo || null,
            commentTextLength: 0,
            editTextLength: 0,
            job: user.job || undefined
          };
          this.userCache.set(this.loggedInUserId, userData);
        } else {
          console.warn(`No user data for ${this.loggedInUserId}`);
          this.userCache.set(this.loggedInUserId, {
            id: this.loggedInUserId,
            type: 'unknown',
            name: 'Utilisateur inconnu',
            photo: null,
            commentTextLength: 0,
            editTextLength: 0
          });
        }
      } catch (error) {
        console.error(`Error fetching logged-in user ${this.loggedInUserId}:`, error);
        this.userCache.set(this.loggedInUserId, {
          id: this.loggedInUserId,
          type: 'unknown',
          name: 'Utilisateur inconnu',
          photo: null,
          commentTextLength: 0,
          editTextLength: 0
        });
      }
    }

    const userPromises = this.publication.comments.map(comment => {
      if (!this.userCache.has(comment.userId)) {
        return this.userService.getUser(comment.userId).toPromise().then(
          (user: User | undefined) => {
            console.log(`User data for ${comment.userId}:`, user);
            console.log(`User photo field for ${comment.userId}:`, user?.photo);
            if (user) {
              const userData = {
                id: user.id,
                type: user.type || 'unknown',
                name: user.name || 'Utilisateur inconnu',
                photo: user.photo || null,
                commentTextLength: 0,
                editTextLength: 0,
                job: user.job || undefined
              };
              this.userCache.set(comment.userId, userData);
            } else {
              console.warn(`No user data for ${comment.userId}`);
              this.userCache.set(comment.userId, {
                id: comment.userId,
                type: 'unknown',
                name: 'Utilisateur inconnu',
                photo: null,
                commentTextLength: 0,
                editTextLength: 0
              });
            }
          },
          (error: any) => {
            console.error(`Error fetching user ${comment.userId}:`, error);
            this.userCache.set(comment.userId, {
              id: comment.userId,
              type: 'unknown',
              name: 'Utilisateur inconnu',
              photo: null,
              commentTextLength: 0,
              editTextLength: 0
            });
          }
        );
      }
      return Promise.resolve();
    });

    await Promise.all(userPromises);
    console.log('User cache after loading:', this.userCache);
    this.isLoadingUsers = false;
    this.cdr.markForCheck();
  }

  getUserImage(userId: string): string {
    const user = this.userCache.get(userId);
    if (user && user.photo) {
      const normalizedUrl = this.normalizeImageUrl(user.photo);
      console.log(`Image URL for user ${userId}:`, normalizedUrl);
      return normalizedUrl;
    }
    console.log(`No image for user ${userId}, using fallback`);
    return '/assets/default-avatar.png';
  }

  normalizeImageUrl(url: string | null | undefined): string {
    if (!url || url.includes('undefined') || url.includes('null')) {
      return '/assets/default-avatar.png';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    const path = url.startsWith('/') ? url.slice(1) : url;
    const normalizedUrl = `${base}${path}`;
    console.log(`Normalized URL: ${url} -> ${normalizedUrl}`);
    return normalizedUrl;
  }

  handleImageError(event: any) {
    console.log('Image failed to load:', event.target.src);
    event.target.classList.add('error');
  }

  addComment() {
    const commentText = this.commentForm.get('newComment')?.value;
    console.log('Add Comment - Form valid:', this.commentForm.valid);
    console.log('Add Comment - newComment value:', commentText);
    console.log('Add Comment - newComment errors:', this.commentForm.get('newComment')?.errors);
    console.log('Add Comment - isSending:', this.isSending);
    console.log('Add Comment - publication.id:', this.publication.id);
    console.log('Add Comment - loggedInUserId:', this.loggedInUserId);

    if (this.isSending) {
      this.snackBar.open('Envoi en cours, veuillez patienter', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }

    const trimmedComment = (commentText || '').trim();
    if (!trimmedComment) {
      this.snackBar.open('Le commentaire ne peut pas être vide', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }

    if (trimmedComment.length < 3) {
      this.snackBar.open('Minimum 3 caractères', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }

    if (trimmedComment.length > 500) {
      this.snackBar.open('Maximum 500 caractères', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }

    if (!this.loggedInUserId) {
      this.snackBar.open('Vous devez être connecté pour commenter', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }

    if (!this.publication.id || !/^[0-9a-fA-F]{24}$/.test(this.publication.id)) {
      this.snackBar.open('Erreur : ID de publication invalide', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }

    this.isSending = true;
    this.cdr.markForCheck();
    const timeoutId = setTimeout(() => {
      this.isSending = false;
      this.snackBar.open('Erreur : La requête a pris trop de temps', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      this.cdr.markForCheck();
    }, 10000);

    const cachedUser = this.userCache.get(this.loggedInUserId);
    if (cachedUser) {
      this.submitComment(trimmedComment, cachedUser.name, cachedUser.photo, cachedUser.type, timeoutId);
    } else {
      this.userService.getUser(this.loggedInUserId).subscribe({
        next: (user: User | undefined) => {
          console.log('Fetched user for comment:', user);
          console.log('User photo field for comment:', user?.photo);
          if (user) {
            const userName = user.name || 'Utilisateur inconnu';
            const userImageUrl = user.photo || null;
            const userType = user.type || 'unknown';
            this.userCache.set(this.loggedInUserId, {
              id: this.loggedInUserId,
              type: userType,
              name: userName,
              photo: userImageUrl,
              commentTextLength: 0,
              editTextLength: 0,
              job: user.job || undefined
            });
            this.submitComment(trimmedComment, userName, userImageUrl, userType, timeoutId);
          } else {
            console.warn(`No user data for ${this.loggedInUserId} in submitComment`);
            const userName = 'Utilisateur inconnu';
            const userType = 'unknown';
            this.userCache.set(this.loggedInUserId, {
              id: this.loggedInUserId,
              type: userType,
              name: userName,
              photo: null,
              commentTextLength: 0,
              editTextLength: 0
            });
            this.submitComment(trimmedComment, userName, null, userType, timeoutId);
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching user for comment:', error);
          const userName = 'Utilisateur inconnu';
          const userType = 'unknown';
          this.userCache.set(this.loggedInUserId, {
            id: this.loggedInUserId,
            type: userType,
            name: userName,
            photo: null,
            commentTextLength: 0,
            editTextLength: 0
          });
          this.submitComment(trimmedComment, userName, null, userType, timeoutId);
          this.cdr.markForCheck();
        }
      });
    }
  }

  private submitComment(text: string, userName: string, userImageUrl: string | null, userType: string, timeoutId: any) {
    console.log('[Debug] Submitting comment:', { publicationId: this.publication.id, userId: this.loggedInUserId, text });
    this.data.publicationService.addComment(this.publication.id!, this.loggedInUserId, text).subscribe({
      next: (response) => {
        console.log('[Debug] Comment added successfully:', response);
        this.snackBar.open('Commentaire ajouté avec succès', 'OK', {
          duration: 3000,
          panelClass: ['bg-green-600', 'text-white'],
        });
        this.commentForm.reset();
        this.isSending = false;
        clearTimeout(timeoutId);
        this.fetchPublication(); // Refresh data instead of pushing locally
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.error('[Debug] Error adding comment:', error);
        let errorMessage = 'Impossible d\'ajouter le commentaire';
        if (error.status === 401) errorMessage = 'Vous devez être connecté';
        else if (error.status === 404) errorMessage = 'Publication non trouvée';
        else if (error.status === 400 && error.error?.message) errorMessage = error.error.message;
        this.snackBar.open(`Erreur : ${errorMessage}`, 'Fermer', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white'],
        });
        this.isSending = false;
        clearTimeout(timeoutId);
        this.cdr.markForCheck();
      },
    });
  }

  private isValidId(id: string | undefined): boolean {
    return !!id && /^[0-9a-fA-F]{24}$/.test(id);
  }

  startEditing(comment: Comment) {
    if (!this.isValidId(comment.id)) {
      console.error('[Debug] Cannot edit comment: Invalid or missing comment ID', comment);
      this.snackBar.open('Erreur : Commentaire invalide (ID manquant ou invalide)', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }
    console.log('[Debug] Start Editing - Comment:', comment);
    this.editingCommentId = comment.id;
    this.editCommentControl.setValue(comment.text);
    this.cdr.markForCheck();
  }

  isEditingComment(commentId: string | undefined): boolean {
    return this.editingCommentId === commentId;
  }

  cancelEditing() {
    this.editingCommentId = undefined; // Changed to undefined
    this.editCommentControl.reset();
    this.cdr.markForCheck();
  }

  saveEditedComment(comment: Comment) {
    if (!this.isValidId(comment.id) || !this.isValidId(this.publication.id)) {
      console.error('[Debug] Cannot save edited comment: Invalid or missing IDs', { commentId: comment.id, publicationId: this.publication.id });
      this.snackBar.open('Erreur : IDs manquants ou invalides', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }
    const newText = this.editCommentControl.value;
    if (!newText || newText.trim().length === 0) {
      this.snackBar.open('Le commentaire ne peut pas être vide', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }
    if (newText.trim().length < 3) {
      this.snackBar.open('Minimum 3 caractères', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }
    if (newText.trim().length > 500) {
      this.snackBar.open('Maximum 500 caractères', 'Fermer', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
      return;
    }
    console.log('[Debug] Saving edited comment:', { publicationId: this.publication.id, commentId: comment.id, newText });
    this.data.publicationService.updateComment(this.publication.id!, comment.id!, newText.trim()).subscribe({
      next: (response) => {
        console.log('[Debug] Comment updated successfully:', response);
        this.snackBar.open('Commentaire modifié avec succès', 'OK', {
          duration: 3000,
          panelClass: ['bg-green-600', 'text-white']
        });
        this.fetchPublication();
        this.editingCommentId = undefined; // Changed to undefined
        this.editCommentControl.reset();
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.error('[Debug] Error updating comment:', error);
        let errorMessage = 'Impossible de modifier le commentaire';
        if (error.status === 401) errorMessage = 'Vous n’êtes pas autorisé à modifier ce commentaire';
        else if (error.status === 404) errorMessage = 'Commentaire ou publication non trouvé';
        else if (error.status === 400 && error.error?.message) errorMessage = error.error.message;
        this.snackBar.open(`Erreur : ${errorMessage}`, 'Fermer', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
        this.cdr.markForCheck();
      }
    });
  }

deleteComment(comment: Comment) {
  if (!this.isValidId(comment.id) || !this.isValidId(this.publication.id)) {
    console.error('[Error] Cannot delete comment: Invalid or missing IDs', { commentId: comment.id, publicationId: this.publication.id });
    this.snackBar.open('Erreur : IDs manquants ou invalides', 'Fermer', {
      duration: 3000,
      panelClass: ['bg-red-600', 'text-white']
    });
    return;
  }
  if (comment.userId !== this.loggedInUserId) {
    console.error('[Error] User not authorized to delete comment', { commentUserId: comment.userId, loggedInUserId: this.loggedInUserId });
    this.snackBar.open('Erreur : Vous n’êtes pas autorisé à supprimer ce commentaire', 'Fermer', {
      duration: 3000,
      panelClass: ['bg-red-600', 'text-white']
    });
    return;
  }
  console.log('[Debug] Deleting comment:', { publicationId: this.publication.id, commentId: comment.id, userId: this.loggedInUserId });
  this.isSending = true;
  this.cdr.markForCheck();
  this.data.publicationService.deleteComment(this.publication.id!, comment.id!, this.loggedInUserId).subscribe({
    next: (response) => {
      console.log('[Debug] Comment deleted successfully:', response);
      this.snackBar.open('Commentaire supprimé avec succès', 'OK', {
        duration: 3000,
        panelClass: ['bg-green-600', 'text-white']
      });
      this.fetchPublication();
      this.isSending = false;
      this.cdr.markForCheck();
    },
    error: (error: HttpErrorResponse) => {
      console.error('[Error] Error deleting comment:', {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        errorBody: error.error,
        url: error.url
      });
      let errorMessage = 'Erreur lors de la suppression du commentaire';
      if (error.status === 401) {
        errorMessage = 'Vous n’êtes pas autorisé à supprimer ce commentaire';
      } else if (error.status === 404) {
        errorMessage = 'Commentaire ou publication non trouvé';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || error.error?.error || 'Le corps de la requête ne peut pas être vide';
      } else if (error.status === 500) {
        errorMessage = 'Erreur serveur, veuillez réessayer plus tard';
      } else if (error.status === 0) {
        errorMessage = 'Erreur réseau ou serveur inaccessible';
      }
      this.snackBar.open(errorMessage, 'Fermer', {
      duration: 5000,
      panelClass: ['bg-red-600', 'text-white']
      });
      this.isSending = false;
      this.cdr.markForCheck();
    }
  });
}

  fetchPublication() {
    this.data.publicationService.fetchPublications(this.publication.providerId).subscribe({
      next: (publications: Publication[]) => {
        const updatedPublication = publications.find(p => p.id === this.publication.id);
        if (updatedPublication) {
          this.publication = updatedPublication;
          console.log('[Debug] Fetched publication:', {
            id: updatedPublication.id,
            title: updatedPublication.title,
            comments: updatedPublication.comments.map(c => ({
              id: c.id,
              text: c.text,
              userId: c.userId
            }))
          });
          updatedPublication.comments.forEach((comment, index) => {
            if (!this.isValidId(comment.id)) {
              console.error(`[Debug] Invalid comment ID at index ${index}:`, comment);
            }
          });
          this.loadUserData();
        } else {
          console.error('[Debug] Publication not found:', this.publication.id);
          this.snackBar.open('Publication non trouvée', 'Fermer', {
            duration: 3000,
            panelClass: ['bg-red-600', 'text-white']
          });
        }
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.error('[Debug] Error fetching publication:', error);
        this.snackBar.open(`Erreur : ${error.message || 'Impossible de charger la publication'}`, 'Fermer', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
        this.cdr.markForCheck();
      }
    });
  }

  logFormState() {
    console.log('Form value:', this.commentForm.value);
    console.log('Form valid:', this.commentForm.valid);
    console.log('newComment errors:', this.commentForm.get('newComment')?.errors);
  }

  logInput(event: Event) {
    console.log('Raw input value:', (event.target as HTMLTextAreaElement).value);
  }
}