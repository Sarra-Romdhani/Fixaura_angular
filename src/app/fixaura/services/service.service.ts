// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { Service } from '../classes/service.model';
// import { environment } from '../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class ServiceService {
//   private readonly apiUrl = `${environment.baseUrl}/services`;

//   constructor(private http: HttpClient) {}

//   getServicesByPrestataire(prestataireId: string): Observable<Service[]> {
//     const url = `${this.apiUrl}/getByPrestataire/${prestataireId}`;
//     console.log('Requesting URL:', url);
//     return this.http.get<any>(url).pipe(
//       map(response => {
//         console.log('Status Code:', response.status);
//         console.log('Raw Response:', response);
//         if (response.success !== true) {
//           throw new Error(`API error: ${response.message}`);
//         }
//         const servicesList = response.data as any[];
//         if (!servicesList || servicesList.length === 0) {
//           console.log('No services found in response data');
//           return [];
//         }
//         const services = servicesList.map(service => ({
//           id: service._id?.toString(),
//           title: service.title || '',
//           description: service.description || '',
//           price: typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0,
//           estimatedDuration: typeof service.estimatedDuration === 'string' 
//             ? parseInt(service.estimatedDuration, 10) || 0 
//             : service.estimatedDuration || 0,
//           prestataireId: service.prestataireId || '',
//           photo: service.photo,
//           createdAt: service.createdAt
//         }));
//         console.log(`Mapped ${services.length} services`);
//         return services;
//       }),
//       catchError(error => {
//         console.error('Error in getServicesByPrestataire:', error);
//         return throwError(() => new Error(`Failed to load services: ${error.message}`));
//       })
//     );
//   }

//   createService(service: Service): Observable<void> {
//     if (!service.image) {
//       return throwError(() => new Error('Image is required'));
//     }
//     const formData = new FormData();
//     Object.entries(service).forEach(([key, value]) => {
//       if (key !== 'image' && value != null) {
//         formData.append(key, value.toString());
//       }
//     });
//     formData.append('image', service.image);
//     console.log('Sending image file:', service.image.name);
//     return this.http.post(`${this.apiUrl}/create`, formData, { observe: 'response' }).pipe(
//       map(response => {
//         if (response.status !== 201) {
//           throw new Error('Failed to create service');
//         }
//       }),
//       catchError(error => {
//         console.error('Error creating service:', error);
//         return throwError(() => new Error(`Error creating service: ${error.message}`));
//       })
//     );
//   }

//   deleteService(serviceId: string): Observable<void> {
//     return this.http.delete(`${this.apiUrl}/deleteService/${serviceId}`, { observe: 'response' }).pipe(
//       map(response => {
//         if (response.status !== 200) {
//           throw new Error(`Failed to delete service: ${response.status}`);
//         }
//       }),
//       catchError(error => {
//         console.error('Error deleting service:', error);
//         return throwError(() => new Error(`Error deleting service: ${error.message}`));
//       })
//     );
//   }

//   updateService(service: Service): Observable<void> {
//     const formData = new FormData();
//     Object.entries(service).forEach(([key, value]) => {
//       if (key !== 'image' && value != null) {
//         formData.append(key, value.toString());
//       }
//     });
//     if (service.image) {
//       formData.append('image', service.image);
//       console.log('Sending image file:', service.image.name);
//     }
//     return this.http.put(`${this.apiUrl}/updateService/${service.id}`, formData, { observe: 'response' }).pipe(
//       map(response => {
//         if (response.status !== 200) {
//           throw new Error('Failed to update service');
//         }
//       }),
//       catchError(error => {
//         console.error('Error updating service:', error);
//         return throwError(() => new Error(`Error updating service: ${error.message}`));
//       })
//     );
//   }
//    updateServiceWithFormData(formData: FormData): Observable<void> {
//     const serviceId = formData.get('id') as string;
//     return this.http.put(`${this.apiUrl}/updateService/${serviceId}`, formData, { observe: 'response' }).pipe(
//       map(response => {
//         if (response.status !== 200) {
//           throw new Error('Failed to update service');
//         }
//       }),
//       catchError(error => {
//         console.error('Error updating service:', error);
//         return throwError(() => new Error(`Error updating service: ${error.message}`));
//       })
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Service } from '../classes/service.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly apiUrl = `${environment.baseUrl}/services`;

  constructor(private http: HttpClient) {}

  getServicesByPrestataire(prestataireId: string): Observable<Service[]> {
    const url = `${this.apiUrl}/getByPrestataire/${prestataireId}`;
    console.log('Requesting URL:', url);
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Status Code:', response.status);
        console.log('Raw Response:', response);
        if (response.success !== true) {
          throw new Error(`API error: ${response.message}`);
        }
        const servicesList = response.data as any[];
        if (!servicesList || servicesList.length === 0) {
          console.log('No services found in response data');
          return [];
        }
        const services = servicesList.map(service => ({
          id: service._id?.toString(),
          title: service.title || '',
          description: service.description || '',
          price: typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0,
          estimatedDuration: typeof service.estimatedDuration === 'string' 
            ? parseInt(service.estimatedDuration, 10) || 0 
            : service.estimatedDuration || 0,
          prestataireId: service.prestataireId || '',
          photo: service.photo,
          createdAt: service.createdAt
        }));
        console.log(`Mapped ${services.length} services`);
        return services;
      }),
      catchError(error => {
        console.error('Error in getServicesByPrestataire:', error);
        return throwError(() => new Error(`Failed to load services: ${error.message}`));
      })
    );
  }

  createService(service: Service): Observable<void> {
    if (!service.image) {
      return throwError(() => new Error('Image is required'));
    }
    const formData = new FormData();
    Object.entries(service).forEach(([key, value]) => {
      if (key !== 'image' && value != null) {
        formData.append(key, value.toString());
      }
    });
    formData.append('image', service.image);
    console.log('Sending image file:', service.image.name);
    return this.http.post(`${this.apiUrl}/create`, formData, { observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 201) {
          throw new Error('Failed to create service');
        }
      }),
      catchError(error => {
        console.error('Error creating service:', error);
        return throwError(() => new Error(`Error creating service: ${error.message}`));
      })
    );
  }

  deleteService(serviceId: string): Observable<void> {
    return this.http.delete(`${this.apiUrl}/deleteService/${serviceId}`, { observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error(`Failed to delete service: ${response.status}`);
        }
      }),
      catchError(error => {
        console.error('Error deleting service:', error);
        return throwError(() => new Error(`Error deleting service: ${error.message}`));
      })
    );
  }

  updateService(service: Service): Observable<void> {
    const formData = new FormData();
    Object.entries(service).forEach(([key, value]) => {
      if (key !== 'image' && value != null) {
        formData.append(key, value.toString());
      }
    });
    if (service.image) {
      formData.append('image', service.image);
      console.log('Sending image file:', service.image.name);
    }
    return this.http.put(`${this.apiUrl}/updateService/${service.id}`, formData, { observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error('Failed to update service');
        }
      }),
      catchError(error => {
        console.error('Error updating service:', error);
        return throwError(() => new Error(`Error updating service: ${error.message}`));
      })
    );
  }

  updateServiceWithFormData(formData: FormData): Observable<void> {
    const serviceId = formData.get('id') as string;
    return this.http.put(`${this.apiUrl}/updateService/${serviceId}`, formData, { observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error('Failed to update service');
        }
      }),
      catchError(error => {
        console.error('Error updating service:', error);
        return throwError(() => new Error(`Error updating service: ${error.message}`));
      })
    );
  }
}