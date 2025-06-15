// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   Chart,
//   LinearScale,
//   CategoryScale,
//   PieController,
//   ArcElement,
//   BarController,
//   BarElement,
//   Legend,
//   Title,
//   LineController,
//   PointElement,
//   LineElement
// } from 'chart.js';
// import { forkJoin } from 'rxjs';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { AdminService, Client, Prestataire, Reservation } from '../../services/AdminService.service';

// Chart.register(
//   LinearScale,
//   CategoryScale,
//   PieController,
//   ArcElement,
//   BarController,
//   BarElement,
//   Legend,
//   Title,
//   LineController,
//   PointElement,
//   LineElement
// );

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatCardModule,
//     MatButtonModule,
//     MatToolbarModule,
//     RouterLink,
//     RouterLinkActive
//   ],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.scss']
// })
// export class AdminDashboardComponent implements OnInit, OnDestroy {
//   stats: any = {};
//   clients: Client[] = [];
//   prestataires: Prestataire[] = [];
//   reservations: Reservation[] = [];
//   errorMessage: string = '';
//   private charts: Chart[] = [];
//   private dataLoaded: boolean = false;

//   hasReservationsWithDate: boolean = false;
//   hasPrestatairesWithRating: boolean = false;
//   hasReservationsWithClient: boolean = false;
//   hasCategoryData: boolean = false;

//   constructor(private adminService: AdminService) {}

//   ngOnInit(): void {
//     this.loadAllData();
//   }

//   ngOnDestroy(): void {
//     this.charts.forEach(chart => chart.destroy());
//   }

//   loadAllData(): void {
//     forkJoin({
//       stats: this.adminService.getDetailedStatistics(),
//       clients: this.adminService.getAllClients(),
//       prestataires: this.adminService.getAllPrestataires(),
//       reservations: this.adminService.getReservations()
//     }).subscribe({
//       next: ({ stats, clients, prestataires, reservations }) => {
//         console.log('Stats Response:', stats);
//         console.log('Clients loaded:', clients);
//         console.log('Prestataires loaded:', prestataires);
//         console.log('Reservations loaded:', reservations);

//         this.stats = stats.success ? stats.data : {};
//         this.clients = clients ?? [];
//         this.prestataires = prestataires.success && Array.isArray(prestataires.data) ? prestataires.data : [];
//         this.reservations = reservations.success && Array.isArray(reservations.data) ? reservations.data : [];

//         this.hasReservationsWithDate = this.reservations.some(r => r.date != null);
//         this.hasPrestatairesWithRating = this.prestataires.some(p => p.rating != null && !isNaN(p.rating) && p.rating > 0);
//         this.hasReservationsWithClient = this.reservations.some(r => r.id_client != null);
//         this.hasCategoryData = Array.isArray(this.stats.reservationsByCategory) && this.stats.reservationsByCategory.length > 0;

//         if (!this.hasCategoryData) {
//           console.warn('No reservationsByCategory data, using mock data');
//           this.stats.reservationsByCategory = [
//             { _id: 'Plumbing', count: 10 },
//             { _id: 'Cleaning', count: 5 }
//           ];
//           this.hasCategoryData = true;
//         }

//         this.errorMessage = '';
//         if (this.clients.length === 0) this.errorMessage += 'Aucun client trouvé. ';
//         if (this.prestataires.length === 0) this.errorMessage += 'Aucun prestataire trouvé. ';
//         if (this.reservations.length === 0) this.errorMessage += 'Aucune réservation trouvée. ';
//         if (!this.hasCategoryData) this.errorMessage += 'Aucune donnée de catégorie trouvée. ';

//         this.dataLoaded = true;
//         this.updateCharts();
//       },
//       error: (err: any) => {
//         this.errorMessage = 'Erreur lors du chargement des données: ' + (err.message || 'Erreur inconnue');
//         console.error('Data Load Error:', err);
//       }
//     });
//   }

