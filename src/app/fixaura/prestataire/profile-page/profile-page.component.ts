// // import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// // import { Subscription, interval } from 'rxjs';
// // import { PrestataireService } from '../../services/prestataire.service';
// // import { SocketService } from '../../services/socket.service';
// // import { Prestataire } from '../../classes/prestataire.model';
// // import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// // import { CalendarDialogComponent } from '../calendar-dialog/calendar-dialog.component';
// // import { environment } from '../../environments/environment';
// // import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// // import { MatButtonModule } from '@angular/material/button';
// // import { MatListModule } from '@angular/material/list';
// // import { MatDividerModule } from '@angular/material/divider';
// // import { MatBadgeModule } from '@angular/material/badge';
// // import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// // import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// // import { PublicationComponent } from '../publication/publication.component';
// // import { ServiceComponent } from '../service/service.component';
// // import { AddPublicationDialogComponent } from '../add-publication-dialog/add-publication-dialog.component';
// // import { AddServiceComponent } from '../add-service/add-service.component';
// // import { NavbarComponent } from '../navbar/navbar.component';
// // import { FormBuilder, Validators } from '@angular/forms';

// // @Component({
// //   selector: 'app-profile-page',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     RouterModule,
// //     MatProgressSpinnerModule,
// //     MatButtonModule,
// //     MatListModule,
// //     MatDividerModule,
// //     MatDialogModule,
// //     MatBadgeModule,
// //     MatSnackBarModule,
// //     MatSlideToggleModule,
// //     PublicationComponent,
// //     ServiceComponent,
// //     AddPublicationDialogComponent,
// //     AddServiceComponent,
// //     NavbarComponent
// //   ],
// //   templateUrl: './profile-page.component.html',
// //   styleUrls: ['./profile-page.component.scss']
// // })
// // export class ProfilePageComponent implements OnInit, OnDestroy {
// //   userId: string = '';
// //   loggedInUserId: string = '';
// //   selectedIndex: number = 0;
// //   currentIndex: number = 3; // Profile page index
// //   isAdding: boolean = false;
// //   profileData: Prestataire | null = null;
// //   isLoading: boolean = true;
// //   hasError: boolean = false;
// //   unreadMessagesCount: number = 0;
// //   isSettingsOpen: boolean = false;
// //   isDarkMode: boolean = false;
// //   baseUrl = environment.baseUrl;

// //   private subscriptions: Subscription[] = [];

// //   constructor(
// //     private route: ActivatedRoute,
// //     private router: Router,
// //     private prestataireService: PrestataireService,
// //     private socketService: SocketService,
// //     private dialog: MatDialog,
// //     private snackBar: MatSnackBar,
// //     private cdr: ChangeDetectorRef,
// //     private fb: FormBuilder
// //   ) {}

// //   ngOnInit(): void {
// //     this.userId = this.route.snapshot.paramMap.get('userId') || '';
// //     this.loggedInUserId = this.route.snapshot.queryParams['loggedInUserId'] || this.userId;
// //     if (!this.userId) {
// //       this.snackBar.open('User ID is missing', 'Close', { duration: 3000 });
// //       this.router.navigate(['/login']);
// //       return;
// //     }
// //     this.fetchProfileData();
// //     this.setupSocket();
// //     this.startMessageCheckTimer();
// //     this.applyTheme();
// //   }

// //   private applyTheme(): void {
// //     this.prestataireService.fetchDarkModePreference(this.userId).subscribe({
// //       next: (darkMode: boolean) => {
// //         this.isDarkMode = darkMode;
// //         document.documentElement.classList.toggle('dark-theme', darkMode);
// //         this.cdr.detectChanges();
// //       },
// //       error: (err) => console.error('Error fetching dark mode preference:', err)
// //     });
// //   }

// //   toggleTheme(checked: boolean): void {
// //     this.isDarkMode = checked;
// //     this.prestataireService.updateDarkModePreference(this.userId, checked).subscribe({
// //       next: () => {
// //         document.documentElement.classList.toggle('dark-theme', checked);
// //         this.cdr.detectChanges();
// //       },
// //       error: (err) => {
// //         console.error('Error updating dark mode preference:', err);
// //         this.snackBar.open('Failed to update theme', 'Close', { duration: 3000 });
// //         this.isDarkMode = !checked; // Revert toggle on error
// //         this.cdr.detectChanges();
// //       }
// //     });
// //   }

