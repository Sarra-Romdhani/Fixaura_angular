import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { SearchService } from '../search.service';

// Define interfaces
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface Provider {
  name: string;
  image?: string;
  job?: string;
  profession?: string;
  rating?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  clientId: string | null = null;
  category: string | null = null;
  topRatedProviders: Provider[] = [];
  allProviders: Provider[] = [];
  loading: boolean = false;

  private apiUrl = environment.baseUrl || 'http://localhost:3000';
  private searchSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.clientId = this.route.snapshot.queryParamMap.get('clientId');
    this.category = this.route.snapshot.queryParamMap.get('category');
    console.log('Client ID:', this.clientId, 'Category:', this.category);

    if (this.category) {
      this.loadTopRatedProviders();
      this.loadAllProvidersByCategory();
    }

    // Subscribe to search queries from the top bar
    this.searchSubscription = this.searchService.searchQuery$.subscribe((query) => {
      this.searchQuery = query;
      this.onSearch();
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onViewProfile(provider: Provider) {
    this.router.navigate(['/profile', provider.name]);
  }

  // Fetch top-rated providers
  loadTopRatedProviders() {
    if (this.category) {
      this.loading = true;
      this.http.get<ApiResponse<Provider[]>>(`${this.apiUrl}/prestataires/top-rated/${this.category}`).subscribe({
        next: (response) => {
          this.topRatedProviders = response.success
            ? response.data.map(provider => ({
                ...provider,
                image: provider.image ? `${this.apiUrl}${provider.image}` : undefined,
              }))
            : [];
          console.log('Top Rated Providers:', this.topRatedProviders);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching top-rated providers:', err);
          this.loading = false;
        },
      });
    }
  }

  // Fetch all providers by category
  loadAllProvidersByCategory() {
    if (this.category) {
      this.loading = true;
      this.http.get<ApiResponse<Provider[]>>(`${this.apiUrl}/prestataires/category/${this.category}`).subscribe({
        next: (response) => {
          this.allProviders = response.success
            ? response.data.map(provider => ({
                ...provider,
                image: provider.image ? `${this.apiUrl}${provider.image}` : undefined,
              }))
            : [];
          console.log('All Providers:', this.allProviders);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching all providers:', err);
          this.loading = false;
        },
      });
    }
  }

  // Method to handle search
  onSearch() {
    if (this.category) {
      this.loading = true;
      this.http.get<ApiResponse<Provider[]>>(`${this.apiUrl}/prestataires/by-name-and-category`, {
        params: {
          category: this.category,
          name: this.searchQuery || '',
        },
      }).subscribe({
        next: (response) => {
          this.allProviders = response.success
            ? response.data.map(provider => ({
                ...provider,
                image: provider.image ? `${this.apiUrl}${provider.image}` : undefined,
              }))
            : [];
          console.log('Search Results:', this.allProviders);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error searching providers:', err);
          this.loading = false;
        },
      });
    }
  }
}