//   updateCharts(): void {
//     if (!this.dataLoaded) {
//       console.warn('Data not loaded yet, skipping chart update');
//       return;
//     }

//     this.charts.forEach(chart => chart.destroy());
//     this.charts = [];

//     if (this.stats.totalClients != null || this.stats.totalPrestataires != null || this.stats.totalReservations != null) {
//       console.log('Rendering Totaux des Entités:', {
//         totalClients: this.stats.totalClients,
//         totalPrestataires: this.stats.totalPrestataires,
//         totalReservations: this.stats.totalReservations
//       });
//       this.charts.push(new Chart('totalsChart', {
//         type: 'bar',
//         data: {
//           labels: ['Clients', 'Prestataires', 'Réservations'],
//           datasets: [{
//             label: 'Totaux des Entités',
//             data: [this.stats.totalClients || 0, this.stats.totalPrestataires || 0, this.stats.totalReservations || 0],
//             backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
//             borderColor: '#fff',
//             borderWidth: 1
//           }]
//         },
//         options: {
//           responsive: true,
//           plugins: {
//             legend: { position: 'top' },
//             title: { display: true, text: 'Totaux des Entités' }
//           },
//           scales: { y: { beginAtZero: true } }
//         }
//       }));
//     }

//     if (this.clients.length > 0 || this.prestataires.length > 0) {
//       const flaggedClients = this.clients.filter(c => c.isFlagged).length;
//       const nonFlaggedClients = this.clients.length - flaggedClients;
//       const flaggedPrestataires = this.prestataires.filter(p => p.isFlagged).length;
//       const nonFlaggedPrestataires = this.prestataires.length - flaggedPrestataires;
//       console.log('Rendering Comptes Signalés:', { flaggedClients, nonFlaggedClients, flaggedPrestataires, nonFlaggedPrestataires });
//       this.charts.push(new Chart('flaggedChart', {
//         type: 'pie',
//         data: {
//           labels: ['Clients Signalés', 'Clients Non Signalés', 'Prestataires Signalés', 'Prestataires Non Signalés'],
//           datasets: [{
//             data: [flaggedClients, nonFlaggedClients, flaggedPrestataires, nonFlaggedPrestataires],
//             backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//             borderColor: '#fff',
//             borderWidth: 1
//           }]
//         },
//         options: {
//           responsive: true,
//           plugins: {
//             legend: { position: 'top' },
//             title: { display: true, text: 'Comptes Signalés vs Non Signalés' }
//           }
//         }
//       }));
//     }

//     if (this.hasReservationsWithDate) {
//       const reservationsByDate = this.reservations.reduce((acc: { [key: string]: number }, res) => {
//         if (res.date) {
//           const date = new Date(res.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' });
//           acc[date] = (acc[date] || 0) + 1;
//         }
//         return acc;
//       }, {});
//       const sortedDates = Object.keys(reservationsByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
//       console.log('Rendering Réservations par Date:', reservationsByDate);
//       if (sortedDates.length > 0) {
//         this.charts.push(new Chart('reservationsOverTimeChart', {
//           type: 'line',
//           data: {
//             labels: sortedDates,
//             datasets: [{
//               label: 'Réservations par Date',
//               data: sortedDates.map(date => reservationsByDate[date]),
//               borderColor: '#36A2EB',
//               backgroundColor: 'rgba(54, 162, 235, 0.2)',
//               fill: true,
//               tension: 0.4
//             }]
//           },
//           options: {
//             responsive: true,
//             plugins: {
//               legend: { position: 'top' },
//               title: { display: true, text: 'Réservations par Date' }
//             },
//             scales: { y: { beginAtZero: true } }
//           }
//         }));
//       }
//     }