// //   fetchProfileData(): void {
// //     this.isLoading = true;
// //     this.hasError = false;
// //     this.prestataireService.fetchPrestataire(this.userId).subscribe({
// //       next: data => {
// //         console.log('[DEBUG] ProfilePageComponent: Received prestataire:', data);
// //         this.profileData = data;
// //         this.isLoading = false;
// //         this.cdr.detectChanges();
// //       },
// //       error: err => {
// //         console.error('[ERROR] ProfilePageComponent: Error fetching profile:', err.message);
// //         this.isLoading = false;
// //         this.hasError = true;
// //         this.snackBar.open(`Failed to load profile: ${err.message}`, 'Retry', {
// //           duration: 5000,
// //           panelClass: ['bg-red-600', 'text-white']
// //         }).onAction().subscribe(() => this.fetchProfileData());
// //       }
// //     });
// //   }

// //   setupSocket(): void {
// //     this.socketService.connect(
// //       this.userId,
// //       (data) => {
// //         if (data.receiverId === this.userId && data.senderId !== this.userId) {
// //           this.unreadMessagesCount++;
// //           this.socketService.setUnreadMessagesCount(this.unreadMessagesCount);
// //           this.cdr.detectChanges();
// //         }
// //       },
// //       (messageIds) => {
// //         this.checkNewMessages();
// //       },
// //       () => {
// //         console.log('[DEBUG] Socket disconnected');
// //       }
// //     );

// //     const sub = this.socketService.getUnreadMessagesCount().subscribe(count => {
// //       this.unreadMessagesCount = count;
// //       this.cdr.detectChanges();
// //     });
// //     this.subscriptions.push(sub);

// //     this.checkNewMessages();
// //   }

// //   checkNewMessages(): void {
// //     fetch(`${environment.baseUrl}/messages/conversations?userId=${this.userId}`, {
// //       headers: { 'Accept': 'application/json' }
// //     })
// //       .then(response => {
// //         if (!response.ok) throw new Error(`HTTP error ${response.status}`);
// //         return response.json();
// //       })
// //       .then(data => {
// //         const unreadCount = data.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
// //         this.socketService.setUnreadMessagesCount(unreadCount);
// //         this.cdr.detectChanges();
// //       })
// //       .catch(error => console.error('[ERROR] Error checking messages:', error));
// //   }

// //   startMessageCheckTimer(): void {
// //     const sub = interval(30000).subscribe(() => {
// //       if (this.dialog.openDialogs.length === 0) {
// //         this.checkNewMessages();
// //       }
// //     });
// //     this.subscriptions.push(sub);
// //   }

// //   toggleAddForm(): void {
// //     this.isAdding = !this.isAdding;
// //     this.cdr.detectChanges();
// //   }

// //   onTabSelected(index: number): void {
// //     this.selectedIndex = index;
// //     this.isAdding = false;
// //     this.cdr.detectChanges();
// //   }

// //   openCalendar(): void {
// //     console.log(`[DEBUG] Opening calendar dialog for prestataireId: ${this.userId}`);
// //     this.dialog.open(CalendarDialogComponent, {
// //       width: '400px',
// //       data: {
// //         prestataireId:this.userId,
// //         loggedInUserId: this.loggedInUserId,
// //         focusedDay: new Date(),
// //         selectedDate: null
// //       }
// //     });
// //   }

// //   toggleSettingsPopup(): void {
// //     this.isSettingsOpen = !this.isSettingsOpen;
// //     this.cdr.detectChanges();
// //   }

// //   navigateTo(route: string): void {
// //     this.isSettingsOpen = false;
// //     this.router.navigate([route], { queryParams: { loggedInUserId: this.loggedInUserId } });
// //   }

// //   signOut(): void {
// //     this.isSettingsOpen = false;
// //     this.socketService.disconnect();
// //     this.router.navigate(['/login']);
// //   }

