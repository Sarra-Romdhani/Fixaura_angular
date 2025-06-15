
// import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { CommonModule } from '@angular/common';
// import { Observable, of } from 'rxjs';
// import { map, catchError, retry } from 'rxjs/operators';
// import { SocketService } from '../../services/socket.service';
// import { ReservationService } from '../../services/reservation.service';
// import { Reservation } from '../../classes/reservation.model';
// import Map from 'ol/Map';
// import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import OSM from 'ol/source/OSM';
// import Feature from 'ol/Feature';
// import Point from 'ol/geom/Point';
// import LineString from 'ol/geom/LineString';
// import { Icon, Style, Stroke } from 'ol/style';
// import { fromLonLat } from 'ol/proj';

// interface NominatimResponse {
//   lat: string;
//   lon: string;
// }

// @Component({
//   selector: 'app-map',
//   standalone: true,
//   imports: [CommonModule, MatToolbarModule, MatProgressSpinnerModule],
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.css'],
// })
// export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
//   userId: string;
//   reservationId: string;
//   receiverId: string;
//   initialLocation: number[] = [10.1815, 36.8065]; // [lon, lat]
//   destination: number[] = [10.1815, 36.8065]; // [lon, lat]
//   map: Map | null = null;
//   vectorLayer: VectorLayer<VectorSource> | null = null;
//   vectorSource: VectorSource | null = null;
//   routePoints: number[][] = [];
//   eta: string = 'Calculating...';
//   isLoading: boolean = true;
//   isMapReady: boolean = false;
//   reservation: Reservation | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private socketService: SocketService,
//     private http: HttpClient,
//     private reservationService: ReservationService
//   ) {
//     this.userId = this.route.snapshot.paramMap.get('userId') || '';
//     this.reservationId = this.route.snapshot.paramMap.get('reservationId') || '';
//     this.receiverId = this.route.snapshot.queryParamMap.get('receiverId') || '';
//     const lat = parseFloat(this.route.snapshot.queryParamMap.get('lat') || '36.8065');
//     const lng = parseFloat(this.route.snapshot.queryParamMap.get('lng') || '10.1815');
//     this.initialLocation = [lng, lat];
//     this.destination = [10.1815, 36.8065]; // Default Tunis
//     console.log('MapComponent init:', {
//       userId: this.userId,
//       reservationId: this.reservationId,
//       receiverId: this.receiverId,
//       initialLocation: this.initialLocation,
//     });
//   }

//   ngOnInit(): void {
//     if (!this.userId || !this.reservationId) {
//       console.error('Invalid userId or reservationId');
//       this.router.navigate(['/login']);
//       return;
//     }
//     this.fetchReservation();
//     this.setupSocket();
//   }

//   ngAfterViewInit(): void {
//     this.initializeMap();
//   }

//   private fetchReservation(): void {
//     this.reservationService.getReservationById(this.reservationId).subscribe({
//       next: (reservation) => {
//         this.reservation = reservation;
//         console.log('Reservation fetched:', reservation);
//         this.geocodeAddress(reservation.location).subscribe({
//           next: (coords) => {
//             if (coords) {
//               this.destination = [coords.lng, coords.lat];
//               console.log('Destination set:', this.destination);
//             } else {
//               console.warn('Geocoding failed, using default destination');
//               this.destination = [10.1904, 36.8601]; // Fallback to Ariana, Tunisia
//             }
//             this.fetchRoute();
//             this.updateMarkers();
//             this.adjustMapView();
//           },
//           error: (err) => {
//             console.error('Geocoding error:', err);
//             this.destination = [10.1904, 36.8601]; // Fallback to Ariana, Tunisia
//             this.fetchRoute();
//             this.updateMarkers();
//             this.adjustMapView();
//           },
//         });
//       },
//       error: (err) => {
//         console.error('Error fetching reservation:', err);
//         this.fetchRoute();
//         this.updateMarkers();
//         this.adjustMapView();
//       },
//     });
//   }

