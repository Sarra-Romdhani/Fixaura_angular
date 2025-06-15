
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError, forkJoin, of } from 'rxjs';
// import { catchError, map, switchMap, tap, timeout } from 'rxjs/operators';
// import { io, Socket } from 'socket.io-client';
// import { environment } from '../environments/environment';
// import { Reservation } from '../classes/reservation.model';
// import { Client } from '../classes/client.model';
// import { Points } from '../classes/points.model';
// import { Facture } from '../classes/facture.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReservationService {
//   private readonly baseUrl = environment.baseUrl;
//   private readonly headers = new HttpHeaders({
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   });
//   private socket: Socket;

//   constructor(private http: HttpClient) {
//     this.socket = io(this.baseUrl, {
//       transports: ['websocket'],
//       autoConnect: true,
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 1000
//     });
//   }

//   fetchReservations(prestataireId: string): Observable<Reservation[]> {
//     const url = `${this.baseUrl}/reservations/prestataire?id_prestataire=${prestataireId}`;
//     console.log(`[DEBUG] Fetching reservations from: ${url}`);
//     return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
//       switchMap(response => {
//         const data = response.data || [];
//         console.log('[DEBUG] Raw reservations data:', data);
//         return forkJoin(
//           data.map((json: any) =>
//             this.getClient(json.id_client ?? 'unknown').pipe(
//               map(client => {
//                 const reservationJson = { ...json, client };
//                 return Reservation.fromJson(reservationJson);
//               })
//             )
//           )
//         ).pipe(
//           map(reservations => reservations || []),
//           catchError(error => this.handleError(error, 'fetch reservations'))
//         );
//       }),
//       catchError(error => this.handleError(error, 'fetch reservations'))
//     );
//   }

//   getReservationsByPrestataire(prestataireId: string): Observable<Reservation[]> {
//     return this.fetchReservations(prestataireId);
//   }

//   getPendingReservations(prestataireId: string): Observable<Reservation[]> {
//     const url = `${this.baseUrl}/reservations/prestataire/${prestataireId}?status=pending`;
//     console.log(`[DEBUG] Fetching pending reservations from: ${url}`);
//     return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
//       switchMap(response => {
//         const data = response.data || [];
//         console.log('[DEBUG] Raw pending reservations data:', data);
//         return forkJoin(
//           data.map((json: any) =>
//             this.getClient(json.id_client ?? 'unknown').pipe(
//               map(client => {
//                 const reservationJson = { ...json, client };
//                 if (reservationJson.date) {
//                   reservationJson.date = new Date(Date.parse(reservationJson.date)).toISOString();
//                 }
//                 return Reservation.fromJson(reservationJson);
//               })
//             )
//           )
//         ).pipe(
//           map(reservations => reservations || []),
//           catchError(error => this.handleError(error, 'fetch pending reservations'))
//         );
//       }),
//       catchError(error => this.handleError(error, 'fetch pending reservations'))
//     );
//   }

//   getConfirmedReservations(prestataireId: string): Observable<Reservation[]> {
//     const url = `${this.baseUrl}/reservations/prestataire/${prestataireId}?status=confirmed`;
//     console.log(`[DEBUG] Fetching confirmed reservations from: ${url}`);
//     return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
//       timeout(10000),
//       switchMap(response => {
//         const data = response.data || [];
//         console.log('[DEBUG] Raw confirmed reservations data:', data);
//         if (data.length === 0) {
//           return of([]);
//         }
//         return forkJoin(
//           data.map((json: any) =>
//             this.getClient(json.id_client ?? 'unknown').pipe(
//               map(client => {
//                 const reservationJson = { ...json, client, idPrestataire: prestataireId };
//                 if (reservationJson.date) {
//                   reservationJson.date = new Date(Date.parse(reservationJson.date)).toISOString();
//                 }
//                 return Reservation.fromJson(reservationJson);
//               })
//             )
//           )
//         );
//       }),
//       catchError(error => this.handleError(error, 'fetch confirmed reservations'))
//     );
//   }

