


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Facture } from '../classes/facture.model';
import { Reservation } from '../classes/reservation.model';
import { Prestataire } from '../classes/prestataire.model';
import { ReservationService } from './reservation.service';
import { environment } from '../../environments/environment';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private readonly baseUrl = environment.baseUrl;
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private reservationService: ReservationService
  ) {}

  // async generateFacturePdf(facture: Facture, reservation: Reservation, prestataire: Prestataire): Promise<ArrayBuffer> {
  //   const pdfDoc = await PDFDocument.create();
  //   const page = pdfDoc.addPage([595, 842]);
  //   const { width, height } = page.getSize();
  //   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  //   const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  //   const fontSize = 12;
  //   let yPosition = height - 50;

  //   page.drawRectangle({
  //     x: 50,
  //     y: yPosition - 80,
  //     width: width - 100,
  //     height: 80,
  //     color: rgb(0.129, 0.227, 0.541),
  //   });
  //   page.drawText('Facture de Réservation', {
  //     x: 62,
  //     y: yPosition - 30,
  //     size: 22,
  //     font: boldFont,
  //     color: rgb(1, 1, 1),
  //   });
  //   page.drawText(`ID Réservation: ${reservation.id}`, {
  //     x: 62,
  //     y: yPosition - 50,
  //     size: fontSize,
  //     font,
  //     color: rgb(1, 1, 1),
  //   });
  //   page.drawText(`Service: ${reservation.service}`, {
  //     x: 62,
  //     y: yPosition - 65,
  //     size: fontSize,
  //     font,
  //     color: rgb(1, 1, 1),
  //   });
  //   page.drawText(`Date: ${facture.date.toLocaleString().split('.')[0]}`, {
  //     x: 62,
  //     y: yPosition - 80,
  //     size: fontSize,
  //     font,
  //     color: rgb(1, 1, 1),
  //   });
  //   page.drawText(`Lieu: ${reservation.location}`, {
  //     x: 62,
  //     y: yPosition - 95,
  //     size: fontSize,
  //     font,
  //     color: rgb(1, 1, 1),
  //   });
  //   yPosition -= 110;

  //   yPosition = this.drawSection(page, 'Client', [
  //     ['Nom', reservation.client.name || 'Non spécifié'],
  //     ['Téléphone', reservation.client.phoneNumber || 'Non spécifié'],
  //     ['Email', reservation.client.email || 'Non spécifié'],
  //     ['Adresse', reservation.client.homeAddress || 'Non spécifié'],
  //   ],  50,  yPosition, width - width - 100, font, boldFont, fontSize);
  //   yPosition -= 20;

  //   yPosition = this.drawSection(page, 'Prestataire', [
  //     ['Nom', prestataire.name || 'Non spécifié'],
  //     ['Métier', prestataire.job || 'Non spécifié'],
  //     ['Téléphone', prestataire.phoneNumber || 'Non spécifié'],
  //     ['Email', prestataire.email || 'Non spécifié'],
  //     ['Adresse', prestataire.businessAddress || 'Non spécifié'],
  //     ['Note', prestataire.rating?.toString() || 'Non spécifié'],
  //   ],  50,  yPosition,  width - 100, font, boldFont, fontSize);
  //   yPosition -= 20;

  //   page.drawText('Détails de Paiement', {
  //     x: 50,
  //     y: yPosition,
  //     size: 16,
  //     font: boldFont,
  //     color: rgb(0.129, 0.227, 0.541),
  //   });
  //   yPosition -= 20;
  //   page.drawRectangle({
  //     x: 50,
  //     y: yPosition - 60,
  //     width: width - 100,
  //     height: 60,
  //     borderWidth: 1,
  //     borderColor: rgb(0.612, 0.639, 0.686),
  //   });
  //   page.drawRectangle({
  //     x: 50,
  //     y: yPosition - 30,
  //     width: width - 100,
  //     height: 30,
  //     color: rgb(0.898, 0.906, 0.922),
  //   });
  //   page.drawText('Description', {
  //     x: 58,
  //     y: yPosition - 20,
  //     size: fontSize,
  //     font: boldFont,
  //     color: rgb(0, 0, 0),
  //   });
  //   page.drawText('Montant', {
  //     x: width - 150,
  //     y: yPosition - 20,
  //     size: fontSize,
  //     font: boldFont,
  //     color: rgb(0, 0, 0),
  //   });
  //   page.drawText(reservation.service, {
  //     x: 58,
  //     y: yPosition - 50,
  //     size: fontSize,
  //     font,
  //     color: rgb(0, 0, 0),
  //   });
  //   page.drawText(reservation.price ? `${reservation.price} DT` : 'Non spécifié', {
  //     x: width - 150,
  //     y: yPosition - 50,
  //     size: fontSize,
  //     font,
  //     color: rgb(0, 0, 0),
  //   });
  //   yPosition -= 70;

  //   page.drawText(`Demande spéciale: ${reservation.request || 'Aucune'}`, {
  //     x: 50,
  //     y: yPosition,
  //     size: fontSize,
  //     font,
  //     color: rgb(0.502, 0.502, 0.502),
  //   });
  //   yPosition -= 15;
  //   if (reservation.discountApplied) {
  //     page.drawText('Remise appliquée: Oui', {
  //       x: 50,
  //       y: yPosition,
  //       size: fontSize,
  //       font,
  //       color: rgb(0.502, 0.502, 0.502),
  //     });
  //     yPosition -= 15;
  //   }

  //   yPosition -= 30;
  //   page.drawLine({
  //     start: { x: 50, y: yPosition },
  //     end: { x: width - 50, y: yPosition },
  //     thickness: 1,
  //     color: rgb(0.612, 0.639, 0.686),
  //   });
  //   yPosition -= 20;
  //   page.drawText('Merci pour votre confiance !', {
  //     x: 50,
  //     y: yPosition,
  //     size: 14,
  //     font,
  //     color: rgb(0.502, 0.502, 0.502),
  //   });
  //   yPosition -= 20;
  //   page.drawText(`Facture générée le: ${new Date().toLocaleString().split('.')[0]}`, {
  //     x: 50,
  //     y: yPosition,
  //     size: 10,
  //     font,
  //     color: rgb(0.4, 0.4, 0.4),
  //   });

  //   return await pdfDoc.save();
  // }

  // private drawSection(
  //   page: any,
  //   title: string,
  //   rows: string[][],
  //   x: number,
  //   y: number,
  //   width: number,
  //   font: any,
  //   boldFont: any,
  //   fontSize: number
  // ): number {
  //   page.drawRectangle({
  //     x,
  //     y: y - (rows.length * 15 + 40),
  //     width,
  //     height: rows.length * 15 + 40,
  //     borderWidth: 1,
  //     borderColor: rgb(0.612, 0.639, 0.686),
  //     borderRadius: 4,
  //   });
  //   page.drawText(title, {
  //     x: x + 10,
  //     y: y - 20,
  //     size: 14,
  //     font: boldFont,
  //     color: rgb(0.129, 0.227, 0.541),
  //   });
  //   let currentY = y - 40;
  //   for (const [label, value] of rows) {
  //     page.drawText(label, {
  //       x: x + 10,
  //       y: currentY,
  //       size: fontSize,
  //       font: boldFont,
  //       color: rgb(0, 0, 0),
  //     });
  //     page.drawText(value, {
  //       x: x + 90,
  //       y: currentY,
  //       size: fontSize,
  //       font,
  //       color: rgb(0, 0, 0),
  //     });
  //     currentY -= 15;
  //   }
  //   return currentY - 10;
  // }
