import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Client } from '../classes/client.model';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) {}

  fetchClient(userId: string): Observable<Client> {
    return this.http.get<any>(`${environment.baseUrl}/clients/${userId}`, { headers: { 'Content-Type': 'application/json' } }).pipe(
      map(response => {
        if (response.success !== true) {
          throw new Error(response.message ?? 'Unknown error');
        }
        return {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          homeAddress: response.data.homeAddress,
          image: response.data.image,
          phoneNumber: response.data.phoneNumber
        };
      }),
      catchError(err => {
        console.error(`Error in fetchClient for userId ${userId}:`, err);
        return throwError(`Erreur de récupération client: ${err.message}`);
      })
    );
  }

  searchClients(query: string): Observable<Client[]> {
    return this.http.get<any>(`${environment.baseUrl}/clients/search/${encodeURIComponent(query)}`).pipe(
      map(response => response.data.map((json: any) => ({
        id: json._id,
        name: json.name,
        email: json.email,
        homeAddress: json.homeAddress,
        image: json.image,
        phoneNumber: json.phoneNumber
      }))),
      catchError(err => throwError(`Search error: ${err.message}`))
    );
  }

  fetchDarkModePreference(userId: string): Observable<boolean> {
    return this.http.get<any>(`${environment.baseUrl}/clients/${userId}/dark-mode`).pipe(
      map(response => response.darkMode ?? false),
      catchError(err => throwError('Failed to fetch dark mode preference'))
    );
  }

  updateDarkModePreference(userId: string, isDarkMode: boolean): Observable<void> {
    return this.http.put(`${environment.baseUrl}/clients/${userId}/dark-mode`, { darkMode: isDarkMode }, { headers: { 'Content-Type': 'application/json' } }).pipe(
      map(() => {}),
      catchError(err => throwError('Failed to update dark mode preference'))
    );
  }
}