//   getWaitingReservationsInWindow(prestataireId: string, date: Date): Observable<Reservation[]> {
//     const url = `${this.baseUrl}/reservations/prestataire/${prestataireId}?status=waiting`;
//     console.log(`[DEBUG] Fetching waiting reservations from: ${url}`);
//     return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
//       switchMap(response => {
//         const data = response.data || [];
//         const twoHoursBefore = new Date(date.getTime() - 2 * 60 * 60 * 1000);
//         const oneHourAfter = new Date(date.getTime() + 60 * 60 * 1000);
//         return forkJoin(
//           data
//             .filter((json: any) => json.status === 'waiting')
//             .filter((json: any) => {
//               const waitingDate = new Date(json.date);
//               return (
//                 waitingDate > twoHoursBefore &&
//                 waitingDate < oneHourAfter &&
//                 waitingDate.getDate() === date.getDate() &&
//                 waitingDate.getMonth() === date.getMonth() &&
//                 waitingDate.getFullYear() === date.getFullYear()
//               );
//             })
//             .map((json: any) =>
//               this.getClient(json.id_client ?? 'unknown').pipe(
//                 map(client => {
//                   const reservationJson = { ...json, client };
//                   return Reservation.fromJson(reservationJson);
//                 })
//               )
//             )
//         ).pipe(
//           map(reservations => reservations || []),
//           catchError(error => this.handleError(error, 'fetch waiting reservations'))
//         );
//       }),
//       catchError(error => this.handleError(error, 'fetch waiting reservations'))
//     );
//   }

//   getReservationById(reservationId: string): Observable<Reservation> {
//     const url = `${this.baseUrl}/reservations/${reservationId}`;
//     console.log(`[DEBUG] Fetching reservation by ID: ${url}`);
//     return this.http.get<{ data: any }>(url, { headers: this.headers }).pipe(
//       switchMap(response => {
//         const json = response.data || response;
//         if (!json || typeof json !== 'object') {
//           throw new Error('Invalid reservation data');
//         }
//         return this.getClient(json.id_client ?? 'unknown').pipe(
//           map(client => {
//             const reservationJson = { ...json, client };
//             return Reservation.fromJson(reservationJson);
//           })
//         );
//       }),
//       catchError(error => this.handleError(error, 'fetch reservation by id'))
//     );
//   }

// getClient(clientId: string): Observable<any> {
//     const url = `${this.baseUrl}/clients/${clientId}`;
//     console.log(`[DEBUG] Fetching client from: ${url}`);
//     return this.http.get(url, { headers: this.headers }).pipe(
//       catchError(error => {
//         if (error.status === 404) {
//           console.log(`[DEBUG] Client not found, trying prestataire: ${this.baseUrl}/prestataires/${clientId}`);
//           return this.http.get(`${this.baseUrl}/prestataires/${clientId}`, { headers: this.headers }).pipe(
//             tap(response => console.log('[DEBUG] Raw prestataire response:', response)),
//             catchError(prestataireError => {
//               console.error('Error fetching prestataire:', prestataireError);
//               return throwError(() => prestataireError);
//             })
//           );
//         }
//         console.error('Error fetching client:', error);
//         return throwError(() => error);
//       })
//     );
//   }

//   private isValidUrl(url: string): boolean {
//     if (url && url.startsWith('/uploads/')) {
//       console.log(`[DEBUG] Valid relative URL: ${url}`);
//       return true;
//     }
//     try {
//       new URL(url, window.location.origin);
//       console.log(`[DEBUG] Valid absolute URL: ${url}`);
//       return true;
//     } catch {
//       console.warn(`[DEBUG] Invalid URL: ${url}`);
//       return false;
//     }
//   }

//   checkAvailability(prestataireId: string, reservationDate: Date): Observable<boolean> {
//     return this.getConfirmedReservations(prestataireId).pipe(
//       map(reservations => {
//         const oneHourBefore = new Date(reservationDate.getTime() - 60 * 60 * 1000);
//         const twoHoursAfter = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000);
//         return !reservations.some(res => {
//           const resDate = new Date(res.date);
//           return resDate > oneHourBefore && resDate < twoHoursAfter;
//         });
//       }),
//       catchError(error => {
//         console.error('Error checking availability:', error);
//         return throwError(error);
//       })
//     );
//   }