//   private geocodeAddress(address: string): Observable<{ lat: number; lng: number } | null> {
//     const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//       address
//     )}&format=json&limit=1&addressdetails=1&countrycodes=TN`;
//     return this.http.get<NominatimResponse[]>(url).pipe(
//       retry(2),
//       map((data) => {
//         console.log('Geocoding response:', data);
//         if (data.length > 0) {
//           const lat = parseFloat(data[0].lat);
//           const lng = parseFloat(data[0].lon);
//           if (isNaN(lat) || isNaN(lng)) {
//             console.warn('Invalid coordinates in geocoding response:', data[0]);
//             return null;
//           }
//           return { lat, lng };
//         }
//         return null;
//       }),
//       catchError((err) => {
//         console.error('Geocoding request failed:', err);
//         return of(null);
//       })
//     );
//   }

//   private initializeMap(): void {
//     try {
//       this.vectorSource = new VectorSource();
//       this.vectorLayer = new VectorLayer({
//         source: this.vectorSource,
//       });

//       this.map = new Map({
//         target: 'map',
//         layers: [
//           new TileLayer({
//             source: new OSM({
//               attributions: [], // Remove OSM attribution
//             }),
//           }),
//           this.vectorLayer,
//         ],
//         view: new View({
//           center: fromLonLat(this.initialLocation),
//           zoom: 15,
//         }),
//       });

//       console.log('Map initialized');
//       this.isMapReady = true;
//       this.isLoading = false;
//       this.updateMarkers();
//       setTimeout(() => {
//         this.map?.updateSize();
//         console.log('Map size updated');
//       }, 1500);
//       window.addEventListener('resize', () => {
//         this.map?.updateSize();
//       });
//     } catch (error) {
//       console.error('Error initializing map:', error);
//       this.isLoading = false;
//     }
//   }

//   private updateMarkers(): void {
//     try {
//       if (!this.vectorSource) return;

//       this.vectorSource.clear();

//       // Validate coordinates
//       if (isNaN(this.initialLocation[0]) || isNaN(this.initialLocation[1])) {
//         console.warn('Invalid initialLocation:', this.initialLocation);
//         return;
//       }
//       if (isNaN(this.destination[0]) || isNaN(this.destination[1])) {
//         console.warn('Invalid destination:', this.destination);
//         return;
//       }

//       // Current location marker (X icon)
//       const currentLocationFeature = new Feature({
//         geometry: new Point(fromLonLat(this.initialLocation)),
//         name: 'Current Location',
//       });
//       currentLocationFeature.setStyle(
//         new Style({
//           image: new Icon({
//             src: 'https://img.icons8.com/fluency/48/x.png', // X icon for current location
//             scale: 0.8,
//             anchor: [0.5, 1],
//           }),
//         })
//       );
//       this.vectorSource.addFeature(currentLocationFeature);

//       // Destination marker (Flag icon)
//       const destinationFeature = new Feature({
//         geometry: new Point(fromLonLat(this.destination)),
//         name: 'Destination',
//       });
//       destinationFeature.setStyle(
//         new Style({
//           image: new Icon({
//             src: 'https://img.icons8.com/fluency/48/flag.png', // Flag icon for destination
//             scale: 0.8,
//             anchor: [0.5, 1],
//           }),
//         })
//       );
//       this.vectorSource.addFeature(destinationFeature);

//       console.log('Markers updated');
//     } catch (error) {
//       console.error('Error updating markers:', error);
//     }
//   }

//   private fetchRoute(): void {
//     const url = `http://router.project-osrm.org/route/v1/driving/${
//       this.initialLocation[0]
//     },${this.initialLocation[1]};${this.destination[0]},${
//       this.destination[1]
//     }?overview=full&geometries=geojson`;
//     this.http.get(url).subscribe({
//       next: (data: any) => {
//         const coordinates = data.routes[0].geometry.coordinates;
//         const durationSeconds = data.routes[0].duration;
//         const minutes = Math.round(durationSeconds / 60);

