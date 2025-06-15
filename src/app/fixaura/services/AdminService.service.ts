

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { tap, catchError, map } from 'rxjs/operators';

// export interface ApiResponse<T> {
//   data?: T;
//   success?: boolean;
// }

// export interface Reservation {
//   _id: string;
//   id_client: string;
//   id_prestataire: string;
//   date: Date;
//   status: string;
//   service: string;
// }

// export interface Prestataire {
//   _id: string;
//   name: string;
//   email: string;
//   job: string;
//   category: string;
//   rating: number;
//   ratingCount: number;
//   isFlagged: boolean;
//   flagReason?: string;
//   password?: string;
//   status?: string;
//   deletionReason?: string;
//   deletedAt?: Date;
// }

// export interface Client {
//   _id: string;
//   name: string;
//   email: string;
//   homeAddress: string;
//   isFlagged: boolean;
//   flagReason?: string;
//   password?: string;
//   status?: string;
//   deletionReason?: string;
//   deletedAt?: Date;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AdminService {
//   private apiUrl = 'http://localhost:3000';

//   constructor(private http: HttpClient) {}

//   getDetailedStatistics(): Observable<ApiResponse<any>> {
//     return this.http.get<ApiResponse<any>>(`${this.apiUrl}/reservations/detailed-statistics`).pipe(
//       tap((data) => console.log('getDetailedStatistics:', data)),
//       catchError((err) => {
//         throw err;
//       }),
//     );
//   }

//   getAllClients(): Observable<Client[]> {
//     return this.http.get<ApiResponse<Client[]>>(`${this.apiUrl}/clients`).pipe(
//       map((response) => {
//         if (response && 'data' in response) {
//           return response.data || [];
//         }
//         throw new Error('Invalid response format: Expected ApiResponse<Client[]>');
//       }),
//       map((clients) =>
//         clients.map((client) => ({
//           _id: client._id,
//           name: client.name,
//           email: client.email,
//           homeAddress: client.homeAddress || '',
//           isFlagged: client.isFlagged || false,
//           flagReason: client.flagReason || '',
//           password: client.password,
//           status: client.status || 'actif',
//           deletionReason: client.deletionReason || '',
//           deletedAt: client.deletedAt,
//         })),
//       ),
//       tap((data) => console.log('getAllClients:', data)),
//       catchError((err) => {
//         console.error('getAllClients error:', err);
//         let errorMessage = 'Failed to fetch clients';
//         if (err.status === 404) {
//           errorMessage = 'Clients endpoint not found (404). Check backend route configuration.';
//         } else if (err.status === 0) {
//           errorMessage = 'Unable to reach server. Ensure backend is running on ' + this.apiUrl;
//         } else {
//           errorMessage = `Failed to fetch clients: ${err.message || 'Unknown error'}`;
//         }
//         return throwError(() => new Error(errorMessage));
//       }),
//     );
//   }

//   getDeletedClients(): Observable<Client[]> {
//     return this.http.get<ApiResponse<Client[]>>(`${this.apiUrl}/clients/deleted`).pipe(
//       map((response) => {
//         if (response && 'data' in response) {
//           return response.data || [];
//         }
//         throw new Error('Invalid response format: Expected ApiResponse<Client[]>');
//       }),
//       map((clients) =>
//         clients.map((client) => ({
//           _id: client._id,
//           name: client.name,
//           email: client.email,
//           homeAddress: client.homeAddress || '',
//           isFlagged: client.isFlagged || false,
//           flagReason: client.flagReason || '',
//           password: client.password,
//           status: client.status || 'supprimé',
//           deletionReason: client.deletionReason || '',
//           deletedAt: client.deletedAt,
//         })),
//       ),
//       tap((data) => console.log('getDeletedClients:', data)),
//       catchError((err) => {
//         console.error('getDeletedClients error:', err);
//         let errorMessage = 'Failed to fetch deleted clients';
//         if (err.status === 404) {
//           errorMessage = 'Deleted clients endpoint not found (404). Check backend route configuration.';
//         } else if (err.status === 0) {
//           errorMessage = 'Unable to reach server. Ensure backend is running on ' + this.apiUrl;
//         } else {
//           errorMessage = `Failed to fetch deleted clients: ${err.message || 'Unknown error'}`;
//         }
//         return throwError(() => new Error(errorMessage));
//       }),
//     );
//   }