// createReservation(reservationData: any): Observable<any> {
//     const url = `${this.baseUrl}/reservations`;
//     console.log(`[DEBUG] Creating reservation at: ${url}`, reservationData);
//     return this.getClient(reservationData.id_client).pipe(
//       switchMap(clientOrPrestataire => {
//         reservationData.location = clientOrPrestataire.homeAddress || clientOrPrestataire.businessAddress || 'Adresse non spécifiée';
//         return this.http.post<{ _id: string }>(url, reservationData, { headers: this.headers }).pipe(
//           tap(response => {
//             console.log('[DEBUG] Reservation created:', response);
//             this.socket.emit('newReservation', {
//               prestataireId: reservationData.id_prestataire,
//               reservationId: response._id
//             });
//           }),
//           catchError(error => {
//             console.error('Error creating reservation:', error);
//             return throwError(() => error);
//           })
//         );
//       })
//     );
//   }
//   cancelReservation(reservationId: string): Observable<{ canceledReservation: any, promotedReservation: any }> {
//     const url = `${this.baseUrl}/reservations/${reservationId}/cancel`;
//     console.log(`[DEBUG] Canceling reservation: ${url}`);
//     return this.http.put<{ data: { canceled: any, pending: any } }>(url, {}, { headers: this.headers }).pipe(
//       switchMap(response => {
//         return this.getReservationById(reservationId).pipe(
//           switchMap(reservation => {
//             const clientEmail = reservation.client.email;
//             if (clientEmail) {
//               const subject = 'Annulation de votre réservation - Fixaura';
//               const message = `
// Bonjour ${reservation.client.name || 'Client'},
// Votre réservation prévue pour le ${new Date(reservation.date).toLocaleString()} a été annulée.
// Service: ${reservation.service || 'N/A'}
// Lieu: ${reservation.location || 'N/A'}
// Pour toute question, contactez-nous à support@fixaura.com.
// Merci de faire confiance à Fixaura,
// L'équipe Fixaura
// `;
//               return this.sendNotification(clientEmail, subject, message).pipe(
//                 map(() => ({
//                   canceledReservation: response.data.canceled,
//                   promotedReservation: response.data.pending
//                 }))
//               );
//             }
//             return of({
//               canceledReservation: response.data.canceled,
//               promotedReservation: response.data.pending
//             });
//           })
//         );
//       }),
//       catchError(error => this.handleError(error, 'cancel reservation'))
//     );
//   }

//   updateReservationStatus(id: string, status: string): Observable<void> {
//     const url = `${this.baseUrl}/reservations/${id}`;
//     console.log(`[DEBUG] Updating reservation status: ${url}, status: ${status}`);
//     return this.http.put<void>(url, { status }, { headers: this.headers }).pipe(
//       catchError(error => this.handleError(error, 'update reservation status'))
//     );
//   }

//   deleteReservation(id: string): Observable<void> {
//     const url = `${this.baseUrl}/reservations/${id}`;
//     console.log(`[DEBUG] Deleting reservation: ${url}`);
//     return this.http.delete<void>(url, { headers: this.headers }).pipe(
//       catchError(error => {
//         console.error('[DEBUG] Delete reservation error:', error);
//         let errorMessage = 'Unknown error';
//         if (error.status === 404) {
//           errorMessage = 'Reservation not found';
//         } else if (error.status === 400) {
//           errorMessage = `Invalid request: ${error.error?.message || 'Unknown error'}`;
//         } else {
//           errorMessage = `Failed to delete reservation: ${error.status} - ${error.error?.message || 'Unknown error'}`;
//         }
//         return throwError(() => new Error(errorMessage));
//       })
//     );
//   }

//   promoteFirstWaitingReservation(prestataireId: string, date: Date): Observable<void> {
//     return this.getWaitingReservationsInWindow(prestataireId, date).pipe(
//       switchMap(reservations => {
//         if (reservations.length > 0) {
//           console.log(`[DEBUG] Promoting reservation ${reservations[0].id} to pending`);
//           return this.updateReservationStatus(reservations[0].id, 'pending');
//         }
//         console.log(`[DEBUG] No waiting reservations found to promote for date ${date}`);
//         return of(void 0);
//       }),
//       catchError(error => this.handleError(error, 'promote waiting reservation'))
//     );
//   }

//   verifyAndCompleteReservation(reservationId: string): Observable<void> {
//     const url = `${this.baseUrl}/reservations/verify/${reservationId}`;
//     console.log(`[DEBUG] Verifying reservation: ${url}`);
//     return this.http.get<void>(url, { headers: this.headers }).pipe(
//       catchError(error => this.handleError(error, 'verify reservation'))
//     );
//   }

//   getPointsForUser(userId: string): Observable<Points[]> {
//     const url = `${this.baseUrl}/reservations/points/${userId}`;
//     console.log(`[DEBUG] Fetching points for user: ${url}`);
//     return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
//       map(response => response.data.map(json => Points.fromJson(json))),
//       catchError(error => this.handleError(error, 'fetch points'))
//     );
//   }

//   sendLocationCard(reservationId: string, senderId: string, lat: number, lng: number): Observable<void> {
//     if (!reservationId || !senderId || isNaN(lat) || isNaN(lng)) {
//       console.error('[DEBUG] Invalid input for sendLocationCard:', { reservationId, senderId, lat, lng });
//       return throwError(() => new Error('Invalid input: reservationId, senderId, or coordinates are invalid'));
//     }
//     const url = `${this.baseUrl}/reservations/${reservationId}/send-location`;
//     console.log(`[DEBUG] Sending location card: ${url}, senderId: ${senderId}, lat: ${lat}, lng: ${lng}`);
//     return this.http.post<void>(url, { senderId, lat, lng }, { headers: this.headers }).pipe(
//       catchError(error => this.handleError(error, 'send location card'))
//     );
//   }

