import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { Appliance } from '../classes/appliance.model';

@Injectable({
  providedIn: 'root'
})
export class ApplianceService {
  private baseUrl = 'http://localhost:3000'; // Replace with your API URL
  private errorMessageSubject = new BehaviorSubject<string>('');
  private probabilitySubject = new BehaviorSubject<number>(0);
  private remainingLifespanSubject = new BehaviorSubject<number>(0);
  private statusSubject = new BehaviorSubject<string>('Inconnu');
  private analysisSubject = new BehaviorSubject<string>('');
  private predictedBreakdownDateSubject = new BehaviorSubject<string>('Inconnu');
  private predictionResultSubject = new BehaviorSubject<string>('');
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  errorMessage$ = this.errorMessageSubject.asObservable();
  probability$ = this.probabilitySubject.asObservable();
  remainingLifespan$ = this.remainingLifespanSubject.asObservable();
  status$ = this.statusSubject.asObservable();
  analysis$ = this.analysisSubject.asObservable();
  predictedBreakdownDate$ = this.predictedBreakdownDateSubject.asObservable();
  predictionResult$ = this.predictionResultSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  predictBreakdown(appliance: Appliance): Observable<boolean> {
    this.isLoadingSubject.next(true);
    this.errorMessageSubject.next('');

    if (!appliance.brand || !appliance.modele) {
      this.errorMessageSubject.next('Marque et modèle sont obligatoires');
      this.isLoadingSubject.next(false);
      return throwError(() => new Error('Marque et modèle sont obligatoires'));
    }

    const requestBody = {
      brand: appliance.brand,
      model: appliance.modele,
      purchaseDate: appliance.purchaseDate,
      usageFrequency: appliance.usageFrequency,
      hasBrokenDown: appliance.hasBrokenDown,
      breakdownCount: appliance.breakdownDetails?.split(/,|;/).length || 0
    };

    return this.http.post<any>(`${this.baseUrl}/predict`, requestBody).pipe(
      timeout(15000),
      tap(result => {
        this.validateResponse(result);
        this.probabilitySubject.next(result.probability);
        this.remainingLifespanSubject.next(result.remainingLifespan);
        this.statusSubject.next(result.status);
        this.analysisSubject.next(result.analysis);
        this.predictedBreakdownDateSubject.next(result.predictedBreakdownDate);
        this.predictionResultSubject.next(this.generatePredictionText(result.probability));
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getAppliances(userId: string): Observable<Appliance[]> {
    return this.http.get<{ data: Appliance[] }>(`${this.baseUrl}/appliances/user/${userId}`).pipe(
      map(response => response.data),
      tap(() => this.isLoadingSubject.next(false)),
      catchError(this.handleError.bind(this))
    );
  }

  getApplianceHistory(applianceId: string): Observable<any[]> {
    return this.http.get<{ data: any[] }>(`${this.baseUrl}/appliances/${applianceId}/history`).pipe(
      map(response => response.data),
      tap(() => this.isLoadingSubject.next(false)),
      catchError(this.handleError.bind(this))
    );
  }

  addAppliance(appliance: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/appliances`, appliance).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateAppliance(id: string, appliance: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/appliances/${id}`, appliance).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteAppliance(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/appliances/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private validateResponse(result: any): void {
    const requiredKeys = ['probability', 'remainingLifespan', 'status', 'analysis', 'predictedBreakdownDate'];
    for (const key of requiredKeys) {
      if (!result.hasOwnProperty(key)) {
        throw new Error(`Réponse serveur incomplète: clé "${key}" manquante`);
      }
    }
    if (typeof result.probability !== 'number' || result.probability < 0 || result.probability > 1) {
      throw new Error(`Valeur de probabilité invalide: ${result.probability}`);
    }
  }

  private generatePredictionText(probability: number): string {
    const percent = (probability * 100).toFixed(1);
    const riskLevel = probability >= 0.7 ? 'ÉLEVÉE' : probability >= 0.4 ? 'MODÉRÉE' : 'FAIBLE';
    return `Risque de panne : ${percent}%\nNiveau de risque : ${riskLevel}`;
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Erreur inconnue';
    if (error instanceof HttpErrorResponse) {
      errorMessage = `Erreur serveur (${error.status}): ${error.message}`;
    } else if (error.name === 'TimeoutError') {
      errorMessage = 'Temps d\'attente dépassé';
    } else {
      errorMessage = `Erreur: ${error.message || error}`;
    }
    this.errorMessageSubject.next(errorMessage);
    this.isLoadingSubject.next(false);
    return throwError(() => new Error(errorMessage));
  }
}