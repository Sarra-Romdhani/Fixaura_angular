import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, mergeMap, retry } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface ApiUserResponse {
  _id?: string;
  id?: string;
  name?: string;
  image?: string | null;
  photo?: string | null;
  fullName?: string;
  profilePicture?: string;
  job?: string;
  success?: boolean;
  data?: any;
}

interface User {
  id: string;
  name: string;
  photo?: string | null;
  type: 'client' | 'prestataire' | 'unknown';
  job?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUser(userId: string): Observable<User> {
    const headers = {
      'Content-Type': 'application/json',
    };

    const defaultUser: User = {
      id: userId,
      name: 'Utilisateur inconnu',
      photo: null,
      type: 'unknown',
      job: undefined
    };

    // Step 1: Try to fetch from clients
    return this.http.get<ApiUserResponse>(`${this.baseUrl}/clients/${userId}`, { headers }).pipe(
      retry(2),
      mergeMap((response: ApiUserResponse) => {
        const data = response?.success === true && response?.data ? response.data : response;

        if (data?._id || data?.id) {
          return of({
            id: (data._id || data.id || userId).toString(),
            name: data.name || data.fullName || 'Utilisateur inconnu',
            photo: data.image || data.photo || data.profilePicture || null,
            type: 'client' as const,
            job: undefined
          });
        }

        // Step 2: Not found in clients, try prestataires
        return this.http.get<ApiUserResponse>(`${this.baseUrl}/prestataires/${userId}`, { headers }).pipe(
          retry(2),
          mergeMap((response: ApiUserResponse) => {
            const data = response?.success === true && response?.data ? response.data : response;

            if (data?._id || data?.id) {
              return of({
                id: (data._id || data.id || userId).toString(),
                name: data.name || data.fullName || 'Utilisateur inconnu',
                photo: data.image || data.photo || data.profilePicture || null,
                type: 'prestataire' as const,
                job: data.job || 'Prestataire'
              });
            }

            return of(defaultUser);
          }),
          catchError((error) => {
            console.error(`Erreur lors de la récupération du prestataire ${userId}:`, error);
            return of(defaultUser);
          })
        );
      }),
      catchError((error) => {
        console.error(`Erreur lors de la récupération du client ${userId}:`, error);
        // If client request fails, still try prestataire
        return this.http.get<ApiUserResponse>(`${this.baseUrl}/prestataires/${userId}`, { headers }).pipe(
          retry(2),
          mergeMap((response: ApiUserResponse) => {
            const data = response?.success === true && response?.data ? response.data : response;

            if (data?._id || data?.id) {
              return of({
                id: (data._id || data.id || userId).toString(),
                name: data.name || data.fullName || 'Utilisateur inconnu',
                photo: data.image || data.photo || data.profilePicture || null,
                type: 'prestataire' as const,
                job: data.job || 'Prestataire'
              });
            }

            return of(defaultUser);
          }),
          catchError((error) => {
            console.error(`Erreur lors de la récupération du prestataire (fallback) ${userId}:`, error);
            return of(defaultUser);
          })
        );
      })
    );
  }

  getUsersByIds(userIds: string[]): Observable<User[]> {
    if (!userIds || userIds.length === 0) {
      return of([]);
    }
    const uniqueIds = [...new Set(userIds)];
    const requests = uniqueIds.map(id => this.getUser(id));
    return forkJoin(requests);
  }
}