//   startLocationUpdates(prestataireId: string, reservationId: string): Observable<void> {
//     const url = `${this.baseUrl}/reservations/${reservationId}/location-updates/start`;
//     console.log(`[DEBUG] Starting location updates: ${url}, prestataireId: ${prestataireId}`);
//     return this.http.post<void>(url, { prestataireId }, { headers: this.headers }).pipe(
//       catchError(error => {
//         console.warn('[DEBUG] Location updates not supported by backend:', error);
//         return of(void 0);
//       })
//     );
//   }

//   stopLocationUpdates(): Observable<void> {
//     const url = `${this.baseUrl}/reservations/location-updates/stop`;
//     console.log(`[DEBUG] Stopping location updates: ${url}`);
//     return this.http.post<void>(url, {}, { headers: this.headers }).pipe(
//       catchError(error => {
//         console.warn('[DEBUG] Stop location updates not supported by backend:', error);
//         return of(void 0);
//       })
//     );
//   }

//   getRouteHistory(reservationId: string): Observable<{ lat: number, lng: number }[]> {
//     const url = `${this.baseUrl}/locations/history/${reservationId}`;
//     console.log(`[DEBUG] Fetching route history: ${url}`);
//     return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
//       map(response => response.data.map(loc => ({
//         lat: loc.coordinates.lat,
//         lng: loc.coordinates.lng
//       }))),
//       catchError(error => this.handleError(error, 'fetch route history'))
//     );
//   }

//   geocodeAddress(address: string): Observable<{ lat: number, lng: number } | null> {
//     const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1&countrycodes=TN`;
//     console.log(`[DEBUG] Geocoding address: ${url}`);
//     return this.http.get<any[]>(url, { headers: { 'User-Agent': 'FixauraApp/1.0 (contact@fixaura.com)' } }).pipe(
//       map(data => {
//         if (data.length > 0) {
//           return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
//         }
//         console.log(`[DEBUG] Geocoding failed for address: ${address}`);
//         return null;
//       }),
//       catchError(error => {
//         console.error('[DEBUG] Error geocoding address:', error);
//         return of(null);
//       })
//     );
//   }

//   calculateETA(start: { lat: number, lng: number }, end: { lat: number, lng: number }): Observable<string> {
//     const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`;
//     console.log(`[DEBUG] Calculating ETA: ${url}`);
//     return this.http.get<any>(url, { headers: this.headers }).pipe(
//       map(data => {
//         const durationSeconds = data.routes[0].duration;
//         const minutes = Math.round(durationSeconds / 60);
//         return minutes < 1 ? '< 1 min' : `~${minutes} min`;
//       }),
//       catchError(error => {
//         console.error('[DEBUG] Error calculating ETA:', error);
//         return of('ETA unavailable');
//       })
//     );
//   }

//   submitRating(reservationId: string, idPrestataire: string, rating: number): Observable<void> {
//     const url = `${this.baseUrl}/reservations/${reservationId}/rate`;
//     console.log(`[DEBUG] Submitting rating: ${url}, prestataireId: ${idPrestataire}, rating: ${rating}`);
//     return this.http.post<void>(url, { prestataireId: idPrestataire, rating }, { headers: this.headers }).pipe(
//       catchError(error => this.handleError(error, 'submit rating'))
//     );
//   }

//   getFacturesByPrestataire(prestataireId: string): Observable<Facture[]> {
//     const url = `${this.baseUrl}/factures/prestataire/${prestataireId}`;
//     console.log(`[DEBUG] Fetching factures for prestataire: ${url}`);
//     return this.http.get<{ data: any[]; success: boolean; message?: string }>(url, { headers: this.headers }).pipe(
//       map(response => {
//         const data = response.data || [];
//         console.log('[DEBUG] Raw factures data:', data);
//         if (response.success !== true) {
//           throw new Error(response.message || 'Failed to load factures');
//         }
//         return data.map((json: any) => Facture.fromJson(json));
//       }),
//       catchError(error => this.handleError(error, 'fetch factures'))
//     );
//   }

//   downloadFacture(factureId: string): Observable<Uint8Array> {
//     const url = `${this.baseUrl}/factures/download/${factureId}`;
//     console.log(`[DEBUG] Downloading facture: ${url}`);
//     return this.http.get(url, { headers: this.headers, responseType: 'arraybuffer' }).pipe(
//       map(response => new Uint8Array(response)),
//       catchError(error => this.handleError(error, 'download facture'))
//     );
//   }

