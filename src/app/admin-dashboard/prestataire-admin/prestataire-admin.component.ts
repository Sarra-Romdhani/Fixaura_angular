
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { FormsModule } from '@angular/forms';
// import { Chart, PieController, ArcElement, BarController, BarElement, Legend, Title, CategoryScale, LinearScale } from 'chart.js';
// import { forkJoin } from 'rxjs';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { AdminService, ApiResponse, Prestataire } from '../../services/AdminService.service';

// Chart.register(PieController, ArcElement, BarController, BarElement, Legend, Title, CategoryScale, LinearScale);

// @Component({
//   selector: 'app-prestataire-admin',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatButtonModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatToolbarModule,
//     FormsModule,
//     RouterLink,
//     RouterLinkActive,
//     DatePipe,
//   ],
//   templateUrl: './prestataire-admin.component.html',
//   styleUrls: ['./prestataire-admin.component.scss'],
// })
// export class PrestataireAdminComponent implements OnInit, OnDestroy {
//   prestataires: Prestataire[] = [];
//   deletedPrestataires: Prestataire[] = [];
//   errorMessage: string = '';
//   selectedPrestataireId: string = '';
//   reason: string = '';
//   isFlagging: boolean = false;
//   isDeleting: boolean = false;
//   hasPrestatairesWithRating: boolean = false;
//   private charts: Chart[] = [];
//   displayedColumns: string[] = ['name', 'email', 'rating', 'isFlagged', 'flagReason', 'actions'];
//   deletedColumns: string[] = ['name', 'email', 'status', 'deletionReason', 'deletedAt'];

//   constructor(private adminService: AdminService) {}

//   ngOnInit(): void {
//     this.loadData();
//   }

//   ngOnDestroy(): void {
//     this.charts.forEach((chart) => chart.destroy());
//   }

//   loadData(): void {
//     forkJoin({
//       prestataires: this.adminService.getAllPrestataires(),
//       deletedPrestataires: this.adminService.getDeletedPrestataires(),
//     }).subscribe({
//       next: ({ prestataires, deletedPrestataires }) => {
//         if (!prestataires) {
//           this.errorMessage = 'Erreur: Réponse vide du serveur pour les prestataires.';
//           this.prestataires = [];
//         } else if (prestataires.success === false) {
//           this.errorMessage = 'Erreur: Le serveur a signalé un échec pour les prestataires.';
//           this.prestataires = [];
//         } else if (!prestataires.data || !Array.isArray(prestataires.data)) {
//           this.errorMessage = 'Erreur: Données invalides ou absentes dans la réponse des prestataires.';
//           this.prestataires = [];
//         } else {
//           this.prestataires = prestataires.data.filter((p: Prestataire) => p.status !== 'supprimé') ?? [];
//           this.errorMessage = this.prestataires.length === 0 ? 'Aucun prestataire non supprimé trouvé.' : '';
//         }
//         this.deletedPrestataires = deletedPrestataires ?? [];
//         this.hasPrestatairesWithRating = this.prestataires.some((p) => p.rating != null && !isNaN(p.rating) && p.rating > 0);
//         this.updateCharts();
//       },
//       error: (err: any) => {
//         this.errorMessage = 'Erreur lors du chargement des données: ' + (err.message || 'Erreur inconnue');
//         console.error('Data Load Error:', err);
//       },
//     });
//   }

//   updateCharts(): void {
//     this.charts.forEach((chart) => chart.destroy());
//     this.charts = [];

//     if (this.hasPrestatairesWithRating) {
//       const topPrestataires = this.prestataires
//         .filter((p) => p.rating != null && !isNaN(p.rating) && p.rating > 0)
//         .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//         .slice(0, 5);
//       if (topPrestataires.length > 0) {
//         this.charts.push(
//           new Chart('topPrestatairesChart', {
//             type: 'bar',
//             data: {
//               labels: topPrestataires.map((p) => p.name || 'Inconnu'),
//               datasets: [
//                 {
//                   label: 'Évaluation Moyenne',
//                   data: topPrestataires.map((p) => p.rating || 0),
//                   backgroundColor: '#9966FF',
//                   borderColor: '#fff',
//                   borderWidth: 1,
//                 },
//               ],
//             },
//             options: {
//               responsive: true,
//               plugins: {
//                 legend: { position: 'top' },
//                 title: { display: true, text: 'Top Prestataires par Évaluation' },
//               },
//               scales: { y: { beginAtZero: true, max: 5 } },
//             },
//           }),
//         );
//       }
//     }