//     if (this.hasPrestatairesWithRating) {
//       const ratingsDistribution = this.prestataires.reduce((acc: { [key: number]: number }, p) => {
//         const rating = p.rating != null && !isNaN(p.rating) && p.rating > 0 ? Math.round(p.rating) : 0;
//         acc[rating] = (acc[rating] || 0) + 1;
//         return acc;
//       }, {});
//       console.log('Rendering Distribution des Évaluations:', ratingsDistribution);
//       this.charts.push(new Chart('ratingsChart', {
//         type: 'bar',
//         data: {
//           labels: ['0', '1', '2', '3', '4', '5'],
//           datasets: [{
//             label: 'Évaluations',
//             data: [0, 1, 2, 3, 4, 5].map(i => ratingsDistribution[i] || 0),
//             backgroundColor: '#FFCE56',
//             borderColor: '#fff',
//             borderWidth: 1
//           }]
//         },
//         options: {
//           responsive: true,
//           plugins: {
//             legend: { position: 'top' },
//             title: { display: true, text: 'Distribution des Évaluations des Prestataires' }
//           },
//           scales: { y: { beginAtZero: true } }
//         }
//       }));
//     }

//     if (this.hasReservationsWithClient && this.clients.length > 0) {
//       const clientReservations = this.reservations.reduce((acc: { [key: string]: number }, res) => {
//         if (res.id_client) {
//           acc[res.id_client] = (acc[res.id_client] || 0) + 1;
//         }
//         return acc;
//       }, {});
//       const topClients = Object.entries(clientReservations)
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 5)
//         .map(([id, count]) => ({
//           name: this.clients.find(c => c._id === id)?.name || 'Inconnu',
//           count
//         }));
//       console.log('Rendering Activité des Clients:', topClients);
//       if (topClients.length > 0) {
//         this.charts.push(new Chart('clientActivityChart', {
//           type: 'bar',
//           data: {
//             labels: topClients.map(c => c.name),
//             datasets: [{
//               label: 'Réservations par Client',
//               data: topClients.map(c => c.count),
//               backgroundColor: '#4BC0C0',
//               borderColor: '#fff',
//               borderWidth: 1
//             }]
//           },
//           options: {
//             responsive: true,
//             plugins: {
//               legend: { position: 'top' },
//               title: { display: true, text: 'Activité des Clients (Réservations)' }
//             },
//             scales: { y: { beginAtZero: true } }
//           }
//         }));
//       }
//     }

//     if (this.hasCategoryData) {
//       console.log('Rendering Popularité des Catégories:', this.stats.reservationsByCategory);
//       this.charts.push(new Chart('categoryPopularityChart', {
//         type: 'pie',
//         data: {
//           labels: this.stats.reservationsByCategory.map((c: any) => c._id || 'Inconnu'),
//           datasets: [{
//             data: this.stats.reservationsByCategory.map((c: any) => c.count || 0),
//             backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
//             borderColor: '#fff',
//             borderWidth: 1
//           }]
//         },
//         options: {
//           responsive: true,
//           plugins: {
//             legend: { position: 'top' },
//             title: { display: true, text: 'Popularité des Catégories' }
//           }
//         }
//       }));
//     }

//     if (this.hasPrestatairesWithRating) {
//       const topPrestataires = this.prestataires
//         .filter(p => p.rating != null && !isNaN(p.rating) && p.rating > 0)
//         .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//         .slice(0, 5);
//       console.log('Rendering Top Prestataires:', topPrestataires);
//       if (topPrestataires.length > 0) {
//         this.charts.push(new Chart('topPrestatairesChart', {
//           type: 'bar',
//           data: {
//             labels: topPrestataires.map(p => p.name || 'Inconnu'),
//             datasets: [{
//               label: 'Évaluation Moyenne',
//               data: topPrestataires.map(p => p.rating || 0),
//               backgroundColor: '#9966FF',
//               borderColor: '#fff',
//               borderWidth: 1
//             }]
//           },
//           options: {
//             responsive: true,
//             plugins: {
//               legend: { position: 'top' },
//               title: { display: true, text: 'Top Prestataires par Évaluation' }
//             },
//             scales: { y: { beginAtZero: true, max: 5 } }
//           }
//         }));
//       }
//     }