// //   scanQR(): void {
// //     console.log('QR scanning not implemented for web');
// //   }

// //   openAddPublicationDialog(): void {
// //     const form = this.fb.group({
// //       title: ['', Validators.required],
// //       description: ['', Validators.required],
// //       image: [null]
// //     });

// //     this.dialog.open(AddPublicationDialogComponent, {
// //       width: '90%',
// //       maxWidth: '500px',
// //       panelClass: 'custom-dialog',
// //       data: {
// //         form,
// //         imagePreview: null,
// //         providerId: this.userId,
// //         userId: this.userId,
// //         loggedInUserId: this.loggedInUserId
// //       }
// //     });
// //   }

// //   openAddServiceDialog(): void {
// //     this.dialog.open(AddServiceComponent, {
// //       width: '500px',
// //       data: { userId: this.userId, loggedInUserId: this.loggedInUserId }
// //     });
// //   }

// //   ngOnDestroy(): void {
// //     console.log('[DEBUG] ProfilePageComponent: ngOnDestroy called');
// //     this.subscriptions.forEach(sub => sub.unsubscribe());
// //     this.socketService.disconnect();
// //   }
// // }


// import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { Subscription, interval } from 'rxjs';
// import { PrestataireService } from '../../services/prestataire.service';
// import { SocketService } from '../../services/socket.service';
// import { Prestataire } from '../../classes/prestataire.model';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { CalendarDialogComponent } from '../calendar-dialog/calendar-dialog.component';
// import { environment } from '../../environments/environment';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatButtonModule } from '@angular/material/button';
// import { MatListModule } from '@angular/material/list';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatBadgeModule } from '@angular/material/badge';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { PublicationComponent } from '../publication/publication.component';
// import { ServiceComponent } from '../service/service.component';
// import { AddPublicationDialogComponent } from '../add-publication-dialog/add-publication-dialog.component';
// import { AddServiceComponent } from '../add-service/add-service.component';
// import { NavbarComponent } from '../navbar/navbar.component';
// import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { AdminService } from '../../services/AdminService.service';

// @Component({
//   selector: 'app-profile-page',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     MatProgressSpinnerModule,
//     MatButtonModule,
//     MatListModule,
//     MatDividerModule,
//     MatDialogModule,
//     MatBadgeModule,
//     MatSnackBarModule,
//     MatSlideToggleModule,
//     MatInputModule,
//     MatFormFieldModule,
//     FormsModule,
//     ReactiveFormsModule,
//     PublicationComponent,
//     ServiceComponent,
//     AddPublicationDialogComponent,
//     AddServiceComponent,
//     NavbarComponent
//   ],
//   templateUrl: './profile-page.component.html',
//   styleUrls: ['./profile-page.component.scss']
// })
// export class ProfilePageComponent implements OnInit, OnDestroy {
//   userId: string = '';
//   loggedInUserId: string = '';
//   selectedIndex: number = 0;
//   currentIndex: number = 3; // Profile page index
//   isAdding: boolean = false;
//   profileData: Prestataire | null = null;
//   isLoading: boolean = true;
//   hasError: boolean = false;
//   unreadMessagesCount: number = 0;
//   isSettingsOpen: boolean = false;
//   isDarkMode: boolean = false;
//   isFlagging: boolean = false; // New flag to toggle flagging form
//   flagForm: FormGroup; // Form for flagging
//   baseUrl = environment.baseUrl;

//   private subscriptions: Subscription[] = [];

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private prestataireService: PrestataireService,
//     private socketService: SocketService,
//     private adminService: AdminService,
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private cdr: ChangeDetectorRef,
//     private fb: FormBuilder
//   ) {
//     // Initialize flag form
//     this.flagForm = this.fb.group({
//       reason: ['', [Validators.required, Validators.minLength(10)]],
//     });
//   }