//         this.routePoints = coordinates.map((coord: [number, number]) => [coord[0], coord[1]]);
//         this.eta = minutes < 1 ? '< 1 min' : `~${minutes} min`;

//         if (this.vectorSource) {
//           this.vectorSource.clear(true); // Clear only route features
//           const routeFeature = new Feature({
//             geometry: new LineString(this.routePoints.map((coord) => fromLonLat(coord))),
//           });
//           routeFeature.setStyle(
//             new Style({
//               stroke: new Stroke({
//                 color: '#0288D1',
//                 width: 4,
//               }),
//             })
//           );
//           this.vectorSource.addFeature(routeFeature);
//         }

//         this.isLoading = false;
//         this.adjustMapView();
//         console.log('Route fetched:', { eta: this.eta, routePoints: this.routePoints });
//       },
//       error: (err) => {
//         console.error('Error fetching route:', err);
//         this.eta = 'ETA unavailable';
//         this.routePoints = [this.initialLocation, this.destination];
//         if (this.vectorSource) {
//           const routeFeature = new Feature({
//             geometry: new LineString(this.routePoints.map((coord) => fromLonLat(coord))),
//           });
//           routeFeature.setStyle(
//             new Style({
//               stroke: new Stroke({
//                 color: '#0288D1',
//                 width: 4,
//               }),
//             })
//           );
//           this.vectorSource.addFeature(routeFeature);
//         }
//         this.isLoading = false;
//         this.adjustMapView();
//       },
//     });
//   }

//   private adjustMapView(): void {
//     if (!this.map || !this.isMapReady || !this.vectorSource) {
//       console.log('Map not ready for reservationId:', this.reservationId);
//       return;
//     }
//     try {
//       const extent = this.vectorSource.getExtent();
//       this.map.getView().fit(extent, {
//         padding: [50, 50, 50, 50],
//         maxZoom: 16,
//       });
//       console.log('Map zoomed to:', { initialLocation: this.initialLocation, destination: this.destination });
//     } catch (error) {
//       console.error('Map adjustment error:', error);
//       this.map.getView().setCenter(fromLonLat(this.initialLocation));
//       this.map.getView().setZoom(15);
//     }
//   }

//   private setupSocket(): void {
//     this.socketService.connect(this.userId);
//     this.socketService.joinReservation(this.reservationId, this.userId);
//     this.socketService.on('connect', () => {
//       console.log('Socket connected for user:', this.userId);
//     });
//     this.socketService.on('disconnect', () => {
//       console.log('Socket disconnected');
//     });
//     this.socketService.on(`locationUpdate-${this.reservationId}`, (data: any) => {
//       console.log('Socket locationUpdate received:', data);
//       if (data.coordinates?.lat && data.coordinates?.lng) {
//         this.initialLocation = [data.coordinates.lng, data.coordinates.lat];
//         this.updateMarkers();
//         this.fetchRoute();
//         this.adjustMapView();
//       } else {
//         console.warn('Invalid location update data:', data);
//       }
//     });
//     this.socketService.on('startTracking', (data: any) => {
//       console.log('Socket startTracking received:', data);
//       if (data.reservationId === this.reservationId && data.initialLocation?.lat && data.initialLocation?.lng) {
//         this.initialLocation = [data.initialLocation.lng, data.initialLocation.lat];
//         this.updateMarkers();
//         this.fetchRoute();
//         this.adjustMapView();
//       }
//     });
//   }

//   goBack(): void {
//     console.log('Navigating back to messages:', { userId: this.userId, receiverId: this.receiverId });
//     if (this.receiverId) {
//       this.router.navigate([`/messages/discussion/${this.userId}/${this.receiverId}`]);
//     } else {
//       this.router.navigate([`/messages/${this.userId}`]);
//     }
//   }