//   getAllPrestataires(): Observable<ApiResponse<Prestataire[]>> {
//     return this.http.get<ApiResponse<Prestataire[]>>(`${this.apiUrl}/prestataires`).pipe(
//       tap((data) => console.log('getAllPrestataires:', data)),
//       catchError((err) => {
//         console.error('getAllPrestataires error:', err);
//         let errorMessage = 'Failed to fetch prestataires';
//         if (err.status === 404) {
//           errorMessage = 'Prestataires endpoint not found (404). Check backend route configuration.';
//         } else if (err.status === 0) {
//           errorMessage = 'Unable to reach server. Ensure backend is running on ' + this.apiUrl;
//         } else {
//           errorMessage = `Failed to fetch prestataires: ${err.message || 'Unknown error'}`;
//         }
//         return throwError(() => new Error(errorMessage));
//       }),
//     );
//   }

//   getDeletedPrestataires(): Observable<Prestataire[]> {
//     return this.http.get<ApiResponse<Prestataire[]>>(`${this.apiUrl}/prestataires/deleted`).pipe(
//       map((response) => {
//         if (response && 'data' in response) {
//           return response.data || [];
//         }
//         throw new Error('Invalid response format: Expected ApiResponse<Prestataire[]>');
//       }),
//       map((prestataires) =>
//         prestataires.map((prestataire) => ({
//           _id: prestataire._id,
//           name: prestataire.name,
//           email: prestataire.email,
//           job: prestataire.job,
//           category: prestataire.category,
//           rating: prestataire.rating || 0,
//           ratingCount: prestataire.ratingCount || 0,
//           isFlagged: prestataire.isFlagged || false,
//           flagReason: prestataire.flagReason || '',
//           password: prestataire.password,
//           status: prestataire.status || 'supprimé',
//           deletionReason: prestataire.deletionReason || '',
//           deletedAt: prestataire.deletedAt,
//         })),
//       ),
//       tap((data) => console.log('getDeletedPrestataires:', data)),
//       catchError((err) => {
//         console.error('getDeletedPrestataires error:', err);
//         let errorMessage = 'Failed to fetch deleted prestataires';
//         if (err.status === 404) {
//           errorMessage = 'Deleted prestataires endpoint not found (404). Check backend route configuration.';
//         } else if (err.status === 0) {
//           errorMessage = 'Unable to reach server. Ensure backend is running on ' + this.apiUrl;
//         } else {
//           errorMessage = `Failed to fetch deleted prestataires: ${err.message || 'Unknown error'}`;
//         }
//         return throwError(() => new Error(errorMessage));
//       }),
//     );
//   }

//   getReservations(): Observable<ApiResponse<Reservation[]>> {
//     return this.http.get<ApiResponse<Reservation[]>>(`${this.apiUrl}/reservations`).pipe(
//       tap((data) => console.log('getReservations:', data)),
//       catchError((err) => {
//         console.error('getReservations error:', err);
//         return throwError(() => new Error(`Failed to fetch reservations: ${err.message || 'Unknown error'}`));
//       }),
//     );
//   }

//   deleteClient(id: string, reason: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/clients/${id}/delete`, { reason }).pipe(
//       tap((data) => console.log('deleteClient:', data)),
//       catchError((err) => {
//         console.error('deleteClient error:', err);
//         return throwError(() => new Error(`Failed to delete client: ${err.message || 'Unknown error'}`));
//       }),
//     );
//   }

//   deletePrestataire(id: string, reason: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/prestataires/${id}`, { body: { reason } }).pipe(
//       tap((data) => console.log('deletePrestataire:', data)),
//       catchError((err) => {
//         console.error('deletePrestataire error:', err);
//         return throwError(() => new Error(`Failed to delete prestataire: ${err.message || 'Unknown error'}`));
//       }),
//     );
//   }

//   flagClient(id: string, reason: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/clients/${id}/flag`, { reason }).pipe(
//       tap((data) => console.log('flagClient:', data)),
//       catchError((err) => {
//         console.error('flagClient error:', err);
//         return throwError(() => new Error(`Failed to flag client: ${err.message || 'Unknown error'}`));
//       }),
//     );
//   }