//     // New chart: Reservation Status Distribution
//     if (this.reservations.length > 0) {
//       const statusDistribution = this.reservations.reduce((acc: { [key: string]: number }, res) => {
//         const status = res.status || 'Unknown';
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//       }, {});
//       const statuses = Object.keys(statusDistribution);
//       console.log('Rendering Distribution des Statuts des Réservations:', statusDistribution);
//       if (statuses.length > 0) {
//         this.charts.push(new Chart('reservationStatusChart', {
//           type: 'doughnut',
//           data: {
//             labels: statuses,
//             datasets: [{
//               label: 'Statuts des Réservations',
//               data: statuses.map(status => statusDistribution[status]),
//               backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
//               borderColor: '#fff',
//               borderWidth: 1
//             }]
//           },
//           options: {
//             responsive: true,
//             plugins: {
//               legend: { position: 'top' },
//               title: { display: true, text: 'Distribution des Statuts des Réservations' }
//             }
//           }
//         }));
//       }
//     }
//   }

  
// }






import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  LinearScale,
  CategoryScale,
  PieController,
  ArcElement,
  BarController,
  BarElement,
  Legend,
  Title,
  LineController,
  PointElement,
  LineElement
} from 'chart.js';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminService, Client, Prestataire, Reservation } from '../../services/AdminService.service';

Chart.register(
  LinearScale,
  CategoryScale,
  PieController,
  ArcElement,
  BarController,
  BarElement,
  Legend,
  Title,
  LineController,
  PointElement,
  LineElement
);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
stats: any = {};
  clients: Client[] = [];
  prestataires: Prestataire[] = [];
  reservations: Reservation[] = [];
  errorMessage: string = '';
  private charts: Chart[] = [];
  private dataLoaded: boolean = false;

  hasReservationsWithDate: boolean = false;
  hasPrestatairesWithRating: boolean = false;
  hasReservationsWithClient: boolean = false;
  hasCategoryData: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }
  // Logout method