//   sendNotification(email: string, subject: string, message: string): Observable<void> {
//     if (!email || !subject || !message) {
//       console.error('[DEBUG] Invalid notification data:', { email, subject, message });
//       return throwError(() => new Error('Email, subject, and message are required'));
//     }
//     const url = `${this.baseUrl}/reservations/notify`;
//     console.log(`[DEBUG] Sending notification to ${email}`);
//     return this.http.post<void>(url, { email, subject, message }, { headers: this.headers }).pipe(
//       catchError(error => {
//         console.error('[DEBUG] Error sending notification:', error);
//         return of(void 0);
//       })
//     );
//   }

//   private handleError(error: HttpErrorResponse, context: string): Observable<never> {
//     let errorMessage = 'Unknown error';
//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Client error: ${error.error.message}`;
//     } else {
//       errorMessage = error.error?.message || `Server error: ${error.status}`;
//     }
//     console.error(`[DEBUG] ${context}: ${errorMessage}`);
//     return throwError(() => new Error(errorMessage));
//   }
// }



import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, timeout } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Reservation } from '../classes/reservation.model';
import { Client } from '../classes/client.model';
import { Points } from '../classes/points.model';
import { Facture } from '../classes/facture.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly baseUrl = environment.baseUrl;
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(this.baseUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
  }

  fetchReservations(prestataireId: string): Observable<Reservation[]> {
    const url = `${this.baseUrl}/reservations/prestataire?id_prestataire=${prestataireId}`;
    console.log(`[DEBUG] Fetching reservations from: ${url}`);
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      switchMap(response => {
        const data = response.data || [];
        console.log('[DEBUG] Raw reservations data:', data);
        return this.mapReservations(data);
      }),
      catchError(error => this.handleError(error, 'fetch reservations'))
    );
  }

  getReservationsByPrestataire(prestataireId: string): Observable<Reservation[]> {
    return this.fetchReservations(prestataireId);
  }

  getPendingReservations(prestataireId: string): Observable<Reservation[]> {
    const url = `${this.baseUrl}/reservations/prestataire/${prestataireId}?status=pending`;
    console.log(`[DEBUG] Fetching pending reservations from: ${url}`);
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      switchMap(response => {
        const data = response.data || [];
        console.log('[DEBUG] Raw pending reservations data:', data);
        return this.mapReservations(data, true);
      }),
      catchError(error => this.handleError(error, 'fetch pending reservations'))
    );
  }

  getConfirmedReservations(prestataireId: string): Observable<Reservation[]> {
    const url = `${this.baseUrl}/reservations/prestataire/${prestataireId}?status=confirmed`;
    console.log(`[DEBUG] Fetching confirmed reservations from: ${url}`);
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      timeout(10000),
      switchMap(response => {
        const data = response.data || [];
        console.log('[DEBUG] Raw confirmed reservations data:', data);
        if (data.length === 0) {
          return of([]);
        }
        return this.mapReservations(data, true, prestataireId);
      }),
      catchError(error => this.handleError(error, 'fetch confirmed reservations'))
    );
  }

  getWaitingReservationsInWindow(prestataireId: string, date: Date): Observable<Reservation[]> {
    const url = `${this.baseUrl}/reservations/prestataire/${prestataireId}?status=waiting`;
    console.log(`[DEBUG] Fetching waiting reservations from: ${url}`);
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      switchMap(response => {
        const data = response.data || [];
        const twoHoursBefore = new Date(date.getTime() - 2 * 60 * 60 * 1000);
        const oneHourAfter = new Date(date.getTime() + 60 * 60 * 1000);
        const filteredData = data
          .filter((json: any) => json.status === 'waiting')
          .filter((json: any) => {
            const waitingDate = new Date(json.date);
            return (
              waitingDate > twoHoursBefore &&
              waitingDate < oneHourAfter &&
              waitingDate.getDate() === date.getDate() &&
              waitingDate.getMonth() === date.getMonth() &&
              waitingDate.getFullYear() === date.getFullYear()
            );
          });
        return this.mapReservations(filteredData);
      }),
      catchError(error => this.handleError(error, 'fetch waiting reservations'))
    );
  }

  getReservationById(reservationId: string): Observable<Reservation> {
    const url = `${this.baseUrl}/reservations/${reservationId}`;
    console.log(`[DEBUG] Fetching reservation by ID: ${url}`);
    return this.http.get<{ data: any }>(url, { headers: this.headers }).pipe(
      switchMap(response => {
        const json = response.data || response;
        if (!json || typeof json !== 'object') {
          throw new Error('Invalid reservation data');
        }
        return this.getClient(json.id_client ?? 'unknown').pipe(
          map(client => {
            const reservationJson = { ...json, client };
            return Reservation.fromJson(reservationJson);
          })
        );
      }),
      catchError(error => this.handleError(error, 'fetch reservation by id'))
    );
  }

  private mapReservations(data: any[], formatDate: boolean = false, prestataireId?: string): Observable<Reservation[]> {
    return new Observable<Reservation[]>(observer => {
      const reservations: Reservation[] = [];
      const processNext = (index: number) => {
        if (index >= data.length) {
          observer.next(reservations);
          observer.complete();
          return;
        }
        const json = data[index];
        this.getClient(json.id_client ?? 'unknown').subscribe({
          next: (client) => {
            const reservationJson = { ...json, client };
            if (formatDate && reservationJson.date) {
              reservationJson.date = new Date(Date.parse(reservationJson.date)).toISOString();
            }
            if (prestataireId) {
              reservationJson.idPrestataire = prestataireId;
            }
            reservations.push(Reservation.fromJson(reservationJson));
            processNext(index + 1);
          },
          error: (err) => {
            console.error('[DEBUG] Error fetching client for reservation:', err);
            reservations.push(Reservation.fromJson({ ...json, client: new Client('unknown', 'Utilisateur inconnu', '', '') }));
            processNext(index + 1);
          }
        });
      };
      processNext(0);
    });
  }

 getClient(clientId: string): Observable<Client> {
  if (!clientId || clientId === 'unknown') {
    console.log('[DEBUG] Invalid clientId, returning default client');
    return of(new Client('unknown', 'Utilisateur inconnu', '', '', '')); // Added empty image
  }

  const clientUrl = `${this.baseUrl}/clients/${clientId}`;
  console.log(`[DEBUG] Fetching client from: ${clientUrl}`);
  return this.http.get<{ data: any }>(clientUrl, { headers: this.headers }).pipe(
    map(response => {
      const data = response.data || response;
      console.log('[DEBUG] Client data:', data);
      return Client.fromJson(data);
    }),
    catchError(error => {
      if (error.status === 404) {
        console.log(`[DEBUG] Client not found, trying prestataire: ${this.baseUrl}/prestataires/${clientId}`);
        return this.http.get<{ data: any }>(`${this.baseUrl}/prestataires/${clientId}`, { headers: this.headers }).pipe(
          map(response => {
            const data = response.data || response;
            console.log('[DEBUG] Prestataire data:', data);
            return new Client(
              data._id?.toString() || clientId,
              data.name?.toString() || 'Prestataire Anonyme',
              data.email?.toString() || '',
              data.businessAddress?.toString() || data.homeAddress?.toString() || '',
              data.image?.toString() || '' // Map image field
            );
          }),
          catchError(prestataireError => {
            console.error('[DEBUG] Error fetching prestataire:', prestataireError);
            return of(new Client(clientId, 'Utilisateur inconnu', '', '', '')); // Added empty image
          })
        );
      }
      console.error('[DEBUG] Error fetching client:', error);
      return of(new Client(clientId, 'Utilisateur inconnu (erreur)', '', '', '')); // Added empty image
    })
  );
}

  private isValidUrl(url: string): boolean {
    if (url && url.startsWith('/uploads/')) {
      console.log(`[DEBUG] Valid relative URL: ${url}`);
      return true;
    }
    try {
      new URL(url, window.location.origin);
      console.log(`[DEBUG] Valid absolute URL: ${url}`);
      return true;
    } catch {
      console.warn(`[DEBUG] Invalid URL: ${url}`);
      return false;
    }
  }

  checkAvailability(prestataireId: string, reservationDate: Date): Observable<boolean> {
    return this.getConfirmedReservations(prestataireId).pipe(
      map(reservations => {
        const oneHourBefore = new Date(reservationDate.getTime() - 60 * 60 * 1000);
        const twoHoursAfter = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000);
        return !reservations.some(res => {
          const resDate = new Date(res.date);
          return resDate > oneHourBefore && resDate < twoHoursAfter;
        });
      }),
      catchError(error => {
        console.error('Error checking availability:', error);
        return throwError(error);
      })
    );
  }

  createReservation(reservationData: any): Observable<any> {
    const url = `${this.baseUrl}/reservations`;
    console.log(`[DEBUG] Creating reservation at: ${url}`, reservationData);
    return this.getClient(reservationData.id_client).pipe(
      switchMap(clientOrPrestataire => {
        reservationData.location = clientOrPrestataire.homeAddress || clientOrPrestataire.homeAddress || 'Adresse non spécifiée';
        return this.http.post<{ _id: string }>(url, reservationData, { headers: this.headers }).pipe(
          tap(response => {
            console.log('[DEBUG] Reservation created:', response);
            this.socket.emit('newReservation', {
              prestataireId: reservationData.id_prestataire,
              reservationId: response._id
            });
          }),
          catchError(error => {
            console.error('Error creating reservation:', error);
            return throwError(() => error);
          })
        );
      })
    );
  }

  cancelReservation(reservationId: string): Observable<{ canceledReservation: any, promotedReservation: any }> {
    const url = `${this.baseUrl}/reservations/${reservationId}/cancel`;
    console.log(`[DEBUG] Canceling reservation: ${url}`);
    return this.http.put<{ data: { canceled: any, pending: any } }>(url, {}, { headers: this.headers }).pipe(
      switchMap(response => {
        return this.getReservationById(reservationId).pipe(
          switchMap(reservation => {
            const clientEmail = reservation.client.email;
            if (clientEmail) {
              const subject = 'Annulation de votre réservation - Fixaura';
              const message = `
Bonjour ${reservation.client.name || 'Client'},
Votre réservation prévue pour le ${new Date(reservation.date).toLocaleString()} a été annulée.
Service: ${reservation.service || 'N/A'}
Lieu: ${reservation.location || 'N/A'}
Pour toute question, contactez-nous à support@fixaura.com.
Merci de faire confiance à Fixaura,
L'équipe Fixaura
`;
              return this.sendNotification(clientEmail, subject, message).pipe(
                map(() => ({
                  canceledReservation: response.data.canceled,
                  promotedReservation: response.data.pending
                }))
              );
            }
            return of({
              canceledReservation: response.data.canceled,
              promotedReservation: response.data.pending
            });
          })
        );
      }),
      catchError(error => this.handleError(error, 'cancel reservation'))
    );
  }

  updateReservationStatus(id: string, status: string): Observable<void> {
    const url = `${this.baseUrl}/reservations/${id}`;
    console.log(`[DEBUG] Updating reservation status: ${url}, status: ${status}`);
    return this.http.put<void>(url, { status }, { headers: this.headers }).pipe(
      catchError(error => this.handleError(error, 'update reservation status'))
    );
  }

 deleteReservation(reservationId: string): Observable<any> {
    console.log(`[DEBUG] Sending DELETE request for reservation ${reservationId}`);
    return this.http.delete(`${this.baseUrl}/reservations/${reservationId}`);
  }

  promoteFirstWaitingReservation(prestataireId: string, date: Date): Observable<void> {
    return this.getWaitingReservationsInWindow(prestataireId, date).pipe(
      switchMap(reservations => {
        if (reservations.length > 0) {
          console.log(`[DEBUG] Promoting reservation ${reservations[0].id} to pending`);
          return this.updateReservationStatus(reservations[0].id, 'pending');
        }
        console.log(`[DEBUG] No waiting reservations found to promote for date ${date}`);
        return of(void 0);
      }),
      catchError(error => this.handleError(error, 'promote waiting reservation'))
    );
  }

  verifyAndCompleteReservation(reservationId: string): Observable<void> {
    const url = `${this.baseUrl}/reservations/verify/${reservationId}`;
    console.log(`[DEBUG] Verifying reservation: ${url}`);
    return this.http.get<void>(url, { headers: this.headers }).pipe(
      catchError(error => this.handleError(error, 'verify reservation'))
    );
  }

  getPointsForUser(userId: string): Observable<Points[]> {
    const url = `${this.baseUrl}/reservations/points/${userId}`;
    console.log(`[DEBUG] Fetching points for user: ${url}`);
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      map(response => response.data.map(json => Points.fromJson(json))),
      catchError(error => this.handleError(error, 'fetch points'))
    );
  }

  sendLocationCard(reservationId: string, senderId: string, lat: number, lng: number): Observable<void> {
    if (!reservationId || !senderId || isNaN(lat) || isNaN(lng)) {
      console.error('[DEBUG] Invalid input for sendLocationCard:', { reservationId, senderId, lat, lng });
      return throwError(() => new Error('Invalid input: reservationId, senderId, or coordinates are invalid'));
    }
    const url = `${this.baseUrl}/reservations/${reservationId}/send-location`;
    console.log(`[DEBUG] Sending location card: ${url}, senderId: ${senderId}, lat: ${lat}, lng: ${lng}`);
    return this.http.post<void>(url, { senderId, lat, lng }, { headers: this.headers }).pipe(
      catchError(error => this.handleError(error, 'send location card'))
    );
  }

  startLocationUpdates(prestataireId: string, reservationId: string): Observable<void> {
    const url = `${this.baseUrl}/reservations/${reservationId}/location-updates/start`;
    console.log(`[DEBUG] Starting location updates: ${url}, prestataireId: ${prestataireId}`);
    return this.http.post<void>(url, { prestataireId }, { headers: this.headers }).pipe(
      catchError(error => {
        console.warn('[DEBUG] Location updates not supported by backend:', error);
        return of(void 0);
      })
    );
  }

  stopLocationUpdates(): Observable<void> {
    const url = `${this.baseUrl}/reservations/location-updates/stop`;
    console.log(`[DEBUG] Stopping location updates: ${url}`);
    return this.http.post<void>(url, {}, { headers: this.headers }).pipe(
      catchError(error => {
        console.warn('[DEBUG] Stop location updates not supported by backend:', error);
        return of(void 0);
      })
    );
  }

  getRouteHistory(reservationId: string): Observable<{ lat: number, lng: number }[]> {
    const url = `${this.baseUrl}/locations/history/${reservationId}`;
    console.log(`[DEBUG] Fetching route history: ${url}`);
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      map(response => response.data.map(loc => ({
        lat: loc.coordinates.lat,
        lng: loc.coordinates.lng
      }))),
      catchError(error => this.handleError(error, 'fetch route history'))
    );
  }

  geocodeAddress(address: string): Observable<{ lat: number, lng: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1&countrycodes=TN`;
    console.log(`[DEBUG] Geocoding address: ${url}`);
    return this.http.get<any[]>(url, { headers: { 'User-Agent': 'FixauraApp/1.0 (contact@fixaura.com)' } }).pipe(
      map(data => {
        if (data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
        console.log(`[DEBUG] Geocoding failed for address: ${address}`);
        return null;
      }),
      catchError(error => {
        console.error('[DEBUG] Error geocoding address:', error);
        return of(null);
      })
    );
  }

  calculateETA(start: { lat: number, lng: number }, end: { lat: number, lng: number }): Observable<string> {
    const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`;
    console.log(`[DEBUG] Calculating ETA: ${url}`);
    return this.http.get<any>(url, { headers: this.headers }).pipe(
      map(data => {
        const durationSeconds = data.routes[0].duration;
        const minutes = Math.round(durationSeconds / 60);
        return minutes < 1 ? '< 1 min' : `~${minutes} min`;
      }),
      catchError(error => {
        console.error('[DEBUG] Error calculating ETA:', error);
        return of('ETA unavailable');
      })
    );
  }

  submitRating(reservationId: string, idPrestataire: string, rating: number): Observable<void> {
    const url = `${this.baseUrl}/reservations/${reservationId}/rate`;
    console.log(`[DEBUG] Submitting rating: ${url}, prestataireId: ${idPrestataire}, rating: ${rating}`);
    return this.http.post<void>(url, { prestataireId: idPrestataire, rating }, { headers: this.headers }).pipe(
      catchError(error => this.handleError(error, 'submit rating'))
    );
  }

  getFacturesByPrestataire(prestataireId: string): Observable<Facture[]> {
    const url = `${this.baseUrl}/factures/prestataire/${prestataireId}`;
    console.log(`[DEBUG] Fetching factures for prestataire: ${url}`);
    return this.http.get<{ data: any[]; success: boolean; message?: string }>(url, { headers: this.headers }).pipe(
      map(response => {
        const data = response.data || [];
        console.log('[DEBUG] Raw factures data:', data);
        if (response.success !== true) {
          throw new Error(response.message || 'Failed to load factures');
        }
        return data.map((json: any) => Facture.fromJson(json));
      }),
      catchError(error => this.handleError(error, 'fetch factures'))
    );
  }

  downloadFacture(factureId: string): Observable<Uint8Array> {
    const url = `${this.baseUrl}/factures/download/${factureId}`;
    console.log(`[DEBUG] Downloading facture: ${url}`);
    return this.http.get(url, { headers: this.headers, responseType: 'arraybuffer' }).pipe(
      map(response => new Uint8Array(response)),
      catchError(error => this.handleError(error, 'download facture'))
    );
  }

  sendNotification(email: string, subject: string, message: string): Observable<void> {
    if (!email || !subject || !message) {
      console.error('[DEBUG] Invalid notification data:', { email, subject, message });
      return throwError(() => new Error('Email, subject, and message are required'));
    }
    const url = `${this.baseUrl}/reservations/notify`;
    console.log(`[DEBUG] Sending notification to ${email}`);
    return this.http.post<void>(url, { email, subject, message }, { headers: this.headers }).pipe(
      catchError(error => {
        console.error('[DEBUG] Error sending notification:', error);
        return of(void 0);
      })
    );
  }

  private handleError(error: HttpErrorResponse, context: string): Observable<never> {
    let errorMessage = 'Unknown error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }
    console.error(`[DEBUG] ${context}: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}