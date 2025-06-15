import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FactureService } from '../../services/facture.service';
import { Facture } from '../../classes/facture.model';
import { Reservation } from '../../classes/reservation.model';
import { Prestataire } from '../../classes/prestataire.model';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Component({
  selector: 'app-facture-details',
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
  templateUrl: './facture-details.component.html',
  styleUrls: ['./facture-details.component.css'],
})
export class FactureDetailsComponent implements OnInit {
  facture: Facture | null = null;
  reservation: Reservation | null = null;
  prestataire: Prestataire | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  isGeneratingPdf = false;
  prestataireId: string | null = null;
  today: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService,
    private snackBar: MatSnackBar
  ) {
    pdfMake.vfs = pdfFonts.vfs;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.prestataireId = params.get('prestataireId');
      const factureId = params.get('factureId');
      if (!this.prestataireId) {
        this.errorMessage = 'Prestataire ID manquant dans l\'URL';
        this.isLoading = false;
        this.router.navigate(['/login']);
        return;
      }
      if (!factureId) {
        this.errorMessage = 'ID de facture invalide';
        this.isLoading = false;
        this.router.navigate([`/factures/${this.prestataireId}`]);
        return;
      }
      this.loadData(factureId);
    });
  }

  loadData(factureId: string): void {
    if (!this.prestataireId) {
      this.errorMessage = 'Prestataire ID non défini';
      this.isLoading = false;
      return;
    }
    console.log(`[DEBUG] Loading facture: ${factureId} for prestataire: ${this.prestataireId}`);
    this.factureService.getFacturesByPrestataire(this.prestataireId).subscribe({
      next: (factures) => {
        this.facture = factures.find((f) => f.id === factureId) || null;
        if (!this.facture) {
          this.errorMessage = 'Facture non trouvée';
          this.isLoading = false;
          this.router.navigate([`/factures/${this.prestataireId}`]);
          return;
        }
        if (!this.facture.prestataireId) {
          this.errorMessage = 'ID du prestataire non disponible';
          this.isLoading = false;
          this.router.navigate([`/factures/${this.prestataireId}`]);
          return;
        }
        if (!this.facture.reservationId) {
          this.errorMessage = 'ID de réservation non disponible pour cette facture';
          this.isLoading = false;
          this.router.navigate([`/factures/${this.prestataireId}`]);
          return;
        }
        this.factureService.getReservation(this.facture.reservationId).subscribe({
          next: (reservation) => {
            this.reservation = reservation;
            this.factureService.getPrestataire(this.facture!.prestataireId).subscribe({
              next: (prestataire) => {
                this.prestataire = prestataire;
                this.isLoading = false;
                this.errorMessage = !reservation || !prestataire ? 'Données incomplètes' : null;
              },
              error: (error) => {
                this.handleError(error, 'fetch prestataire');
              },
            });
          },
          error: (error) => {
            this.handleError(error, 'fetch reservation');
          },
        });
      },
      error: (error) => {
        this.handleError(error, 'fetch facture');
      },
    });
  }

  generateAndDownloadPdf(): void {
    if (this.isGeneratingPdf || !this.facture || !this.reservation || !this.prestataire) {
      this.snackBar.open('Données manquantes pour générer la facture', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    if (!this.prestataire.id) {
      this.snackBar.open('ID du prestataire manquant', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      this.isGeneratingPdf = false;
      return;
    }

    this.isGeneratingPdf = true;

    this.factureService.getFacturesByPrestataire(this.prestataire.id).subscribe({
      next: (factures) => {
        let existingFacture = factures.find((f) => f.reservationId === this.reservation!.id);
        if (!existingFacture) {
          existingFacture = new Facture(
            'null',
            this.reservation!.id,
            this.prestataire!.id,
            this.reservation!.client.id,
            this.facture!.service,
            this.facture!.date,
            this.reservation!.location,
            this.facture!.price,
            this.reservation!.discountApplied,
            this.reservation!.request ?? undefined,
            'null',
            this.facture!.discountAmount
          );
        }

        // Calculate financial details
        const originalPrice = (this.facture!.price || 0) + (this.facture!.discountAmount || 0);
        const discountAmount = this.facture!.discountAmount || 0;
        const finalPrice = this.facture!.price || 0;

        const docDefinition: TDocumentDefinitions = {
          pageSize: 'A4',
          content: [
            // Header Section
            {
              stack: [
                { text: 'Facture de Réservation', style: 'header' },
                { text: `ID Réservation: ${this.reservation!.id}`, style: 'subheader' },
                { text: `Service: ${this.facture!.service || 'Non spécifié'}`, style: 'subheader' },
                {
                  text: `Date: ${this.facture!.date instanceof Date ? this.facture!.date.toLocaleString().split('.')[0] : this.facture!.date}`,
                  style: 'subheader',
                },
                { text: `Lieu: ${this.reservation!.location || 'Non spécifié'}`, style: 'subheader' },
              ],
              fillColor: '#FFB300', // amberMedium
              padding: [12, 12, 12, 12],
              margin: [0, 0, 0, 16],
              border: [true, true, true, true],
              borderRadius: 8,
            },
            // Client Section
            this.buildTable('Client', [
              ['Nom', this.reservation!.client.name || 'Non spécifié'],
              ['Téléphone', this.reservation!.client.phoneNumber || 'Non spécifié'],
              ['Email', this.reservation!.client.email || 'Non spécifié'],
              ['Adresse', this.reservation!.client.homeAddress || 'Non spécifié'],
            ]),
            // Prestataire Section
            this.buildTable('Prestataire', [
              ['Nom', this.prestataire!.name || 'Non spécifié'],
              ['Métier', this.prestataire!.job || 'Non spécifié'],
              ['Téléphone', this.prestataire!.phoneNumber || 'Non spécifié'],
              ['Email', this.prestataire!.email || 'Non spécifié'],
              ['Adresse', this.prestataire!.businessAddress || 'Non spécifié'],
              ['Note', this.prestataire!.rating?.toString() || 'Non spécifié'],
            ]),
            // Payment Details Section
            { text: 'Détails de Paiement', style: 'sectionTitle', margin: [0, 16, 0, 8] },
            {
              table: {
                widths: ['*', 'auto'],
                body: [
                  [
                    { text: 'Description', style: 'tableHeader' },
                    { text: 'Montant', style: 'tableHeader' },
                  ],
                  [
                    { text: 'Prix Original', style: 'tableCell' },
                    { text: `${originalPrice.toFixed(0)} DT`, style: 'tableCell', alignment: '#212121' },
                  ],
                  ...(this.facture!.discountApplied
                    ? [
                        [
                        { text: 'Remise', style: 'tableCell', color: '#D32F2F' },
                        { text: `-${discountAmount.toFixed(0)} DT`, style: 'tableCell', color: '#D32F2F', alignment: 'right'},
                      ],
                    ]
                    : []),
                  [
                    { text: 'Montant Total', style: 'tableCell', bold: true },
                    { text: `${finalPrice.toFixed(0)} DT`, style: 'tableCell', bold: true, alignment: 'right' },
                ],
              ]
              },
                layout: {
                  hLineWidth: () => 1,
                  vLineWidth: () => 1,
                  hLineColor: () => '#FFB300', // amberMedium
                  vLineColor: () => '#FFB300', // amberMedium
                  paddingLeft: () => 12,
                  paddingRight: () => 12,
                  paddingTop: () => 8,
                  paddingBottom: () => 8,
                },
                margin: [0, 0, 0, 12],
              },
              // Special Request
              {
                text: `Demande spéciale: ${this.reservation!.request || 'Aucune'}`,
                style: 'subheader',
                color: '#616161', // darkGrey
                margin: [0, 12, 0, 20],
              },
              // Divider
              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, color: '#FFB300' }, // amberMedium
                ],
                margin: [0, 0, 0, 8],
              },
              // Footer
              {
                text: 'Merci pour votre confiance !',
                style: 'footer',
                alignment: 'center',
                margin: [0, 8, 0, 0],
              },
              {
                text: `Facture générée le: ${this.today.toLocaleString().split('.')[0]}`,
                style: 'footerSmall',
                alignment: 'center',
                margin: [0, 8, 0, 0],
              },
            ],
            styles: {
              header: { fontSize: 20, bold: true, color: '#212121' }, // darkTextPrimary
              subheader: { fontSize: 12, color: '#212121', margin: [0, 8, 0, 0] }, // darkTextPrimary
              sectionTitle: { fontSize: 16, bold: true, color: '#FFB300' }, // amberMedium
              tableHeader: { fontSize: 12, bold: true, fillColor: '#EEEEEE', color: '#424242' }, // cardBackground, textPrimary
              tableCell: { fontSize: 12, color: '#424242' }, // textPrimary
              footer: { fontSize: 14, italics: true, color: '#616161' }, // darkGrey
              footerSmall: { fontSize: 10, color: '#9E9E9E' }, // textGrey
            },
          };

          pdfMake.createPdf(docDefinition).getBuffer((buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `facture_${this.facture!.id}.pdf`;
            link.click();
            URL.revokeObjectURL(url);

            if (existingFacture!.id === 'null') {
              const factureData = existingFacture!.toJson();
              this.factureService.createFacture(factureData, buffer).subscribe({
                next: () => {
                  this.snackBar.open('Facture enregistrée et téléchargée', 'Fermer', {
                    duration: 5000,
                    panelClass: ['success-snackbar'],
                  });
                },
                error: (error) => {
                  this.handleError(error, 'save facture');
                },
              });
            } else if (!existingFacture!.pdfPath) {
              this.factureService.uploadFacturePdf(existingFacture!.id, buffer).subscribe({
                next: () => {
                  this.snackBar.open('PDF de la facture mis à jour', 'Fermer', {
                    duration: 5000,
                    panelClass: ['success-snackbar'],
                  });
                },
                error: (error) => {
                  this.handleError(error, 'upload facture PDF');
                },
              });
            }
            this.isGeneratingPdf = false;
          });
        },
        error: (error) => {
          this.handleError(error, 'check existing facture');
          this.isGeneratingPdf = false;
        },
      });
    }

    buildTable(title: string, rows: string[][]): any {
      return {
        stack: [
          { text: title, style: 'sectionTitle', margin: [0, 16, 0, 8] },
          {
            table: {
              widths: [80, '*'],
              body: rows.map((row) => [
                { text: row[0], bold: true, fontSize: 12 },
                { text: row[1], fontSize: 12 },
              ]),
            },
            layout: {
              hLineWidth: () => 1,
              vLineWidth: () => 1,
              hLineColor: () => '#FFB300', // amberMedium
              vLineColor: () => '#FFB300', // amberMedium
              paddingLeft: () => 10,
              paddingRight: () => 10,
              paddingTop: () => 6,
              paddingBottom: () => 6,
            },
            margin: [0, 0, 0, 16],
          },
        ],
        color: '#424242', // textPrimary
      };
    }

    handleError(error: any, context: string): void {
      console.error(`[DEBUG] ${context}:`, error);
      this.isLoading = false;
      this.isGeneratingPdf = false;
      this.errorMessage = `Erreur lors du ${context}`;
      this.snackBar.open(this.errorMessage, 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    }

    goBack(): void {
      if (this.prestataireId) {
        this.router.navigate([`/factures/${this.prestataireId}`]);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }