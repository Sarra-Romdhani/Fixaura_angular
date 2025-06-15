import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FactureService } from '../../services/facture.service';
import { Facture } from '../../classes/facture.model';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-facture-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css'],
})
export class FactureListComponent implements OnInit {
  factures: Facture[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  prestataireId: string | null = null;

  constructor(
    private factureService: FactureService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('[DEBUG] FactureListComponent: ngOnInit called');
    this.route.paramMap.subscribe(params => {
      this.prestataireId = params.get('id');
      console.log('[DEBUG] FactureListComponent: prestataireId from params:', this.prestataireId);

      if (!this.prestataireId) {
        this.prestataireId = localStorage.getItem('prestataireId');
        console.log('[DEBUG] FactureListComponent: prestataireId from localStorage:', this.prestataireId);
      }

      if (!this.prestataireId) {
        console.log('[DEBUG] FactureListComponent: No prestataireId, navigating to /login');
        this.router.navigate(['/login']);
        return;
      }
    });
    this.fetchFactures();
  }

  fetchFactures(): void {
    if (!this.prestataireId) {
      console.log('[DEBUG] FactureListComponent: prestataireId is null');
      this.errorMessage = 'Prestataire ID non défini';
      this.isLoading = false;
      this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000 });
      return;
    }
    console.log(`[DEBUG] Fetching factures for prestataire: ${this.prestataireId}`);
    this.isLoading = true;
    this.factureService.getFacturesByPrestataire(this.prestataireId).subscribe({
      next: (factures) => {
        console.log('[DEBUG] Factures received:', factures);
        this.factures = factures;
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('[ERROR] API Error:', error);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des factures';
        this.snackBar.open(this.errorMessage, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  navigateToDetails(facture: Facture): void {
    if (this.prestataireId) {
      console.log(`[DEBUG] Navigating to facture details: ${facture.id}`);
      this.router.navigate([`/factures/${this.prestataireId}/${facture.id}`]);
    } else {
      console.log('[DEBUG] prestataireId missing, cannot navigate to details');
      this.snackBar.open('Prestataire ID manquant', 'Fermer', { duration: 5000 });
    }
  }

  goBack(): void {
    if (this.prestataireId) {
      console.log(`[DEBUG] Navigating back to profile: ${this.prestataireId}`);
      this.router.navigate([`/profile/${this.prestataireId}`]);
    } else {
      console.log('[DEBUG] Navigating to home');
      this.router.navigate(['/home']);
    }
  }

  isRecent(facture: Facture): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return facture.date > thirtyDaysAgo;
  }
}