//   ngOnInit(): void {
//     this.userId = this.route.snapshot.paramMap.get('userId') || '';
//     this.loggedInUserId = this.route.snapshot.queryParams['loggedInUserId'] || this.userId;
//     if (!this.userId) {
//       this.snackBar.open('User ID is missing', 'Close', { duration: 3000 });
//       this.router.navigate(['/login']);
//       return;
//     }
//     this.fetchProfileData();
//     this.setupSocket();
//     this.startMessageCheckTimer();
//     this.applyTheme();
//   }

//   private applyTheme(): void {
//     this.prestataireService.fetchDarkModePreference(this.userId).subscribe({
//       next: (darkMode: boolean) => {
//         this.isDarkMode = darkMode;
//         document.documentElement.classList.toggle('dark-theme', darkMode);
//         this.cdr.detectChanges();
//       },
//       error: (err) => console.error('Error fetching dark mode preference:', err)
//     });
//   }

//   toggleTheme(checked: boolean): void {
//     this.isDarkMode = checked;
//     this.prestataireService.updateDarkModePreference(this.userId, checked).subscribe({
//       next: () => {
//         document.documentElement.classList.toggle('dark-theme', checked);
//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         console.error('Error updating dark mode preference:', err);
//         this.snackBar.open('Failed to update theme', 'Close', { duration: 3000 });
//         this.isDarkMode = !checked; // Revert toggle on error
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   fetchProfileData(): void {
//     this.isLoading = true;
//     this.hasError = false;
//     this.prestataireService.fetchPrestataire(this.userId).subscribe({
//       next: data => {
//         console.log('[DEBUG] ProfilePageComponent: Received prestataire:', data);
//         this.profileData = data;
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       },
//       error: err => {
//         console.error('[ERROR] ProfilePageComponent: Error fetching profile:', err.message);
//         this.isLoading = false;
//         this.hasError = true;
//         this.snackBar.open(`Failed to load profile: ${err.message}`, 'Retry', {
//           duration: 5000,
//           panelClass: ['bg-red-600', 'text-white']
//         }).onAction().subscribe(() => this.fetchProfileData());
//       }
//     });
//   }

//   setupSocket(): void {
//     this.socketService.connect(
//       this.userId,
//       (data) => {
//         if (data.receiverId === this.userId && data.senderId !== this.userId) {
//           this.unreadMessagesCount++;
//           this.socketService.setUnreadMessagesCount(this.unreadMessagesCount);
//           this.cdr.detectChanges();
//         }
//       },
//       (messageIds) => {
//         this.checkNewMessages();
//       },
//       () => {
//         console.log('[DEBUG] Socket disconnected');
//       }
//     );

//     const sub = this.socketService.getUnreadMessagesCount().subscribe(count => {
//       this.unreadMessagesCount = count;
//       this.cdr.detectChanges();
//     });
//     this.subscriptions.push(sub);

//     this.checkNewMessages();
//   }

//   checkNewMessages(): void {
//     fetch(`${environment.baseUrl}/messages/conversations?userId=${this.userId}`, {
//       headers: { 'Accept': 'application/json' }
//     })
//       .then(response => {
//         if (!response.ok) throw new Error(`HTTP error ${response.status}`);
//         return response.json();
//       })
//       .then(data => {
//         const unreadCount = data.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
//         this.socketService.setUnreadMessagesCount(unreadCount);
//         this.cdr.detectChanges();
//       })
//       .catch(error => console.error('[ERROR] Error checking messages:', error));
//   }

//   startMessageCheckTimer(): void {
//     const sub = interval(30000).subscribe(() => {
//       if (this.dialog.openDialogs.length === 0) {
//         this.checkNewMessages();
//       }
//     });
//     this.subscriptions.push(sub);
//   }

//   toggleAddForm(): void {
//     this.isAdding = !this.isAdding;
//     this.cdr.detectChanges();
//   }

//   onTabSelected(index: number): void {
//     this.selectedIndex = index;
//     this.isAdding = false;
//     this.cdr.detectChanges();
//   }

//   openCalendar(): void {
//     console.log(`[DEBUG] Opening calendar dialog for prestataireId: ${this.userId}`);
//     this.dialog.open(CalendarDialogComponent, {
//       width: '400px',
//       data: {
//         prestataireId: this.userId,
//         loggedInUserId: this.loggedInUserId,
//         focusedDay: new Date(),
//         selectedDate: null
//       }
//     });
//   }

