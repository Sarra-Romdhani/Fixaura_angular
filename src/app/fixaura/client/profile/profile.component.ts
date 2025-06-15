import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { ProfileEditDialogComponent } from '../profile-edit-dialog/profile-edit-dialog.component';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface User {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  language: string;
  image?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User = {
    name: '',
    phone: '',
    email: '',
    address: '',
    language: 'French'
  };
  loading: boolean = true;
  errorMessage: string | null = null;
  private apiUrl = environment.baseUrl || 'http://localhost:3000';
  private subscription: Subscription | null = null;
  private clientId: string | null = null;
  private category: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.subscription = this.route.queryParamMap.subscribe(params => {
      this.clientId = params.get('clientId');
      this.category = params.get('category');
      console.log('ProfileComponent - Query Params:', { clientId: this.clientId, category: this.category });
      if (this.clientId) {
        this.fetchUserProfile(this.clientId);
      } else {
        this.errorMessage = 'Aucun ID utilisateur fourni dans l\'URL.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchUserProfile(clientId: string) {
    this.loading = true;
    this.errorMessage = null;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    this.http.get<ApiResponse<any>>(`${this.apiUrl}/clients/${clientId}`, { headers }).subscribe({
      next: (response) => {
        console.log('Profile API Raw Response:', JSON.stringify(response, null, 2));
        if (response.success && response.data) {
          const userData = response.data;
          this.user = {
            _id: userData._id,
            name: userData.name || 'Nom inconnu',
            phone: userData.phoneNumber || 'Téléphone non fourni',
            email: userData.email || 'Email non fourni',
            address: userData.homeAddress || 'Adresse non fournie',
            language: userData.language || 'French',
            image: userData.image ? `${this.apiUrl}${userData.image}` : undefined
          };
          console.log('Processed User Data:', JSON.stringify(this.user, null, 2));
          console.log('Image URL:', this.user.image || 'Using placeholder');
        } else {
          this.errorMessage = 'Erreur lors de la récupération du profil.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching profile:', JSON.stringify(err, null, 2));
        this.errorMessage = err.status === 404 ? 'Utilisateur non trouvé.' : 'Erreur lors de la récupération du profil.';
        this.loading = false;
      }
    });
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(ProfileEditDialogComponent, {
      width: '400px',
      data: { ...this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result); // Debug log
      if (result) {
        this.updateProfile(result.user, result.file);
      }
    });
  }

  updateProfile(updatedUser: User, file?: File) {
    this.loading = true;
    this.errorMessage = null;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    const formData = new FormData();
    formData.append('name', updatedUser.name);
    formData.append('phoneNumber', updatedUser.phone);
    formData.append('email', updatedUser.email);
    formData.append('homeAddress', updatedUser.address);
    if (file) {
      formData.append('file', file, file.name); // Ensure file name is included
    }

    console.log('FormData being sent:', { // Debug log
      name: updatedUser.name,
      phoneNumber: updatedUser.phone,
      email: updatedUser.email,
      homeAddress: updatedUser.address,
      file: file ? file.name : 'No file'
    });

    this.http.put<ApiResponse<any>>(`${this.apiUrl}/clients/${this.clientId}`, formData, { headers }).subscribe({
      next: (response) => {
        console.log('Update API Response:', JSON.stringify(response, null, 2)); // Debug log
        if (response.success && response.data) {
          this.user = {
            _id: response.data._id,
            name: response.data.name,
            phone: response.data.phoneNumber,
            email: response.data.email,
            address: response.data.homeAddress,
            language: this.user.language,
            image: response.data.image ? `${this.apiUrl}${response.data.image}` : undefined
          };
          this.snackBar.open('Profil mis à jour avec succès', 'Fermer', { duration: 3000 });
        } else {
          this.errorMessage = response.message || 'Erreur lors de la mise à jour du profil.';
          this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000 });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating profile:', JSON.stringify(err, null, 2));
        this.errorMessage = err.error?.message || err.status === 404 ? 'Utilisateur non trouvé.' : 'Erreur lors de la mise à jour du profil.';
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onImageError() {
    console.log('Image failed to load, switching to placeholder');
    this.user.image = 'assets/images/placeholder1.jpg';
  }

  navigateToHistorique() {
    console.log('Navigating to historique with:', { clientId: this.clientId, category: this.category });
    this.router.navigate(['/historique'], {
      queryParams: {
        clientId: this.clientId,
        category: this.category
      }
    });
  }

  logout() {
    console.log('Logging out user:', this.user._id);
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    this.router.navigate(['/login']);
  }
}