logout(): void {
    try {
      // Clear the admin login flag from localStorage
      localStorage.removeItem('isAdminLoggedIn');
      console.log('Logout: isAdminLoggedIn flag removed from localStorage');

      // Redirect to the admin login page
      this.router.navigate(['/admin/login']).then(() => {
        console.log('Logout: Navigated to /admin/login');
      }).catch(err => {
        console.error('Logout: Navigation error:', err);
        this.errorMessage = 'Erreur lors de la redirection : ' + (err.message || 'Erreur inconnue');
      });
    } catch (err) {
      console.error('Logout error:', err);
      this.errorMessage = 'Erreur lors de la déconnexion : ' ;
    }
  }
  loadAllData(): void {
    forkJoin({
      stats: this.adminService.getDetailedStatistics(),
      clients: this.adminService.getAllClients(),
      prestataires: this.adminService.getAllPrestataires(),
      reservations: this.adminService.getReservations()
    }).subscribe({
      next: ({ stats, clients, prestataires, reservations }) => {
        console.log('Stats Response:', stats);
        console.log('Clients loaded:', clients);
        console.log('Prestataires loaded:', prestataires);
        console.log('Reservations loaded:', reservations);

        this.stats = stats.success ? stats.data : {};
        this.clients = clients ?? [];
        this.prestataires = prestataires.success && Array.isArray(prestataires.data) ? prestataires.data : [];
        this.reservations = reservations.success && Array.isArray(reservations.data) ? reservations.data : [];

        this.hasReservationsWithDate = this.reservations.some(r => r.date != null);
        this.hasPrestatairesWithRating = this.prestataires.some(p => p.rating != null && !isNaN(p.rating) && p.rating > 0);
        this.hasReservationsWithClient = this.reservations.some(r => r.id_client != null);
        this.hasCategoryData = Array.isArray(this.stats.reservationsByCategory) && this.stats.reservationsByCategory.length > 0;

        if (!this.hasCategoryData) {
          console.warn('No reservationsByCategory data, using mock data');
          this.stats.reservationsByCategory = [
            { _id: 'Plumbing', count: 10 },
            { _id: 'Cleaning', count: 5 }
          ];
          this.hasCategoryData = true;
        }

        this.errorMessage = '';
        if (this.clients.length === 0) this.errorMessage += 'Aucun client trouvé. ';
        if (this.prestataires.length === 0) this.errorMessage += 'Aucun prestataire trouvé. ';
        if (this.reservations.length === 0) this.errorMessage += 'Aucune réservation trouvée. ';
        if (!this.hasCategoryData) this.errorMessage += 'Aucune donnée de catégorie trouvée. ';

        this.dataLoaded = true;
        this.updateCharts();
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors du chargement des données: ' + (err.message || 'Erreur inconnue');
        console.error('Data Load Error:', err);
      }
    });
  }

  updateCharts(): void {
    if (!this.dataLoaded) {
      console.warn('Data not loaded yet, skipping chart update');
      return;
    }

    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    if (this.stats.totalClients != null || this.stats.totalPrestataires != null || this.stats.totalReservations != null) {
      console.log('Rendering Totaux des Entités:', {
        totalClients: this.stats.totalClients,
        totalPrestataires: this.stats.totalPrestataires,
        totalReservations: this.stats.totalReservations
      });
      this.charts.push(new Chart('totalsChart', {
        type: 'bar',
        data: {
          labels: ['Clients', 'Prestataires', 'Réservations'],
          datasets: [{
            label: 'Totaux des Entités',
            data: [this.stats.totalClients || 0, this.stats.totalPrestataires || 0, this.stats.totalReservations || 0],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderColor: '#fff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Totaux des Entités' }
          },
          scales: { y: { beginAtZero: true } }
        }
      }));
    }

    if (this.clients.length > 0 || this.prestataires.length > 0) {
      const flaggedClients = this.clients.filter(c => c.isFlagged).length;
      const nonFlaggedClients = this.clients.length - flaggedClients;
      const flaggedPrestataires = this.prestataires.filter(p => p.isFlagged).length;
      const nonFlaggedPrestataires = this.prestataires.length - flaggedPrestataires;
      console.log('Rendering Comptes Signalés:', { flaggedClients, nonFlaggedClients, flaggedPrestataires, nonFlaggedPrestataires });
      this.charts.push(new Chart('flaggedChart', {
        type: 'pie',
        data: {
          labels: ['Clients Signalés', 'Clients Non Signalés', 'Prestataires Signalés', 'Prestataires Non Signalés'],
          datasets: [{
            data: [flaggedClients, nonFlaggedClients, flaggedPrestataires, nonFlaggedPrestataires],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderColor: '#fff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Comptes Signalés vs Non Signalés' }
          }
        }
      }));
    }

    if (this.hasReservationsWithDate) {
      const reservationsByDate = this.reservations.reduce((acc: { [key: string]: number }, res) => {
        if (res.date) {
          const date = new Date(res.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' });
          acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
      }, {});
      const sortedDates = Object.keys(reservationsByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      console.log('Rendering Réservations par Date:', reservationsByDate);
      if (sortedDates.length > 0) {
        this.charts.push(new Chart('reservationsOverTimeChart', {
          type: 'line',
          data: {
            labels: sortedDates,
            datasets: [{
              label: 'Réservations par Date',
              data: sortedDates.map(date => reservationsByDate[date]),
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Réservations par Date' }
            },
            scales: { y: { beginAtZero: true } }
          }
        }));
      }
    }

    if (this.hasPrestatairesWithRating) {
      const ratingsDistribution = this.prestataires.reduce((acc: { [key: number]: number }, p) => {
        const rating = p.rating != null && !isNaN(p.rating) && p.rating > 0 ? Math.round(p.rating) : 0;
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});
      console.log('Rendering Distribution des Évaluations:', ratingsDistribution);
      this.charts.push(new Chart('ratingsChart', {
        type: 'bar',
        data: {
          labels: ['0', '1', '2', '3', '4', '5'],
          datasets: [{
            label: 'Évaluations',
            data: [0, 1, 2, 3, 4, 5].map(i => ratingsDistribution[i] || 0),
            backgroundColor: '#FFCE56',
            borderColor: '#fff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Distribution des Évaluations des Prestataires' }
          },
          scales: { y: { beginAtZero: true } }
        }
      }));
    }

    if (this.hasReservationsWithClient && this.clients.length > 0) {
      const clientReservations = this.reservations.reduce((acc: { [key: string]: number }, res) => {
        if (res.id_client) {
          acc[res.id_client] = (acc[res.id_client] || 0) + 1;
        }
        return acc;
      }, {});
      const topClients = Object.entries(clientReservations)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({
          name: this.clients.find(c => c._id === id)?.name || 'Inconnu',
          count
        }));
      console.log('Rendering Activité des Clients:', topClients);
      if (topClients.length > 0) {
        this.charts.push(new Chart('clientActivityChart', {
          type: 'bar',
          data: {
            labels: topClients.map(c => c.name),
            datasets: [{
              label: 'Réservations par Client',
              data: topClients.map(c => c.count),
              backgroundColor: '#4BC0C0',
              borderColor: '#fff',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Activité des Clients (Réservations)' }
            },
            scales: { y: { beginAtZero: true } }
          }
        }));
      }
    }

    if (this.hasCategoryData) {
      console.log('Rendering Popularité des Catégories:', this.stats.reservationsByCategory);
      this.charts.push(new Chart('categoryPopularityChart', {
        type: 'pie',
        data: {
          labels: this.stats.reservationsByCategory.map((c: any) => c._id || 'Inconnu'),
          datasets: [{
            data: this.stats.reservationsByCategory.map((c: any) => c.count || 0),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderColor: '#fff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Popularité des Catégories' }
          }
        }
      }));
    }

    if (this.hasPrestatairesWithRating) {
      const topPrestataires = this.prestataires
        .filter(p => p.rating != null && !isNaN(p.rating) && p.rating > 0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5);
      console.log('Rendering Top Prestataires:', topPrestataires);
      if (topPrestataires.length > 0) {
        this.charts.push(new Chart('topPrestatairesChart', {
          type: 'bar',
          data: {
            labels: topPrestataires.map(p => p.name || 'Inconnu'),
            datasets: [{
              label: 'Évaluation Moyenne',
              data: topPrestataires.map(p => p.rating || 0),
              backgroundColor: '#9966FF',
              borderColor: '#fff',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Top Prestataires par Évaluation' }
            },
            scales: { y: { beginAtZero: true, max: 5 } }
          }
        }));
      }
    }

    // New chart: Reservation Status Distribution
    if (this.reservations.length > 0) {
      const statusDistribution = this.reservations.reduce((acc: { [key: string]: number }, res) => {
        const status = res.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      const statuses = Object.keys(statusDistribution);
      console.log('Rendering Distribution des Statuts des Réservations:', statusDistribution);
      if (statuses.length > 0) {
        this.charts.push(new Chart('reservationStatusChart', {
          type: 'doughnut',
          data: {
            labels: statuses,
            datasets: [{
              label: 'Statuts des Réservations',
              data: statuses.map(status => statusDistribution[status]),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
              borderColor: '#fff',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Distribution des Statuts des Réservations' }
            }
          }
        }));
      }
    }
  }

  
}