//   flagPrestataire(id: string, reason: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/prestataires/${id}/flag`, { reason }).pipe(
//       tap((data) => console.log('flagPrestataire:', data)),
//       catchError((err) => {
//         console.error('flagPrestataire error:', err);
//         return throwError(() => new Error(`Failed to flag prestataire: ${err.message || 'Unknown error'}`));
//       }),
//     );
//   }
// }




import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data?: T;
  success?: boolean;
}

export interface Reservation {
  _id: string;
  id_client: string;
  id_prestataire: string;
  date: Date;
  status: string;
  service: string;
}

export interface Prestataire {
  _id: string;
  name: string;
  email: string;
  job: string;
  category: string;
  rating: number;
  ratingCount: number;
  isFlagged: boolean;
  flagReason?: string;
  password?: string;
  status?: string;
  deletionReason?: string;
  deletedAt?: Date;
  flagCount?: number;
  deactivationUntil?: Date;
}

export interface Client {
  _id: string;
  name: string;
  email: string;
  homeAddress: string;
  isFlagged: boolean;
  flagReason?: string;
  password?: string;
  status?: string;
  deletionReason?: string;
  deletedAt?: Date;
  flagCount?: number; // Added to track number of flags
  deactivationUntil?: Date; // Added for temporary deactivation
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getDetailedStatistics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/reservations/detailed-statistics`).pipe(
      tap((data) => console.log('getDetailedStatistics:', data)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<ApiResponse<Client[]>>(`${this.apiUrl}/clients`).pipe(
      map((response) => {
        if (response && 'data' in response) {
          return response.data || [];
        }
        throw new Error('Invalid response format: Expected ApiResponse<Client[]>');
      }),
      map((clients) =>
        clients.map((client) => ({
          _id: client._id,
          name: client.name,
          email: client.email,
          homeAddress: client.homeAddress || '',
          isFlagged: client.isFlagged || false,
          flagReason: client.flagReason || '',
          password: client.password,
          status: client.status || 'actif',
          deletionReason: client.deletionReason || '',
          deletedAt: client.deletedAt,
          flagCount: client.flagCount || 0,
          deactivationUntil: client.deactivationUntil,
        })),
      ),
      tap((data) => console.log('getAllClients:', data)),
      catchError((err) => {
        console.error('getAllClients error:', err);
        let errorMessage = 'Failed to fetch clients';
        if (err.status === 404) {
          errorMessage = 'Clients endpoint not found (404). Check backend route configuration.';
        } else if (err.status === 0) {
          errorMessage = 'Unable to reach server. Ensure backend is running on ' + this.apiUrl;
        } else {
          errorMessage = `Failed to fetch clients: ${err.message || 'Unknown error'}`;
        }
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  getDeletedClients(): Observable<Client[]> {
    return this.http.get<ApiResponse<Client[]>>(`${this.apiUrl}/clients/deleted`).pipe(
      map((response) => {
        if (response && 'data' in response) {
          return response.data || [];
        }
        throw new Error('Invalid response format: Expected ApiResponse<Client[]>');
      }),
      map((clients) =>
        clients.map((client) => ({
          _id: client._id,
          name: client.name,
          email: client.email,
          homeAddress: client.homeAddress || '',
          isFlagged: client.isFlagged || false,
          flagReason: client.flagReason || '',
          password: client.password,
          status: client.status || 'supprimé',
          deletionReason: client.deletionReason || '',
          deletedAt: client.deletedAt,
          flagCount: client.flagCount || 0,
          deactivationUntil: client.deactivationUntil,
        })),
      ),
      tap((data) => console.log('getDeletedClients:', data)),
      catchError((err) => {
        console.error('getDeletedClients error:', err);
        let errorMessage = 'Failed to fetch deleted clients';
        if (err.status === 404) {
          errorMessage = 'Deleted clients endpoint not found (404). Check backend route configuration.';
        } else if (err.status === 0) {
          errorMessage = 'Unable to reach server. Ensure backend is running on ' + this.apiUrl;
        } else {
          errorMessage = `Failed to fetch deleted clients: ${err.message || 'Unknown error'}`;
        }
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  getAllPrestataires(): Observable<ApiResponse<Prestataire[]>> {
    return this.http.get<ApiResponse<Prestataire[]>>(`${this.apiUrl}/prestataires`).pipe(
      tap((data) => console.log('getAllPrestataires:', data)),
      catchError((err) => {
        console.error('getAllPrestataires error:', err);
        let errorMessage = 'Failed to fetch prestataires';
        if (err.status === 404) {
          errorMessage = 'Prestataires endpoint not found (404). Check backend route configuration.';
        } else if (err.status === 0) {
          errorMessage = 'Unable to reach server. Ensure backend is running on ' + this.apiUrl;
        } else {
          errorMessage = `Failed to fetch prestataires: ${err.message || 'Unknown error'}`;
        }
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  getDeletedPrestataires(): Observable<Prestataire[]> {
    return this.http.get<ApiResponse<Prestataire[]>>(`${this.apiUrl}/prestataires/deleted`).pipe(
      map((response) => {
        if (response && 'data' in response) {
          return response.data || [];
        }
        throw new Error('Invalid response format: Expected ApiResponse<Prestataire[]>');
      }),
      map((prestataires) =>
        prestataires.map((prestataire) => ({
          _id: prestataire._id,
          name: prestataire.name,
          email: prestataire.email,
          job: prestataire.job,
          category: prestataire.category,
          rating: prestataire.rating || 0,
          ratingCount: prestataire.ratingCount || 0,
          isFlagged: prestataire.isFlagged || false,
          flagReason: prestataire.flagReason || '',
          password: prestataire.password,
          status: prestataire.status || 'supprimé',
          deletionReason: prestataire.deletionReason || '',
          deletedAt: prestataire.deletedAt,
          flagCount: prestataire.flagCount || 0,
          deactivationUntil: prestataire.deactivationUntil,
        })),
      ),
      tap((data) => console.log('getDeletedPrestataires:', data)),
      catchError((err) => {
        console.error('getDeletedPrestataires error:', err);
        let errorMessage = 'Failed to fetch deleted prestataires';
        if (err.status === 404) {
          errorMessage = 'Deleted prestataires endpoint not found (404). Check backend route configuration.';
        } else if (err.status === 0) {
          errorMessage = 'Unable to reach server. Ensure backend is running on ' + this.apiUrl;
        } else {
          errorMessage = `Failed to fetch deleted prestataires: ${err.message || 'Unknown error'}`;
        }
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  getReservations(): Observable<ApiResponse<Reservation[]>> {
    return this.http.get<ApiResponse<Reservation[]>>(`${this.apiUrl}/reservations`).pipe(
      tap((data) => console.log('getReservations:', data)),
      catchError((err) => {
        console.error('getReservations error:', err);
        return throwError(() => new Error(`Failed to fetch reservations: ${err.message || 'Unknown error'}`));
      }),
    );
  }

  deleteClient(id: string, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/clients/${id}/delete`, { reason }).pipe(
      tap((data) => console.log('deleteClient:', data)),
      catchError((err) => {
        console.error('deleteClient error:', err);
        return throwError(() => new Error(`Failed to delete client: ${err.message || 'Unknown error'}`));
      }),
    );
  }

  deletePrestataire(id: string, reason: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/prestataires/${id}`, { body: { reason } }).pipe(
      tap((data) => console.log('deletePrestataire:', data)),
      catchError((err) => {
        console.error('deletePrestataire error:', err);
        return throwError(() => new Error(`Failed to delete prestataire: ${err.message || 'Unknown error'}`));
      }),
    );
  }

  flagClient(id: string, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/clients/${id}/flag`, { reason }).pipe(
      tap((data) => console.log('flagClient:', data)),
      catchError((err) => {
        console.error('flagClient error:', err);
        return throwError(() => new Error(`Failed to flag client: ${err.message || 'Unknown error'}`));
      }),
    );
  }

  flagPrestataire(id: string, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/prestataires/${id}/flag`, { reason }).pipe(
      tap((data) => console.log('flagPrestataire:', data)),
      catchError((err) => {
        console.error('flagPrestataire error:', err);
        return throwError(() => new Error(`Failed to flag prestataire: ${err.message || 'Unknown error'}`));
      }),
    );
  }



  logout(): Observable<any> {
  return this.http.post(`${this.apiUrl}/admin/logout`, {}).pipe(
    tap(() => console.log('Logout API call successful')),
    catchError((err) => {
      console.error('Logout API error:', err);
      return throwError(() => new Error(`Failed to logout: ${err.message || 'Unknown error'}`));
    })
  );
}
}