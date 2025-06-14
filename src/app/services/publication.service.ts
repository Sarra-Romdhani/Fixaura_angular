// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { Publication } from '../classes/publication.model';
// import { environment } from '../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class PublicationService {
//   private baseUrl: string = environment.baseUrl;

//   constructor(private http: HttpClient) {}

//   fetchPublications(providerId: string): Observable<Publication[]> {
//     return this.http.get<any>(`${this.baseUrl}/publications/prestataire/${providerId}`, {
//       headers: { 'Content-Type': 'application/json' }
//     }).pipe(
//       map((response: any) => (response.data ?? []).map((pub: any) => Publication.fromJson(pub))),
//       catchError(error => {
//         console.error('Error fetching publications:', error);
//         return throwError(() => new Error(`Failed to load publications: ${error.status}`));
//       })
//     );
//   }

//   createPublication(publication: Publication): Observable<any> {
//     const formData = new FormData();
//     formData.append('title', publication.title);
//     formData.append('description', publication.description);
//     formData.append('providerId', publication.providerId);
//     if (publication.image) {
//       formData.append('image', publication.image);
//     }

//     return this.http.post(`${this.baseUrl}/publications`, formData).pipe(
//       catchError(error => {
//         console.error('Error creating publication:', error);
//         return throwError(() => new Error(`Failed to create publication: ${error.message}`));
//       })
//     );
//   }

//   updatePublication(publicationId: string, title: string, description: string, providerId: string, imageFile: File | null): Observable<any> {
//     if (!publicationId.match(/^[0-9a-fA-F]{24}$/)) {
//       return throwError(() => new Error('Invalid publication ID'));
//     }

//     if (imageFile) {
//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('description', description);
//       formData.append('providerId', providerId);
//       formData.append('image', imageFile);

//       return this.http.put(`${this.baseUrl}/publications/${publicationId}`, formData).pipe(
//         catchError(error => {
//           console.error('Error updating publication:', error);
//           return throwError(() => new Error(`Failed to update publication: ${error.message}`));
//         })
//       );
//     } else {
//       return this.http.put(`${this.baseUrl}/publications/${publicationId}/text`, {
//         title,
//         description,
//         providerId
//       }, {
//         headers: { 'Content-Type': 'application/json' }
//       }).pipe(
//         catchError(error => {
//           console.error('Error updating publication:', error);
//           return throwError(() => new Error(`Failed to update publication: ${error.message}`));
//         })
//       );
//     }
//   }
  
// deletePublication(publicationId: string): Observable<void> {
//     // Validate publicationId format (24-character hexadecimal)
//     const isValidId = /^[0-9a-fA-F]{24}$/.test(publicationId);
//     if (!isValidId) {
//       console.error('Invalid publication ID:', publicationId);
//       return throwError(() => new Error('Invalid publication ID format'));
//     }

//     return this.http.delete<void>(`${this.baseUrl}/publications/${publicationId}`)
//       .pipe(
//         catchError(error => {
//           console.error('Error deleting publication:', error);
//           let errorMessage = `Failed to delete: ${error.status}`;
//           if (error.error?.message) {
//             errorMessage += `, ${error.error.message}`;
//           }
//           return throwError(() => new Error(errorMessage));
//         })
//       );
//   }

//   toggleLike(publicationId: string, userId: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/publications/${publicationId}/like`, { userId }, {
//       headers: { 'Content-Type': 'application/json' }
//     }).pipe(
//       catchError(error => {
//         console.error('Error toggling like:', error);
//         return throwError(() => new Error('Failed to toggle like'));
//       })
//     );
//   }

//   addComment(publicationId: string, userId: string, text: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/publications/${publicationId}/comment`, {
//       userId,
//       text
//     }, {
//       headers: { 'Content-Type': 'application/json' }
//     }).pipe(
//       catchError(error => {
//         console.error('Error adding comment:', error);
//         return throwError(() => new Error(`Failed to add comment: ${error.message}`));
//       })
//     );
//   }

//   updateComment(publicationId: string, commentId: string, newText: string): Observable<any> {
//     return this.http.put(`${this.baseUrl}/publications/${publicationId}/comments/${commentId}`, {
//       text: newText
//     }, {
//       headers: { 'Content-Type': 'application/json' }
//     }).pipe(
//       catchError(error => {
//         console.error('Error updating comment:', error);
//         return throwError(() => new Error('Failed to update comment'));
//       })
//     );
//   }