//   ngOnDestroy(): void {
//     this.socketService.disconnect();
//     this.map?.setTarget(undefined);
//     window.removeEventListener('resize', () => {
//       this.map?.updateSize();
//     });
//     console.log('MapComponent destroyed');
//   }
// }

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { SocketService } from '../../services/socket.service';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../classes/reservation.model';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Icon, Style, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';

interface NominatimResponse {
  lat: string;
  lon: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatProgressSpinnerModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  userId: string;
  reservationId: string;
  receiverId: string;
  initialLocation: number[] = [10.1815, 36.8065]; // [lon, lat]
  destination: number[] = [10.1815, 36.8065]; // [lon, lat]
  map: Map | null = null;
  vectorLayer: VectorLayer<VectorSource> | null = null;
  vectorSource: VectorSource | null = null;
  routePoints: number[][] = [];
  eta: string = 'Calculating...';
  isLoading: boolean = true;
  isMapReady: boolean = false;
  reservation: Reservation | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketService,
    private http: HttpClient,
    private reservationService: ReservationService
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.reservationId = this.route.snapshot.paramMap.get('reservationId') || '';
    this.receiverId = this.route.snapshot.queryParamMap.get('receiverId') || '';
    const lat = parseFloat(this.route.snapshot.queryParamMap.get('lat') || '36.8065');
    const lng = parseFloat(this.route.snapshot.queryParamMap.get('lng') || '10.1815');
    this.initialLocation = [lng, lat];
    this.destination = [10.1815, 36.8065]; // Default Tunis
    console.log('MapComponent init:', {
      userId: this.userId,
      reservationId: this.reservationId,
      receiverId: this.receiverId,
      initialLocation: this.initialLocation,
    });
  }

  ngOnInit(): void {
    if (!this.userId || !this.reservationId) {
      console.error('Invalid userId or reservationId');
      this.router.navigate(['/login']);
      return;
    }
    this.fetchReservation();
    this.setupSocket();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private fetchReservation(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        console.log('Reservation fetched:', reservation);
        this.geocodeAddress(reservation.location).subscribe({
          next: (coords) => {
            if (coords) {
              this.destination = [coords.lng, coords.lat];
              console.log('Destination set:', this.destination);
            } else {
              console.warn('Geocoding failed, using default destination');
              this.destination = [10.1904, 36.8601]; // Fallback to Ariana, Tunisia
            }
            this.fetchRoute();
            this.updateMarkers();
            this.adjustMapView();
          },
          error: (err) => {
            console.error('Geocoding error:', err);
            this.destination = [10.1904, 36.8601]; // Fallback to Ariana, Tunisia
            this.fetchRoute();
            this.updateMarkers();
            this.adjustMapView();
          },
        });
      },
      error: (err) => {
        console.error('Error fetching reservation:', err);
        this.fetchRoute();
        this.updateMarkers();
        this.adjustMapView();
      },
    });
  }

  private geocodeAddress(address: string): Observable<{ lat: number; lng: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1&addressdetails=1&countrycodes=TN`;
    return this.http.get<NominatimResponse[]>(url).pipe(
      retry(2),
      map((data) => {
        console.log('Geocoding response:', data);
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          if (isNaN(lat) || isNaN(lng)) {
            console.warn('Invalid coordinates in geocoding response:', data[0]);
            return null;
          }
          return { lat, lng };
        }
        return null;
      }),
      catchError((err) => {
        console.error('Geocoding request failed:', err);
        return of(null);
      })
    );
  }

  private initializeMap(): void {
    try {
      this.vectorSource = new VectorSource();
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
      });

      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM({
              attributions: [], // Remove OSM attribution
            }),
      }),
          this.vectorLayer,
        ],
        view: new View({
          center: fromLonLat(this.initialLocation),
          zoom: 15,
        }),
      });

      console.log('Map initialized');
      this.isMapReady = true;
      this.isLoading = false;
      this.updateMarkers();
      setTimeout(() => {
        this.map?.updateSize();
        console.log('Map size updated');
      }, 1500);
      window.addEventListener('resize', () => {
        this.map?.updateSize();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      this.isLoading = false;
    }
  }

  // private updateMarkers(): void {
  //   try {
  //     if (!this.vectorSource) return;

  //     this.vectorSource.clear();

  //     // Validate coordinates
  //     if (isNaN(this.initialLocation[0]) || isNaN(this.initialLocation[1])) {
  //       console.warn('Invalid initialLocation:', this.initialLocation);
  //       return;
  //     }
  //     if (isNaN(this.destination[0]) || isNaN(this.destination[1])) {
  //       console.warn('Invalid destination:', this.destination);
  //       return;
  //     }

  //     // Current location marker (Bootstrap geo-alt-fill icon, red)
  //     const currentLocationFeature = new Feature({
  //       geometry: new Point(fromLonLat(this.initialLocation)),
  //       name: 'Current Location',
  //     });
  //     currentLocationFeature.setStyle(
  //       new Style({
  //         image: new Icon({
  //           src: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt-fill.svg',
  //           scale: 1.5, // Increased for better visibility
  //           anchor: [0.5, 1],
  //           color: '#FF0000', // Red for current location
  //         }),
  //       })
  //     );
  //     this.vectorSource.addFeature(currentLocationFeature);

  //     // Destination marker (Bootstrap flag-fill icon, green)
  //     const destinationFeature = new Feature({
  //       geometry: new Point(fromLonLat(this.destination)),
  //       name: 'Destination',
  //     });
  //     destinationFeature.setStyle(
  //       new Style({
  //         image: new Icon({
  //           src: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/flag-fill.svg',
  //           scale: 1.5, // Increased for better visibility
  //           anchor: [0.5, 1],
  //           color: '#008000', // Green for destination
  //         }),
  //       })
  //     );
  //     this.vectorSource.addFeature(destinationFeature);

  //     console.log('Markers updated');
  //   } catch (error) {
  //     console.error('Error updating markers:', error);
  //   }
  // }

  // private fetchRoute(): void {
  //   const url = `http://router.project-osrm.org/route/v1/driving/${
  //     this.initialLocation[0]
  //   },${this.initialLocation[1]};${this.destination[0]},${
  //     this.destination[1]
  //   }?overview=full&geometries=geojson`;
  //   this.http.get(url).subscribe({
  //     next: (data: any) => {
  //       const coordinates = data.routes[0].geometry.coordinates;
  //       const durationSeconds = data.routes[0].duration;
  //       const minutes = Math.round(durationSeconds / 60);

  //       this.routePoints = coordinates.map((coord: [number, number]) => [coord[0], coord[1]]);
  //       this.eta = minutes < 1 ? '< 1 min' : `~${minutes} min`;

  //       if (this.vectorSource) {
  //         this.vectorSource.clear(true); // Clear only route features
  //         const routeFeature = new Feature({
  //           geometry: new LineString(this.routePoints.map((coord) => fromLonLat(coord))),
  //         });
  //         routeFeature.setStyle(
  //           new Style({
  //             stroke: new Stroke({
  //               color: '#0288D1',
  //               width: 4,
  //             }),
  //           })
  //         );
  //         this.vectorSource.addFeature(routeFeature);
  //       }

  //       this.isLoading = false;
  //       this.adjustMapView();
  //       console.log('Route fetched:', { eta: this.eta, routePoints: this.routePoints });
  //     },
  //     error: (err) => {
  //       console.error('Error fetching route:', err);
  //       this.eta = 'ETA unavailable';
  //       this.routePoints = [this.initialLocation, this.destination];
  //       if (this.vectorSource) {
  //         const routeFeature = new Feature({
  //           geometry: new LineString(this.routePoints.map((coord) => fromLonLat(coord))),
  //         });
  //         routeFeature.setStyle(
  //           new Style({
  //             stroke: new Stroke({
  //               color: '#0288D1',
  //               width: 4,
  //             }),
  //           })
  //         );
  //         this.vectorSource.addFeature(routeFeature);
  //       }
  //       this.isLoading = false;
  //       this.adjustMapView();
  //     },
  //   });
  // }
 private updateMarkers(): void {
  try {
    if (!this.vectorSource) return;

    // Validate coordinates
    if (isNaN(this.initialLocation[0]) || isNaN(this.initialLocation[1])) {
      console.warn('Invalid initialLocation:', this.initialLocation);
      return;
    }
    if (isNaN(this.destination[0]) || isNaN(this.destination[1])) {
      console.warn('Invalid destination:', this.destination);
      return;
    }

    // Check existing features
    const features = this.vectorSource.getFeatures();
    const currentLocationFeature = features.find((f) => f.get('name') === 'Current Location');
    const destinationFeature = features.find((f) => f.get('name') === 'Destination');

    // Update or add current location marker
    if (currentLocationFeature) {
      currentLocationFeature.setGeometry(new Point(fromLonLat(this.initialLocation)));
    } else {
      const newCurrentLocationFeature = new Feature({
        geometry: new Point(fromLonLat(this.initialLocation)),
        name: 'Current Location',
      });
      newCurrentLocationFeature.setStyle(
        new Style({
          image: new Icon({
            src: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt-fill.svg',
            scale: 1.5,
            anchor: [0.5, 1],
            color: '#FFC107', // Amber for current location
          }),
        })
      );
      this.vectorSource.addFeature(newCurrentLocationFeature);
    }

    // Update or add destination marker
    if (destinationFeature) {
      destinationFeature.setGeometry(new Point(fromLonLat(this.destination)));
    } else {
      const newDestinationFeature = new Feature({
        geometry: new Point(fromLonLat(this.destination)),
        name: 'Destination',
      });
      newDestinationFeature.setStyle(
        new Style({
          image: new Icon({
            src: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/flag-fill.svg',
            scale: 1.5,
            anchor: [0.5, 1],
            color: '#FFC107', // Amber for destination
          }),
        })
      );
      this.vectorSource.addFeature(newDestinationFeature);
    }

    console.log('Markers updated:', {
      currentLocation: this.initialLocation,
      destination: this.destination,
    });
  } catch (error) {
    console.error('Error updating markers:', error);
  }
}
private fetchRoute(): void {
  const url = `http://router.project-osrm.org/route/v1/driving/${
    this.initialLocation[0]
  },${this.initialLocation[1]};${this.destination[0]},${
    this.destination[1]
  }?overview=full&geometries=geojson`;
  this.http.get(url).subscribe({
    next: (data: any) => {
      const coordinates = data.routes[0].geometry.coordinates;
      const durationSeconds = data.routes[0].duration;
      const minutes = Math.round(durationSeconds / 60);

      this.routePoints = coordinates.map((coord: [number, number]) => [coord[0], coord[1]]);
      this.eta = minutes < 1 ? '< 1 min' : `~${minutes} min`;

      if (this.vectorSource) {
        // Remove existing route feature only
        const features = this.vectorSource.getFeatures();
        features.forEach((feature) => {
          if (feature.get('name') === 'Route') {
            this.vectorSource?.removeFeature(feature);
          }
        });

        // Add new route feature
        const routeFeature = new Feature({
          geometry: new LineString(this.routePoints.map((coord) => fromLonLat(coord))),
          name: 'Route', // Identify route for future removal
        });
        routeFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: '#0288D1', // Blue route line
              width: 4,
            }),
          })
        );
        this.vectorSource.addFeature(routeFeature);

        // Ensure both markers are present
        this.updateMarkers();
      }

      this.isLoading = false;
      this.adjustMapView();
      console.log('Route fetched:', { eta: this.eta, routePoints: this.routePoints });
    },
    error: (err) => {
      console.error('Error fetching route:', err);
      this.eta = 'ETA unavailable';
      this.routePoints = [this.initialLocation, this.destination];
      if (this.vectorSource) {
        // Remove existing route feature only
        const features = this.vectorSource.getFeatures();
        features.forEach((feature) => {
          if (feature.get('name') === 'Route') {
            this.vectorSource?.removeFeature(feature);
          }
        });

        // Add fallback route feature
        const routeFeature = new Feature({
          geometry: new LineString(this.routePoints.map((coord) => fromLonLat(coord))),
          name: 'Route',
        });
        routeFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: '#0288D1',
              width: 4,
            }),
          })
        );
        this.vectorSource.addFeature(routeFeature);

        // Ensure both markers are present
        this.updateMarkers();
      }
      this.isLoading = false;
      this.adjustMapView();
    },
  });
}
  private adjustMapView(): void {
    if (!this.map || !this.isMapReady || !this.vectorSource) {
      console.log('Map not ready for reservationId:', this.reservationId);
      return;
    }
    try {
      const extent = this.vectorSource.getExtent();
      this.map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 16,
      });
      console.log('Map zoomed to:', { initialLocation: this.initialLocation, destination: this.destination });
    } catch (error) {
      console.error('Map adjustment error:', error);
      this.map.getView().setCenter(fromLonLat(this.initialLocation));
      this.map.getView().setZoom(15);
    }
  }

  private setupSocket(): void {
    this.socketService.connect(this.userId);
    this.socketService.joinReservation(this.reservationId, this.userId);
    this.socketService.on('connect', () => {
      console.log('Socket connected for user:', this.userId);
    });
    this.socketService.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    this.socketService.on(`locationUpdate-${this.reservationId}`, (data: any) => {
      console.log('Socket locationUpdate received:', data);
      if (data.coordinates?.lat && data.coordinates?.lng) {
        this.initialLocation = [data.coordinates.lng, data.coordinates.lat];
        this.updateMarkers();
        this.fetchRoute();
        this.adjustMapView();
      } else {
        console.warn('Invalid location update data:', data);
      }
    });
    this.socketService.on('startTracking', (data: any) => {
      console.log('Socket startTracking received:', data);
      if (data.reservationId === this.reservationId && data.initialLocation?.lat && data.initialLocation?.lng) {
        this.initialLocation = [data.initialLocation.lng, data.initialLocation.lat];
        this.updateMarkers();
        this.fetchRoute();
        this.adjustMapView();
      }
    });
  }

  // goBack(): void {
  //   console.log('Navigating back to messages:', { userId: this.userId, receiverId: this.receiverId });
  //   if (this.receiverId) {
  //     this.router.navigate([`/messages/discussion/${this.userId}/${this.receiverId}`]);
  //   } else {
  //     this.router.navigate([`/messages/${this.userId}`]);
  //   }
  // }
goBack(): void {
  console.log('Navigating back to messages:', { userId: this.userId, receiverId: this.receiverId });
  const userName = this.route.snapshot.queryParamMap.get('userName') || 'Unknown User';
  const userImage = this.route.snapshot.queryParamMap.get('userImage') || 'https://via.placeholder.com/40';
  if (this.receiverId) {
    this.router.navigate([`/messages/discussion/${this.userId}/${this.receiverId}`], {
      queryParams: {
        userName,
        userImage
      }
    });
  } else {
    this.router.navigate([`/messages/${this.userId}`]);
  }
}

  ngOnDestroy(): void {
    this.socketService.disconnect();
    this.map?.setTarget(undefined);
    window.removeEventListener('resize', () => {
      this.map?.updateSize();
    });
    console.log('MapComponent destroyed');
  }
}