//     if (this.prestataires.length > 0) {
//       const flaggedCount = this.prestataires.filter((p) => p.isFlagged).length;
//       const nonFlaggedCount = this.prestataires.length - flaggedCount;
//       this.charts.push(
//         new Chart('flaggedPrestatairesChart', {
//           type: 'pie',
//           data: {
//             labels: ['Prestataires Signalés', 'Prestataires Non Signalés'],
//             datasets: [
//               {
//                 data: [flaggedCount, nonFlaggedCount],
//                 backgroundColor: ['#FF6384', '#36A2EB'],
//                 borderColor: '#fff',
//                 borderWidth: 1,
//               },
//             ],
//           },
//           options: {
//             responsive: true,
//             plugins: {
//               legend: { position: 'top' },
//               title: { display: true, text: 'Prestataires Signalés vs Non Signalés' },
//             },
//           },
//         }),
//       );
//     }
//   }

//   onFlagAccount(id: string): void {
//     this.selectedPrestataireId = id;
//     this.reason = '';
//     this.isFlagging = true;
//   }

//   onConfirmFlag(): void {
//     if (this.selectedPrestataireId && this.reason.trim()) {
//       this.adminService.flagPrestataire(this.selectedPrestataireId, this.reason.trim()).subscribe({
//         next: () => {
//           const prestataire = this.prestataires.find((p) => p._id === this.selectedPrestataireId);
//           if (prestataire) {
//             prestataire.isFlagged = true;
//             prestataire.flagReason = this.reason.trim();
//           }
//           this.updateCharts();
//           this.closeModal();
//           alert('Prestataire signalé avec succès.');
//         },
//         error: (err: any) => {
//           this.errorMessage = 'Erreur lors du signalement du prestataire.';
//           console.error('Flag Prestataire Error:', err);
//         },
//       });
//     } else {
//       alert('La raison du signalement ne peut pas être vide.');
//     }
//   }

//   onDelete(id: string): void {
//     this.selectedPrestataireId = id;
//     this.reason = '';
//     this.isDeleting = true;
//   }

//   onConfirmDelete(): void {
//     if (this.selectedPrestataireId && this.reason.trim()) {
//       this.adminService.deletePrestataire(this.selectedPrestataireId, this.reason.trim()).subscribe({
//         next: () => {
//           const deletedPrestataire = this.prestataires.find((p) => p._id === this.selectedPrestataireId);
//           if (deletedPrestataire) {
//             deletedPrestataire.status = 'supprimé';
//             deletedPrestataire.deletionReason = this.reason.trim();
//             deletedPrestataire.deletedAt = new Date();
//             this.deletedPrestataires = [...this.deletedPrestataires, deletedPrestataire];
//             this.prestataires = this.prestataires.filter((p) => p._id !== this.selectedPrestataireId);
//           }
//           this.updateCharts();
//           this.closeModal();
//           alert('Prestataire supprimé avec succès.');
//         },
//         error: (err: any) => {
//           this.errorMessage = 'Erreur lors de la suppression du prestataire.';
//           console.error('Delete Prestataire Error:', err);
//         },
//       });
//     } else {
//       alert('La raison de la suppression ne peut pas être vide.');
//     }
//   }

//   closeModal(): void {
//     this.isFlagging = false;
//     this.isDeleting = false;
//     this.selectedPrestataireId = '';
//     this.reason = '';
//   }
// }


import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { Chart, PieController, ArcElement, BarController, BarElement, Legend, Title, CategoryScale, LinearScale } from 'chart.js';
import { forkJoin } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminService, ApiResponse, Prestataire } from '../../services/AdminService.service';

Chart.register(PieController, ArcElement, BarController, BarElement, Legend, Title, CategoryScale, LinearScale);

@Component({
  selector: 'app-prestataire-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    DatePipe,
  ],
  templateUrl: './prestataire-admin.component.html',
  styleUrls: ['./prestataire-admin.component.scss'],
})
export class PrestataireAdminComponent implements OnInit, OnDestroy {
  prestataires: Prestataire[] = [];
  deletedPrestataires: Prestataire[] = [];
  errorMessage: string = '';
  selectedPrestataireId: string = '';
  reason: string = '';
  isFlagging: boolean = false;
  isDeleting: boolean = false;
  hasPrestatairesWithRating: boolean = false;
  private charts: Chart[] = [];
  displayedColumns: string[] = ['name', 'email', 'rating', 'status', 'isFlagged', 'flagCount', 'flagReason', 'deactivationUntil', 'actions'];
  deletedColumns: string[] = ['name', 'email', 'status', 'deletionReason', 'deletedAt'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.charts.forEach((chart) => chart.destroy());
  }

  loadData(): void {
    forkJoin({
      prestataires: this.adminService.getAllPrestataires(),
      deletedPrestataires: this.adminService.getDeletedPrestataires(),
    }).subscribe({
      next: ({ prestataires, deletedPrestataires }) => {
        if (!prestataires) {
          this.errorMessage = 'Erreur: Réponse vide du serveur pour les prestataires.';
          this.prestataires = [];
        } else if (prestataires.success === false) {
          this.errorMessage = 'Erreur: Le serveur a signalé un échec pour les prestataires.';
          this.prestataires = [];
        } else if (!prestataires.data || !Array.isArray(prestataires.data)) {
          this.errorMessage = 'Erreur: Données invalides ou absentes dans la réponse des prestataires.';
          this.prestataires = [];
        } else {
          this.prestataires = prestataires.data.filter((p: Prestataire) => p.status !== 'supprimé') ?? [];
          this.errorMessage = this.prestataires.length === 0 ? 'Aucun prestataire non supprimé trouvé.' : '';
        }
        this.deletedPrestataires = deletedPrestataires ?? [];
        this.hasPrestatairesWithRating = this.prestataires.some((p) => p.rating != null && !isNaN(p.rating) && p.rating > 0);
        this.updateCharts();
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors du chargement des données: ' + (err.message || 'Erreur inconnue');
        console.error('Data Load Error:', err);
      },
    });
  }