async generateFacturePdf(reservation: any, prestataire: any, facture: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const amberMedium = rgb(1, 0.7, 0);
  const darkTextPrimary = rgb(0.13, 0.13, 0.13);
  const textPrimary = rgb(0.26, 0.26, 0.26);
  const cardBackground = rgb(0.93, 0.93, 0.93);
  const redMedium = rgb(1, 0, 0);

  let yPosition = height - 40;

  // Header section
  page.drawRectangle({
    x: 40,
    y: yPosition - 100,
    width: width - 80,
    height: 100,
    color: amberMedium,
  });

  page.drawText('Facture de Réservation', {
    x: 52,
    y: yPosition - 30,
    size: 20,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Service: ${facture.service || '-'}`, {
    x: 52,
    y: yPosition - 55,
    size: 12,
    font,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Date: ${facture.date instanceof Date ? facture.date.toISOString().split('T')[0] : facture.date}`, {
    x: 52,
    y: yPosition - 70,
    size: 12,
    font,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Lieu: ${reservation.location || '-'}`, {
    x: 52,
    y: yPosition - 85,
    size: 12,
    font,
    color: rgb(1, 1, 1),
  });

  yPosition -= 120;

  // Client and Prestataire boxes side by side
  const boxWidth = (width - 100) / 2;

  this.drawSection(
    page,
    '',
    [
      ['Nom', reservation.client.name || 'Non spécifié'],
      ['Téléphone', reservation.client.phoneNumber || 'Non spécifié'],
      ['Email', reservation.client.email || 'Non spécifié'],
      ['Adresse', reservation.client.homeAddress || 'Non spécifié'],
    ],
    40,
    yPosition,
    boxWidth,
    font,
    boldFont,
    12,
    amberMedium,
    cardBackground,
    darkTextPrimary,
    textPrimary
  );

  this.drawSection(
    page,
    '',
    [
      ['Nom', prestataire.name || 'Non spécifié'],
      ['Métier', prestataire.job || 'Non spécifié'],
      ['Téléphone', prestataire.phoneNumber || 'Non spécifié'],
      ['Email', prestataire.email || 'Non spécifié'],
      ['Adresse', prestataire.businessAddress || 'Non spécifié'],
      ['Note', prestataire.rating?.toString() || 'Non spécifié'],
    ],
    60 + boxWidth,
    yPosition,
    boxWidth,
    font,
    boldFont,
    12,
    amberMedium,
    cardBackground,
    darkTextPrimary,
    textPrimary
  );

  yPosition -= 130;

  // Paiement details
  page.drawText('Détails de Paiement', {
    x: 40,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: amberMedium,
  });

  yPosition -= 24;

  const paymentRows = [
    ['sarar', `${((facture.price || 0) + (facture.discountAmount || 0)).toFixed(2)} DT`],
    ...(facture.discountApplied ? [['Remise', `-${(facture.discountAmount || 0).toFixed(2)} DT`]] : []),
    ['Montant Final', `${(facture.price || 0).toFixed(2)} DT`],
  ];

  const rowHeight = 24;
  const tableHeight = (paymentRows.length + 1) * rowHeight;

  page.drawRectangle({
    x: 40,
    y: yPosition - tableHeight,
    width: width - 80,
    height: tableHeight,
    borderWidth: 1,
    borderColor: amberMedium,
  });

  // Header
  page.drawRectangle({
    x: 40,
    y: yPosition - rowHeight,
    width: width - 80,
    height: rowHeight,
    color: cardBackground,
  });

  page.drawText('Description', {
    x: 52,
    y: yPosition - 18,
    size: 12,
    font: boldFont,
    color: textPrimary,
  });

  page.drawText('Montant', {
    x: width - 120,
    y: yPosition - 18,
    size: 12,
    font: boldFont,
    color: textPrimary,
  });

  yPosition -= rowHeight;

  paymentRows.forEach(([desc, amount]) => {
    page.drawText(desc, {
      x: 52,
      y: yPosition - 18,
      size: 12,
      font: desc === 'Montant Final' ? boldFont : font,
      color: desc === 'Remise' ? redMedium : textPrimary,
    });

    page.drawText(amount, {
      x: width - 120,
      y: yPosition - 18,
      size: 12,
      font: desc === 'Montant Final' ? boldFont : font,
      color: desc === 'Remise' ? redMedium : textPrimary,
    });

    yPosition -= rowHeight;
  });

  // Special Request
  yPosition -= 30;

  page.drawText('Demande Spéciale :', {
    x: 40,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: amberMedium,
  });

  yPosition -= 20;

  page.drawText(facture.specialRequest || 'Aucune demande spéciale', {
    x: 40,
    y: yPosition,
    size: 12,
    font,
    color: textPrimary,
  });

  yPosition -= 40;

  page.drawText(`Facture générée le : ${new Date().toLocaleDateString()}`, {
    x: 40,
    y: yPosition,
    size: 12,
    font,
    color: textPrimary,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'facture_reservation.pdf');
}

drawSection(
  page: any,
  title: string,
  fields: [string, string][],
  x: number,
  y: number,
  width: number,
  font: any,
  boldFont: any,
  fontSize: number,
  titleColor: any,
  backgroundColor: any,
  labelColor: any,
  valueColor: any
) {
  const height = fields.length * 15 + 20;
  page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    color: backgroundColor,
    borderColor: titleColor,
    borderWidth: 1,
  });

  let currentY = y - 10;
  fields.forEach(([label, value]) => {
    page.drawText(`${label}:`, {
      x: x + 10,
      y: currentY - 12,
      size: fontSize,
      font: boldFont,
      color: labelColor,
    });

    page.drawText(value, {
      x: x + 80,
      y: currentY - 12,
      size: fontSize,
      font,
      color: valueColor,
    });

    currentY -= 15;
  });
}
  getFacturesByPrestataire(prestataireId: string): Observable<Facture[]> {
    const url = `${this.baseUrl}/factures/prestataire/${prestataireId}`;
    console.log(`[DEBUG] Fetching factures from: ${url}`);
    return this.http.get<{ success?: boolean; data?: any[]; message?: string } | any[]>(url, { headers: this.headers }).pipe(
      map(response => {
        console.log('[DEBUG] Factures response:', response);
        let data: any[];
        if (Array.isArray(response)) {
          data = response;
        } else if (response.success?.toString() === 'true') {
          data = response.data || [];
        } else {
          throw new Error(response.message || 'Failed to load factures');
        }
        return data.map(json => {
          if (!json || typeof json !== 'object') {
            throw new Error(`Invalid facture JSON: ${JSON.stringify(json)}`);
          }
          return Facture.fromJson(json);
        });
      }),
      catchError(error => this.handleError(error, 'fetch factures'))
    );
  }

  createFacture(factureData: any, pdfBytes: ArrayBuffer): Observable<string> {
    const url = `${this.baseUrl}/factures`;
    console.log(`[DEBUG] Creating facture: ${JSON.stringify(factureData)}`);
    return this.http.post<{ _id?: string; id?: string }>(url, factureData, { headers: this.headers }).pipe(
      switchMap(response => {
        console.log('[DEBUG] Create facture response:', response);
        const factureId = response._id || response.id;
        if (!factureId) {
          throw new Error('Invalid facture response: Missing ID');
        }
        return this.uploadFacturePdf(factureId, pdfBytes).pipe(
          map(() => factureId)
        );
      }),
      catchError(error => this.handleError(error, 'create facture'))
    );
  }

  uploadFacturePdf(factureId: string, pdfBytes: ArrayBuffer): Observable<void> {
    const url = `${this.baseUrl}/factures/${factureId}/upload`;
    console.log(`[DEBUG] Uploading facture PDF: ${url}`);
    const formData = new FormData();
    formData.append('pdf', new Blob([pdfBytes], { type: 'application/pdf' }), `facture_${factureId}.pdf`);

    return this.http.post<void>(url, formData).pipe(
      catchError(error => {
        console.error('[DEBUG] Error uploading facture PDF:', error);
        return of(void 0); // Ignore errors as in Flutter
      })
    );
  }

  downloadFacture(factureId: string): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/factures/${factureId}/pdf`;
    console.log(`[DEBUG] Downloading facture: ${url}`);
    return this.http.get(url, { headers: this.headers, responseType: 'arraybuffer' }).pipe(
      catchError(error => this.handleError(error, 'download facture'))
    );
  }

  getReservation(reservationId: string): Observable<Reservation> {
    console.log(`[DEBUG] Fetching reservation: ${reservationId}`);
    return this.reservationService.getReservationById(reservationId).pipe(
      map(data => {
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid reservation data');
        }
        return Reservation.fromJson(data);
      }),
      catchError(error => this.handleError(error, 'fetch reservation'))
    );
  }

  getPrestataire(prestataireId: string): Observable<Prestataire | null> {
    if (!prestataireId || prestataireId === 'unknown') {
      console.log('[DEBUG] Invalid prestataireId:', prestataireId);
      return of(null);
    }
    const url = `${this.baseUrl}/prestataires/${prestataireId}`;
    console.log(`[DEBUG] Fetching prestataire from: ${url}`);
    return this.http.get<{ success?: boolean; data?: any }>(url, { headers: this.headers }).pipe(
      map(response => {
        console.log('[DEBUG] Prestataire response:', response);
        const data = response.data || response;
        if (!data || typeof data !== 'object') {
          console.log('[DEBUG] Invalid prestataire JSON:', data);
          return null;
        }
        return Prestataire.fromJson(data);
      }),
      catchError(error => {
        console.error('[DEBUG] Error fetching prestataire:', error);
        return of(null);
      })
    );
  }

  private handleError(error: HttpErrorResponse | Error, context: string): Observable<never> {
    let errorMessage = 'Unknown error';
    if (error instanceof HttpErrorResponse) {
      errorMessage = error.error?.message || `Server error: ${error.status} - ${error.message}`;
    } else {
      errorMessage = error.message || String(error);
    }
    console.error(`[DEBUG] ${context}: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }

  getFactureById(factureId: string): Observable<any> {
    const url = `${this.baseUrl}/factures/${factureId}`;
    console.log(`[DEBUG] Fetching facture from: ${url}`);
    return this.http.get<{ success?: boolean; data?: any; message?: string }>(url, { headers: this.headers }).pipe(
      catchError(error => this.handleError(error, 'fetch facture'))
    );
  }
}

function saveAs(blob: Blob, arg1: string) {
  throw new Error('Function not implemented.');
}