//   toggleFlagForm(): void {
//     this.isFlagging = !this.isFlagging;
//     if (!this.isFlagging) {
//       this.flagForm.reset(); // Reset form when closing
//     }
//     this.cdr.detectChanges();
//   }

//   submitFlag(): void {
//     if (this.flagForm.valid) {
//       const reason = this.flagForm.value.reason;
//       this.adminService.flagPrestataire(this.userId, reason).subscribe({
//         next: () => {
//           this.snackBar.open('Prestataire signalé avec succès', 'Close', { duration: 3000 });
//           this.toggleFlagForm(); // Close form
//           this.fetchProfileData(); // Refresh profile to update flag status
//         },
//         error: (err: { message: any; }) => {
//           console.error('Error flagging prestataire:', err);
//           this.snackBar.open(`Échec du signalement: ${err.message}`, 'Close', { duration: 5000 });
//         }
//       });
//     }
//   }

//   toggleSettingsPopup(): void {
//     this.isSettingsOpen = !this.isSettingsOpen;
//     this.cdr.detectChanges();
//   }

//   navigateTo(route: string): void {
//     this.isSettingsOpen = false;
//     this.router.navigate([route], { queryParams: { loggedInUserId: this.loggedInUserId } });
//   }

//   signOut(): void {
//     this.isSettingsOpen = false;
//     this.socketService.disconnect();
//     this.router.navigate(['/login']);
//   }

//   scanQR(): void {
//     console.log('QR scanning not implemented for web');
//   }

//   openAddPublicationDialog(): void {
//     const form = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       image: [null]
//     });

//     this.dialog.open(AddPublicationDialogComponent, {
//       width: '90%',
//       maxWidth: '500px',
//       panelClass: 'custom-dialog',
//       data: {
//         form,
//         imagePreview: null,
//         providerId: this.userId,
//         userId: this.userId,
//         loggedInUserId: this.loggedInUserId
//       }
//     });
//   }

//   openAddServiceDialog(): void {
//     this.dialog.open(AddServiceComponent, {
//       width: '500px',
//       data: { userId: this.userId, loggedInUserId: this.loggedInUserId }
//     });
//   }

//   ngOnDestroy(): void {
//     console.log('[DEBUG] ProfilePageComponent: ngOnDestroy called');
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//     this.socketService.disconnect();
//   }
// }

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { PrestataireService } from '../../services/prestataire.service';
import { SocketService } from '../../services/socket.service';
import { Prestataire } from '../../classes/prestataire.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CalendarDialogComponent } from '../calendar-dialog/calendar-dialog.component';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PublicationComponent } from '../publication/publication.component';
import { ServiceComponent } from '../service/service.component';
import { AddPublicationDialogComponent } from '../add-publication-dialog/add-publication-dialog.component';
import { AddServiceComponent } from '../add-service/add-service.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/AdminService.service';
import { FlagPrestataireDialogComponent } from '../flag-prestataire-dialog/flag-prestataire-dialog.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    PublicationComponent,
    ServiceComponent,
    AddPublicationDialogComponent,
    AddServiceComponent,
    NavbarComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  userId: string = '';
  loggedInUserId: string = '';
  selectedIndex: number = 0;
  currentIndex: number = 3;
  isAdding: boolean = false;
  profileData: Prestataire | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  unreadMessagesCount: number = 0;
  isSettingsOpen: boolean = false;
  baseUrl = environment.baseUrl;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prestataireService: PrestataireService,
    private socketService: SocketService,
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loggedInUserId = this.route.snapshot.queryParamMap.get('loggedId') || this.userId;

    console.log('Profile Prestataire ID:', this.userId);
    console.log('Logged-in User ID:', this.loggedInUserId);

    if (!this.userId) {
      console.warn('User ID is missing or invalid');
      this.snackBar.open('User ID is missing', 'Close', { duration: 3000 });
      this.hasError = true;
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.fetchProfileData();
    this.setupSocket();
    this.startMessageCheckTimer();
    this.subscriptions.push(
      this.themeService.isDarkMode$.subscribe((isDark) => {
        this.cdr.detectChanges();
      })
    );
  }

  fetchProfileData(): void {
    this.isLoading = true;
    this.hasError = false;
    this.prestataireService.fetchPrestataire(this.userId).subscribe({
      next: (data) => {
        console.log('[DEBUG] ProfilePageComponent: Received prestataire:', data);
        this.profileData = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ERROR] ProfilePageComponent: Error fetching profile:', err.message);
        this.isLoading = false;
        this.hasError = true;
        this.snackBar.open(`Failed to load profile: ${err.message}`, 'Retry', {
          duration: 5000,
          panelClass: ['bg-red-600', 'text-white'],
        }).onAction().subscribe(() => this.fetchProfileData());
      },
    });
  }

  setupSocket(): void {
    this.socketService.connect(
      this.userId,
      (data) => {
        if (data.receiverId === this.userId && data.senderId !== this.userId) {
          this.unreadMessagesCount++;
          this.socketService.setUnreadMessagesCount(this.unreadMessagesCount);
          this.cdr.detectChanges();
        }
      },
      (messageIds) => {
        this.checkNewMessages();
      },
      () => {
        console.log('[DEBUG] Socket disconnected');
      }
    );

    const sub = this.socketService.getUnreadMessagesCount().subscribe((count) => {
      this.unreadMessagesCount = count;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(sub);

    this.checkNewMessages();
  }

  checkNewMessages(): void {
    fetch(`${environment.baseUrl}/messages/conversations?userId=${this.userId}`, {
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const unreadCount = data.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
        this.socketService.setUnreadMessagesCount(unreadCount);
        this.cdr.detectChanges();
      })
      .catch((error) => console.error('[ERROR] Error checking messages:', error));
  }

  startMessageCheckTimer(): void {
    const sub = interval(30000).subscribe(() => {
      if (this.dialog.openDialogs.length === 0) {
        this.checkNewMessages();
      }
    });
    this.subscriptions.push(sub);
  }

  toggleAddForm(): void {
    this.isAdding = !this.isAdding;
    this.cdr.detectChanges();
  }

  onTabSelected(index: number): void {
    this.selectedIndex = index;
    this.isAdding = false;
    this.cdr.detectChanges();
  }

  openCalendar(): void {
    console.log(`[DEBUG] Opening calendar dialog for prestataireId: ${this.userId}`);
    this.dialog.open(CalendarDialogComponent, {
      width: '400px',
      data: {
        prestataireId: this.userId,
        loggedInUserId: this.loggedInUserId,
        focusedDay: new Date(),
        selectedDate: null,
      },
    });
  }

  openFlagDialog(): void {
    const dialogRef = this.dialog.open(FlagPrestataireDialogComponent, {
      width: '90%',
      maxWidth: '500px',
      panelClass: 'custom-dialog',
      data: { userId: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchProfileData();
      }
    });
  }

  toggleSettingsPopup(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
    this.cdr.detectChanges();
  }

  navigateTo(route: string): void {
    this.isSettingsOpen = false;
    this.router.navigate([route], { queryParams: { loggedId: this.loggedInUserId } });
  }

  signOut(): void {
    this.isSettingsOpen = false;
    this.socketService.disconnect();
    this.router.navigate(['/login']);
  }

  scanQR(): void {
    console.log('QR scanning not implemented for web');
  }

  openAddPublicationDialog(): void {
    const form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null]
    });

    this.dialog.open(AddPublicationDialogComponent, {
      width: '90%',
      maxWidth: '500px',
      panelClass: 'custom-dialog',
      data: {
        form,
        imagePreview: null,
        providerId: this.userId,
        userId: this.userId,
        loggedInUserId: this.loggedInUserId
      }
    });
  }

  openAddServiceDialog(): void {
    this.dialog.open(AddServiceComponent, {
      width: '500px',
      data: { userId: this.userId, loggedInUserId: this.loggedInUserId },
    });
  }

  ngOnDestroy(): void {
    console.log('[DEBUG] ProfilePageComponent: ngOnDestroy called');
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.socketService.disconnect();
  }
}