//   deleteComment(publicationId: string, commentId: string): Observable<any> {
//     return this.http.delete(`${this.baseUrl}/publications/${publicationId}/comments/${commentId}`, {
//       headers: { 'Content-Type': 'application/json' }
//     }).pipe(
//       catchError(error => {
//         console.error('Error deleting comment:', error);
//         return throwError(() => new Error(`Comment deletion error: ${error.message}`));
//       })
//     );
//   }
// }










import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Publication } from '../classes/publication.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  fetchPublications(providerId: string): Observable<Publication[]> {
    return this.http.get<any>(`${this.baseUrl}/publications/prestataire/${providerId}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map((response: any) => (response.data ?? []).map((pub: any) => Publication.fromJson(pub))),
      catchError(error => {
        console.error('Error fetching publications:', error);
        return throwError(() => new Error(`Failed to load publications: ${error.status}`));
      })
    );
  }

  createPublication(publication: Publication): Observable<any> {
    const formData = new FormData();
    formData.append('title', publication.title);
    formData.append('description', publication.description);
    formData.append('providerId', publication.providerId);
    if (publication.image) {
      publication.image.forEach((file, index) => {
        formData.append('images', file);
      });
    }

    console.log('[Debug] createPublication Request:', {
      url: `${this.baseUrl}/publications`,
      title: publication.title,
      description: publication.description,
      providerId: publication.providerId,
      imageFiles: publication.image?.map(f => f.name) || []
    });

    return this.http.post(`${this.baseUrl}/publications`, formData).pipe(
      map(response => {
        console.log('[Debug] createPublication Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('[Debug] Error creating publication:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorBody: error.error
        });
        let errorMessage = `Failed to create publication: ${error.message}`;
        if (error.status === 429) {
          errorMessage = 'Trop de fichiers uploadés. Maximum 10 autorisés.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // updatePublication(
  //   publicationId: string,
  //   title: string,
  //   description: string,
  //   providerId: string,
  //   imageFiles: File[] | null,
  //   existingImages: string[]
  // ): Observable<any> {
  //   if (!publicationId.match(/^[0-9a-fA-F]{24}$/)) {
  //     console.error('[Debug] Invalid publication ID:', publicationId);
  //     return throwError(() => new Error('Invalid publication ID'));
  //   }

  //   const formData = new FormData();
  //   formData.append('title', title);
  //   formData.append('description', description);
  //   formData.append('providerId', providerId);
  //   formData.append('existingImages', JSON.stringify(existingImages || []));

  //   if (imageFiles && imageFiles.length > 0) {
  //     imageFiles.forEach(file => {
  //       formData.append('images', file);
  //     });
  //   }

  //   console.log('[Debug] updatePublication Request:', {
  //     url: `${this.baseUrl}/publications/${publicationId}`,
  //     title,
  //     description,
  //     providerId,
  //     existingImages,
  //     imageFiles: imageFiles?.map(f => f.name) || []
  //   });

  //   return this.http.put(`${this.baseUrl}/publications/${publicationId}`, formData).pipe(
  //     map(response => {
  //       console.log('[Debug] updatePublication Response:', response);
  //       return response;
  //     }),
  //     catchError(error => {
  //       console.error('[Debug] Error updating publication:', {
  //         status: error.status,
  //         statusText: error.statusText,
  //         message: error.message,
  //         errorBody: error.error
  //       });
  //       let errorMessage = `Failed to update publication: ${error.message}`;
  //       if (error.status === 429) {
  //         errorMessage = 'Trop de fichiers uploadés. Maximum 10 autorisés.';
  //       }
  //       return throwError(() => new Error(errorMessage));
  //     })
  //   );
  // }
updatePublication(
    publicationId: string,
    title: string,
    description: string,
    providerId: string,
    imageFiles: File[] | null,
    existingImages: string[]
  ): Observable<any> {
    if (!publicationId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('[Debug] Invalid publication ID:', publicationId);
      return throwError(() => new Error('Invalid publication ID'));
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('providerId', providerId);
    formData.append('existingImages', JSON.stringify(existingImages || []));

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    console.log('[Debug] updatePublication Request:', {
      url: `${this.baseUrl}/publications/${publicationId}`,
      title,
      description,
      providerId,
      existingImages,
      imageFiles: imageFiles?.map(f => f.name) || []
    });

    return this.http.put(`${this.baseUrl}/publications/${publicationId}`, formData).pipe(
      map(response => {
        console.log('[Debug] updatePublication Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('[Debug] Error updating publication:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorBody: error.error
        });
        let errorMessage = `Failed to update publication: ${error.message}`;
        if (error.status === 429) {
          errorMessage = 'Trop de fichiers uploadés. Maximum 10 autorisés.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deletePublication(publicationId: string): Observable<void> {
    if (!/^[0-9a-fA-F]{24}$/.test(publicationId)) {
      return throwError(() => new Error('Invalid publication ID format'));
    }

    return this.http.delete<void>(`${this.baseUrl}/publications/${publicationId}`).pipe(
      catchError(error => {
        console.error('Error deleting publication:', error);
        return throwError(() => new Error(`Failed to delete: ${error.status}`));
      })
    );
  }

  toggleLike(publicationId: string, userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/publications/${publicationId}/like`, { userId }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(error => {
        console.error('Error toggling like:', error);
        return throwError(() => new Error('Failed to toggle like'));
      })
    );
  }

  addComment(publicationId: string, userId: string, text: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/publications/${publicationId}/comment`, { userId, text }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(error => {
        console.error('Error adding comment:', error);
        return throwError(() => new Error(`Failed to add comment: ${error.message}`));
      })
    );
  }

  updateComment(publicationId: string, commentId: string, newText: string): Observable<any> {
    if (!/^[0-9a-fA-F]{24}$/.test(publicationId)) {
      console.error('[Debug] Invalid publication ID:', publicationId);
      return throwError(() => new Error('Invalid publication ID format'));
    }
    if (!/^[0-9a-fA-F]{24}$/.test(commentId)) {
      console.error('[Debug] Invalid comment ID:', commentId);
      return throwError(() => new Error('Invalid comment ID format'));
    }
    console.log('[Debug] updateComment Request:', { publicationId, commentId, text: newText });
    return this.http.put(`${this.baseUrl}/publications/${publicationId}/comments/${commentId}`, { text: newText }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => {
        console.log('[Debug] updateComment Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('[Debug] Error updating comment:', error);
        return throwError(() => new Error(`Failed to update comment: ${error.status}`));
      })
    );
  }

  deleteComment(publicationId: string, commentId: string, userId: string): Observable<any> {
    if (!/^[0-9a-fA-F]{24}$/.test(publicationId)) {
      console.error('[Debug] Invalid publication ID:', publicationId);
      return throwError(() => new Error('Invalid publication ID format'));
    }
    if (!/^[0-9a-fA-F]{24}$/.test(commentId)) {
      console.error('[Debug] Invalid comment ID:', commentId);
      return throwError(() => new Error('Invalid comment ID format'));
    }
    const url = `${this.baseUrl}/publications/${publicationId}/comments/${commentId}`;
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    const body = { userId };
    console.log('[Debug] DELETE Request:', { url, publicationId, commentId, body, headers });
    return this.http.delete(url, { headers, body }).pipe(
      catchError(error => {
        console.error('[Debug] HTTP Error deleting comment:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorBody: error.error,
          url: error.url
        });
        return throwError(() => error);
      })
    );
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { Publication } from '../classes/publication.model';
// import { environment } from '../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class PublicationService {
//   private baseUrl: string = environment.baseUrl;

//   constructor(private http: HttpClient) {}

//   fetchPublications(providerId: string): Observable<Publication[]> {
//     return this.http.get<any>(`${this.baseUrl}/publications/prestataire/${providerId}`, {
//       headers: { 'Content-Type': 'application/json' }
//     }).pipe(
//       map((response: any) => (response.data ?? []).map((pub: any) => Publication.fromJson(pub))),
//       catchError(error => {
//         console.error('Error fetching publications:', error);
//         return throwError(() => new Error(`Failed to load publications: ${error.status}`));
//       })
//     );
//   }

//   createPublication(publication: Publication): Observable<any> {
//     const formData = new FormData();
//     formData.append('title', publication.title);
//     formData.append('description', publication.description);
//     formData.append('providerId', publication.providerId);
//     if (publication.image) {
//       formData.append('image', publication.image);
//     }

//     return this.http.post(`${this.baseUrl}/publications`, formData).pipe(
//       catchError(error => {
//         console.error('Error creating publication:', error);
//         return throwError(() => new Error(`Failed to create publication: ${error.message}`));
//       })
//     );
//   }

//   updatePublication(publicationId: string, title: string, description: string, providerId: string, imageFile: File | null): Observable<any> {
//     if (!publicationId.match(/^[0-9a-fA-F]{24}$/)) {
//       return throwError(() => new Error('Invalid publication ID'));
//     }

//     if (imageFile) {
//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('description', description);
//       formData.append('providerId', providerId);
//       formData.append('image', imageFile);

//       return this.http.put(`${this.baseUrl}/publications/${publicationId}`, formData).pipe(
//         catchError(error => {
//           console.error('Error updating publication:', error);
//           return throwError(() => new Error(`Failed to update publication: ${error.message}`));
//         })
//       );
//     } else {
//       return this.http.put(`${this.baseUrl}/publications/${publicationId}/text`, {
//         title,
//         description,
//         providerId
//       }, {
//         headers: { 'Content-Type': 'application/json' }
//       }).pipe(
//         catchError(error => {
//           console.error('Error updating publication:', error);
//           return throwError(() => new Error(`Failed to update publication: ${error.message}`));
//         })
//       );
//     }
//   }
  
// deletePublication(publicationId: string): Observable<void> {
//     // Validate publicationId format (24-character hexadecimal)
//     const isValidId = /^[0-9a-fA-F]{24}$/.test(publicationId);
//     if (!isValidId) {
//       console.error('Invalid publication ID:', publicationId);
//       return throwError(() => new Error('Invalid publication ID format'));
//     }

//     return this.http.delete<void>(`${this.baseUrl}/publications/${publicationId}`)
//       .pipe(
//         catchError(error => {
//           console.error('Error deleting publication:', error);
//           let errorMessage = `Failed to delete: ${error.status}`;
//           if (error.error?.message) {
//             errorMessage += `, ${error.error.message}`;
//           }
//           return throwError(() => new Error(errorMessage));
//         })
//       );
//   }

//   toggleLike(publicationId: string, userId: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/publications/${publicationId}/like`, { userId }, {
//       headers: { 'Content-Type': 'application/json' }
//     }).pipe(
//       catchError(error => {
//         console.error('Error toggling like:', error);
//         return throwError(() => new Error('Failed to toggle like'));
//       })
//     );
//   }

//  addComment(publicationId: string, userId: string, text: string, userName?: string, userImageUrl?: string, userType?: string): Observable<any> {
//   const body: any = { userId, text };
//   if (userName) body.userName = userName;
//   if (userImageUrl) body.userImageUrl = userImageUrl;
//   if (userType) body.userType = userType;

//   return this.http.post(`${this.baseUrl}/publications/${publicationId}/comment`, body, {
//     headers: { 'Content-Type': 'application/json' } // Add auth headers if required
//   }).pipe(
//     catchError(error => {
//       console.error('Error adding comment:', error, error.error);
//       let errorMessage = `Failed to add comment: ${error.status}`;
//       if (error.error?.message) {
//         errorMessage += `, ${error.error.message}`;
//       }
//       return throwError(() => new Error(errorMessage));
//     })
//   );
// }

//   updateComment(publicationId: string, commentId: string, newText: string): Observable<any> {
//     return this.http.put(`${this.baseUrl}/publications/${publicationId}/comments/${commentId}`, {
//       text: newText
//     }, {
//     }).pipe(
//       catchError(error => {
//         console.error('Error updating comment:', error);
//         return throwError(() => new Error('Failed to update comment'));
//       })
//     );
//   }

//   deleteComment(publicationId: string, commentId: string): Observable<any> {
//     return this.http.delete(`${this.baseUrl}/publications/${publicationId}/comments/${commentId}`, {
//     }).pipe(
//       catchError(error => {
//         console.error('Error deleting comment:', error, error.error);
//         return throwError(() => new Error(`Comment deletion error: ${error.message}`));
//       })
//     );
//   }
// }