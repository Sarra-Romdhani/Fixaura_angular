import { Injectable } from '@angular/core';
import { io } from 'socket.io-client'; // Import correct de la fonction 'io'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Socket } from 'socket.io-client'; // Import du type 'Socket'

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private socket: Socket | null = null;

  startLocationUpdates(prestataireId: string, reservationId: string): Observable<{ latitude: number; longitude: number }> {
    return new Observable(observer => {
      this.socket = io(environment.baseUrl, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5
      });
  
      this.socket.on('connect', () => {
        console.log('Socket connected for location updates');
        this.socket!.emit('joinReservation', { reservationId, userId: prestataireId });
      });
  
      this.socket.on('connect_error', (err: any) => console.error('Connection error:', err));
      this.socket.on('error', (err: any) => console.error('Socket error:', err));
  
      this.socket.on('reservationCompleted', () => {
        this.stopLocationUpdates();
        console.log('Reservation completed, stopping location updates');
      });
  
      // Use navigator.geolocation for real location data
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
  
          this.socket!.emit('updateLocation', {
            prestataireId,
            reservationId,
            coordinates: { lat: locationData.latitude, lng: locationData.longitude }
          });
  
          observer.next(locationData);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to mock data if geolocation fails
          const locationData = {
            latitude: 36.8065,
            longitude: 10.1815
          };
          this.socket!.emit('updateLocation', {
            prestataireId,
            reservationId,
            coordinates: { lat: locationData.latitude, lng: locationData.longitude }
          });
          observer.next(locationData);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
  
      return () => {
        navigator.geolocation.clearWatch(watchId);
        this.stopLocationUpdates();
      };
    });
  }

  stopLocationUpdates(): void {
    this.socket?.emit('leaveReservation');
    this.socket?.disconnect();
    this.socket = null;
    console.log('Location updates stopped');
  }
}
