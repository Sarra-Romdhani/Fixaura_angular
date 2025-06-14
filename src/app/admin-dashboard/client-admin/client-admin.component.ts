

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
import { AdminService, Client, Reservation } from '../../services/AdminService.service';

Chart.register(PieController, ArcElement, BarController, BarElement, Legend, Title, CategoryScale, LinearScale);

@Component({
  selector: 'app-client-admin',
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
  templateUrl: './client-admin.component.html',
  styleUrls: ['./client-admin.component.scss'],
})
export class ClientAdminComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  deletedClients: Client[] = [];
  reservations: Reservation[] = [];
  errorMessage: string = '';
  selectedAccountId: string = '';
  reason: string = '';
  isFlagging: boolean = false;
  isDeleting: boolean = false;
  private charts: Chart[] = [];
  displayedColumns: string[] = ['name', 'email', 'status', 'isFlagged', 'flagCount', 'flagReason', 'deactivationUntil', 'actions'];
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
      clients: this.adminService.getAllClients(),
      deletedClients: this.adminService.getDeletedClients(),
      reservations: this.adminService.getReservations(),
    }).subscribe({
      next: ({ clients, deletedClients, reservations }) => {
        this.clients = clients.filter((c) => c.status !== 'supprimé') ?? [];
        this.deletedClients = deletedClients ?? [];
        this.reservations = reservations.success && Array.isArray(reservations.data) ? reservations.data : [];
        this.errorMessage = this.clients.length === 0 ? 'Aucun client non supprimé trouvé.' : '';
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

    if (this.clients.length > 0) {
      const flaggedClients = this.clients.filter((c) => c.isFlagged).length;
      const nonFlaggedClients = this.clients.length - flaggedClients;
      this.charts.push(
        new Chart('flaggedClientsChart', {
          type: 'pie',
          data: {
            labels: ['Clients Signalés', 'Clients Non Signalés'],
            datasets: [
              {
                data: [flaggedClients, nonFlaggedClients],
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
              title: { display: true, text: 'Clients Signalés vs Non Signalés' },
            },
          },
        }),
      );
    }

    if (this.reservations.length > 0 && this.clients.length > 0) {
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
          name: this.clients.find((c) => c._id === id)?.name || 'Inconnu',
          count,
        }));
      if (topClients.length > 0) {
        this.charts.push(
          new Chart('topClientsChart', {
            type: 'bar',
            data: {
              labels: topClients.map((c) => c.name),
              datasets: [
                {
                  label: 'Réservations par Client',
                  data: topClients.map((c) => c.count),
                  backgroundColor: '#4BC0C0',
                  borderColor: '#fff',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Clients les Plus Actifs' },
              },
              scales: { y: { beginAtZero: true } },
            },
          }),
        );
      }
    }
  }

  onDelete(id: string): void {
    this.selectedAccountId = id;
    this.isDeleting = true;
  }

  onConfirmDelete(): void {
    if (this.selectedAccountId && this.reason) {
      this.adminService.deleteClient(this.selectedAccountId, this.reason).subscribe({
        next: () => {
          const deletedClient = this.clients.find((c) => c._id === this.selectedAccountId);
          if (deletedClient) {
            deletedClient.status = 'supprimé';
            deletedClient.deletionReason = this.reason;
            deletedClient.deletedAt = new Date();
            this.deletedClients = [...this.deletedClients, deletedClient];
            this.clients = this.clients.filter((c) => c._id !== this.selectedAccountId);
          }
          this.updateCharts();
          this.closeModal();
          alert('Client supprimé avec succès.');
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors de la suppression du client.';
          console.error('Delete Client Error:', err);
        },
      });
    } else {
      alert('La raison de la suppression ne peut pas être vide.');
    }
  }

  onFlagAccount(id: string): void {
    this.selectedAccountId = id;
    this.isFlagging = true;
  }

  onConfirmFlag(): void {
    if (this.selectedAccountId && this.reason) {
      this.adminService.flagClient(this.selectedAccountId, this.reason).subscribe({
        next: (response: any) => {
          const client = this.clients.find((c) => c._id === this.selectedAccountId);
          if (client) {
            client.isFlagged = true;
            client.flagReason = this.reason;
            client.flagCount = (client.flagCount || 0) + 1;
            if (client.flagCount === 5) {
              client.status = 'désactivé';
              client.deactivationUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
            } else if (client.flagCount >= 10) {
              client.status = 'supprimé';
              client.deletedAt = new Date();
              client.deletionReason = 'Compte supprimé automatiquement après 10 signalements';
              this.deletedClients = [...this.deletedClients, client];
              this.clients = this.clients.filter((c) => c._id !== this.selectedAccountId);
            }
          }
          this.updateCharts();
          this.closeModal();
          alert('Client signalé avec succès.');
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors du signalement du client.';
          console.error('Flag Client Error:', err);
        },
      });
    } else {
      alert('La raison du signalement ne peut pas être vide.');
    }
  }

  closeModal(): void {
    this.isFlagging = false;
    this.isDeleting = false;
    this.selectedAccountId = '';
    this.reason = '';
  }
}