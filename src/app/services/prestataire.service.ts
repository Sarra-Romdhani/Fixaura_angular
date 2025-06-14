import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Prestataire } from '../classes/prestataire.model';
import { environment } from '../environments/environment';

// Interface for coordinates (based on LatLng in Flutter)
export interface Coordinates {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {
  private readonly baseUrl = environment.baseUrl;
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {}

  // Fetch a single prestataire by userId
  fetchPrestataire(userId: string): Observable<Prestataire> {
    if (!userId) {
      console.error('[ERROR] fetchPrestataire: userId is empty');
      return throwError(() => new Error('fetch prestataire: userId is required'));
    }
    const url = `${this.baseUrl}/prestataires/${userId}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('[DEBUG] Fetch prestataire raw response:', response);
        // Handle both direct object and { data: {...} } responses
        const prestataireData = response.data || response;
        if (!prestataireData || !prestataireData._id) {
          console.error('[ERROR] fetchPrestataire: Invalid response, missing _id');
          throw new Error('Invalid prestataire response: missing _id');
        }
        const prestataire = Prestataire.fromJson(prestataireData);
        console.log('[DEBUG] Mapped prestataire:', prestataire);
        return prestataire;
      }),
      catchError(error => this.handleError(error, 'fetch prestataire'))
    );
  }

  getPrestataireById(id: string): Observable<Prestataire> {
    if (!id) {
      console.error('[ERROR] getPrestataireById: id is empty');
      return throwError(() => new Error('getPrestataireById: id is required'));
    }
    const url = `${this.baseUrl}/prestataires/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('[DEBUG] getPrestataireById raw response:', response);
        const prestataireData = response.data || response;
        if (!prestataireData || !prestataireData._id) {
          throw new Error('Invalid prestataire response: missing _id');
        }
        return Prestataire.fromJson(prestataireData);
      }),
      catchError(error => this.handleError(error, 'get prestataire by id'))
    );
  }

  // Update a prestataire's profile, with optional image file
  updatePrestataire(userId: string, prestataire: Partial<Prestataire>, imageFile?: File): Observable<void> {
    const url = `${this.baseUrl}/prestataires/${userId}`;
    const formData = new FormData();

    // Add form fields (matching Flutter's request.fields)
    formData.append('name', prestataire.name || '');
    formData.append('job', prestataire.job || '');
    formData.append('phoneNumber', prestataire.phoneNumber || '');
    formData.append('businessAddress', prestataire.businessAddress || '');
    formData.append('facebook', prestataire.facebook || '');
    formData.append('instagram', prestataire.instagram || '');
    formData.append('website', prestataire.website || '');

    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    // Log for debugging
    console.log('[DEBUG] Sending update form data:', formData);

    return this.http.put<void>(url, formData).pipe(
      catchError(error => this.handleError(error, 'update prestataire'))
    );
  }

  // Fetch statistics for a prestataire
  getStatistics(userId: string): Observable<{ [key: string]: any }> {
    const url = `${this.baseUrl}/prestataires/${userId}/statistics`;
    return this.http.get<{ data: { [key: string]: any } }>(url, { headers: this.headers }).pipe(
      map(response => response.data),
      catchError(error => this.handleError(error, 'fetch statistics'))
    );
  }

  // Fetch all prestataires except the one with excludeId
  getAllPrestatairesExceptMe(excludeId: string): Observable<Prestataire[]> {
    const url = `${this.baseUrl}/prestataires/exclude/${excludeId}`;
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      map(response => {
        console.log(`[DEBUG] Fetched ${response.data.length} prestataires (excluding ID: ${excludeId})`);
        return response.data.map(item => Prestataire.fromJson(item));
      }),
      catchError(error => this.handleError(error, 'fetch all prestataires'))
    );
  }

  // Search prestataires by name for the same job
  searchPrestataires(userId: string, query: string): Observable<Prestataire[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${this.baseUrl}/prestataires/${userId}/same-job/search?name=${encodedQuery}`;
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      map(response => response.data.map(item => Prestataire.fromJson(item))),
      catchError(error => this.handleError(error, 'search prestataires'))
    );
  }

  // Fetch prestataires with the same job
  getSameJobPrestataires(userId: string): Observable<Prestataire[]> {
    const url = `${this.baseUrl}/prestataires/${userId}/same-job`;
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      map(response => response.data.map(item => Prestataire.fromJson(item))),
      catchError(error => this.handleError(error, 'fetch same job prestataires'))
    );
  }

  // Search prestataires by name (excluding a specific ID)
  searchByName(query: string, excludeId: string): Observable<Prestataire[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${this.baseUrl}/prestataires/search?name=${encodedQuery}&excludeId=${excludeId}`;
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      map(response => {
        console.log(`[DEBUG] Search returned ${response.data.length} prestataires for query: ${query}`);
        return response.data.map(item => Prestataire.fromJson(item));
      }),
      catchError(error => this.handleError(error, 'search prestataires by name'))
    );
  }

  // Fetch dark mode preference
  // fetchDarkModePreference(userId: string): Observable<boolean> {
  //   const url = `${this.baseUrl}/prestataires/${userId}/dark-mode`;
  //   return this.http.get<{ darkMode: boolean }>(url).pipe(
  //     map(response => response.darkMode ?? false),
  //     catchError(error => this.handleError(error, 'fetch dark mode preference'))
  //   );
  // }

  // // Update dark mode preference
  // updateDarkModePreference(userId: string, isDarkMode: boolean): Observable<void> {
  //   const url = `${this.baseUrl}/prestataires/${userId}/dark-mode`;
  //   return this.http.put<void>(url, { darkMode: isDarkMode }, { headers: this.headers }).pipe(
  //     catchError(error => this.handleError(error, 'update dark mode preference'))
  //   );
  // }

  // Fetch prestataires with different jobs
  getPrestatairesWithDifferentJobs(userId: string): Observable<Prestataire[]> {
    const url = `${this.baseUrl}/prestataires/different-job/${userId}`;
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      map(response => response.data.map(item => Prestataire.fromJson(item))),
      catchError(error => this.handleError(error, 'fetch prestataires with different jobs'))
    );
  }

  // Search prestataires with different jobs by name
  searchByNameWithDifferentJobs(userId: string, name: string): Observable<Prestataire[]> {
    const encodedName = encodeURIComponent(name);
    const url = `${this.baseUrl}/prestataires/different-job/${userId}/search?name=${encodedName}`;
    return this.http.get<{ data: any[] }>(url, { headers: this.headers }).pipe(
      map(response => response.data.map(item => Prestataire.fromJson(item))),
      catchError(error => this.handleError(error, 'search prestataires with different jobs'))
    );
  }

  // Send location card with coordinates
  sendLocationCard(reservationId: string, coordinates: Coordinates): Observable<void> {
    const url = `${this.baseUrl}/reservations/${reservationId}/send-location`;
    return this.http.post<void>(url, { coordinates }, { headers: this.headers }).pipe(
      catchError(error => this.handleError(error, 'send location'))
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse | any, context: string): Observable<never> {
    let errorMessage = `${context}: Unknown error`;
    if (error instanceof HttpErrorResponse) {
      errorMessage = `${context}: Server error ${error.status} - ${error.message}`;
      if (error.error?.message) {
        errorMessage = `${context}: ${error.error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = `${context}: Client error - ${error.message}`;
    }
    console.error('[ERROR] PrestataireService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
fetchDarkModePreference(userId: string): Observable<boolean> {
  console.warn('[DEBUG] Mocking dark mode preference fetch');
  return of(false); // Mock response
}

updateDarkModePreference(userId: string, isDarkMode: boolean): Observable<void> {
  console.warn('[DEBUG] Mocking dark mode preference update');
  return of(undefined); // Mock response
}
}