  updateCharts(): void {
    this.charts.forEach((chart) => chart.destroy());
    this.charts = [];

    if (this.hasPrestatairesWithRating) {
      const topPrestataires = this.prestataires
        .filter((p) => p.rating != null && !isNaN(p.rating) && p.rating > 0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5);
      if (topPrestataires.length > 0) {
        this.charts.push(
          new Chart('topPrestatairesChart', {
            type: 'bar',
            data: {
              labels: topPrestataires.map((p) => p.name || 'Inconnu'),
              datasets: [
                {
                  label: 'Évaluation Moyenne',
                  data: topPrestataires.map((p) => p.rating || 0),
                  backgroundColor: '#9966FF',
                  borderColor: '#fff',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Top Prestataires par Évaluation' },
              },
              scales: { y: { beginAtZero: true, max: 5 } },
            },
          }),
        );
      }
    }

    if (this.prestataires.length > 0) {
      const flaggedCount = this.prestataires.filter((p) => p.isFlagged).length;
      const nonFlaggedCount = this.prestataires.length - flaggedCount;
      this.charts.push(
        new Chart('flaggedPrestatairesChart', {
          type: 'pie',
          data: {
            labels: ['Prestataires Signalés', 'Prestataires Non Signalés'],
            datasets: [
              {
                data: [flaggedCount, nonFlaggedCount],
                backgroundColor: ['#FF6384', '#36A2EB'],
                borderColor: '#fff',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Prestataires Signalés vs Non Signalés' },
            },
          },
        }),
      );
    }
  }

  onFlagAccount(id: string): void {
    this.selectedPrestataireId = id;
    this.reason = '';
    this.isFlagging = true;
  }

  onConfirmFlag(): void {
    if (this.selectedPrestataireId && this.reason.trim()) {
      this.adminService.flagPrestataire(this.selectedPrestataireId, this.reason.trim()).subscribe({
        next: () => {
          const prestataire = this.prestataires.find((p) => p._id === this.selectedPrestataireId);
          if (prestataire) {
            prestataire.isFlagged = true;
            prestataire.flagReason = this.reason.trim();
            prestataire.flagCount = (prestataire.flagCount || 0) + 1;
            if (prestataire.flagCount === 5) {
              prestataire.status = 'désactivé';
              prestataire.deactivationUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
            } else if (prestataire.flagCount >= 10) {
              prestataire.status = 'supprimé';
              prestataire.deletedAt = new Date();
              prestataire.deletionReason = 'Compte supprimé automatiquement après 10 signalements';
              this.deletedPrestataires = [...this.deletedPrestataires, prestataire];
              this.prestataires = this.prestataires.filter((p) => p._id !== this.selectedPrestataireId);
            }
          }
          this.updateCharts();
          this.closeModal();
          alert('Prestataire signalé avec succès.');
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors du signalement du prestataire.';
          console.error('Flag Prestataire Error:', err);
        },
      });
    } else {
      alert('La raison du signalement ne peut pas être vide.');
    }
  }

  onDelete(id: string): void {
    this.selectedPrestataireId = id;
    this.reason = '';
    this.isDeleting = true;
  }

  onConfirmDelete(): void {
    if (this.selectedPrestataireId && this.reason.trim()) {
      this.adminService.deletePrestataire(this.selectedPrestataireId, this.reason.trim()).subscribe({
        next: () => {
          const deletedPrestataire = this.prestataires.find((p) => p._id === this.selectedPrestataireId);
          if (deletedPrestataire) {
            deletedPrestataire.status = 'supprimé';
            deletedPrestataire.deletionReason = this.reason.trim();
            deletedPrestataire.deletedAt = new Date();
            this.deletedPrestataires = [...this.deletedPrestataires, deletedPrestataire];
            this.prestataires = this.prestataires.filter((p) => p._id !== this.selectedPrestataireId);
          }
          this.updateCharts();
          this.closeModal();
          alert('Prestataire supprimé avec succès.');
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors de la suppression du prestataire.';
          console.error('Delete Prestataire Error:', err);
        },
      });
    } else {
      alert('La raison de la suppression ne peut pas être vide.');
    }
  }

  closeModal(): void {
    this.isFlagging = false;
    this.isDeleting = false;
    this.selectedPrestataireId = '';
    this.reason = '';
  }
}