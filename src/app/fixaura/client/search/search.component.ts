import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription, combineLatest, debounceTime, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface Provider {
  _id: string;
  name: string;
  job: string;
  image?: string;
  price: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  maxPrice: number = 0;
  providers: Provider[] = [];
  filteredProviders: Provider[] = [];
  isNearestLocation: boolean = false;
  showJobDropdown: boolean = false;
  selectedJob: string = '';
  jobs: string[] = [];
  category: string | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;
  private apiUrl = environment.baseUrl || 'http://localhost:3000';
  private querySubscription: Subscription | null = null;
  private priceChangeSubject = new Subject<void>();

  private jobCategories: { [key: string]: string[] } = {
    'Réparations et entretien': [
      'Plombier',
      'Électricien',
      'Mécanicien à domicile',
      'Réparateur d’électroménager',
      'Serrurier',
      'Vitrier'
    ],
    'Maison et aménagement': [
      'Peintre en bâtiment',
      'Menuisier',
      'Jardinier',
      'Agent de nettoyage'
    ],
    'Santé': [
      'Médecin à domicile',
      'Infirmier à domicile',
      'Kinésithérapeute à domicile'
    ],
    'Beauté': [
      'Coiffeur à domicile',
      'Esthéticienne à domicile'
    ],
    'Déménagement et transport': [
      'Déménageur',
      'Chauffeur privé/VTC'
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.querySubscription = this.route.queryParams.subscribe(params => {
      this.category = params['category'] || null;
      console.log('SearchComponent - Category:', this.category);
      if (this.category && this.jobCategories[this.category]) {
        this.jobs = this.jobCategories[this.category];
      } else {
        this.jobs = Object.values(this.jobCategories).flat();
      }
      this.loadProviders();
    });

    // Debounce price filter changes
    this.priceChangeSubject.pipe(debounceTime(300)).subscribe(() => {
      this.filterByPrice();
    });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    this.priceChangeSubject.complete();
  }

  loadProviders() {
    this.loading = true;
    this.errorMessage = null;
    const nameQuery = this.searchQuery.trim();
    const categoryQuery = this.category || '';
    const jobQuery = this.selectedJob;

    const nameAndCategory$ = nameQuery || categoryQuery
      ? this.http.get<ApiResponse<Provider[]>>(`${this.apiUrl}/prestataires/by-name-and-category`, {
          params: { name: nameQuery, category: categoryQuery }
        })
      : Promise.resolve({ success: true, data: [] });

    const jobAndName$ = jobQuery
      ? this.http.get<ApiResponse<Provider[]>>(`${this.apiUrl}/prestataires/by-job-and-name`, {
          params: { job: jobQuery, name: nameQuery }
        })
      : Promise.resolve({ success: true, data: [] });

    combineLatest([nameAndCategory$, jobAndName$]).subscribe({
      next: ([nameAndCategoryRes, jobAndNameRes]) => {
        console.log('Name and Category Response:', JSON.stringify(nameAndCategoryRes, null, 2));
        console.log('Job and Name Response:', JSON.stringify(jobAndNameRes, null, 2));
        const providers = [
          ...(nameAndCategoryRes.success ? nameAndCategoryRes.data : []),
          ...(jobAndNameRes.success ? jobAndNameRes.data : [])
        ].map(provider => ({
          _id: provider._id,
          name: provider.name,
          job: provider.job,
          image: provider.image ? `${this.apiUrl}${provider.image}` : undefined,
          price: provider.price || 0
        }));
        // Deduplicate by _id
        const uniqueProviders = Array.from(
          new Map(providers.map(p => [p._id, p])).values()
        );
        this.providers = uniqueProviders;
        console.log('Unique Providers:', JSON.stringify(this.providers, null, 2));
        this.filterByPrice();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching providers:', err);
        this.errorMessage = 'Erreur lors du chargement des prestataires.';
        this.loading = false;
      }
    });
  }

  toggleJobDropdown() {
    this.showJobDropdown = !this.showJobDropdown;
  }

  selectJob(job: string) {
    this.selectedJob = job;
    this.onJobChange();
  }

  onJobChange() {
    this.loadProviders();
  }

  onSearch() {
    this.loadProviders();
  }

  toggleNearestLocation() {
    this.isNearestLocation = !this.isNearestLocation;
    this.loadProviders();
  }

  onPriceChange() {
    this.priceChangeSubject.next();
  }

  filterByPrice() {
    console.log('Filtering by Price - Job:', this.selectedJob, 'Max:', this.maxPrice);
    if (!this.selectedJob) {
      this.filteredProviders = this.providers.filter(provider =>
        provider.price <= this.maxPrice
      );
      console.log('Filtered Providers (no job):', JSON.stringify(this.filteredProviders, null, 2));
      return;
    }

    this.loading = true;
    this.http.get<ApiResponse<Provider[]>>(`${this.apiUrl}/prestataires/by-job-and-price-range`, {
      params: {
        job: this.selectedJob,
        maxPrice: this.maxPrice.toString()
      }
    }).subscribe({
      next: (res) => {
        console.log('Price Range Response:', JSON.stringify(res, null, 2));
        this.filteredProviders = res.success
          ? res.data.map(provider => ({
              _id: provider._id,
              name: provider.name,
              job: provider.job,
              image: provider.image ? `${this.apiUrl}${provider.image}` : undefined,
              price: provider.price || 0
            }))
          : [];
        console.log('Filtered Providers (with job):', JSON.stringify(this.filteredProviders, null, 2));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error filtering by price:', err);
        this.filteredProviders = this.providers.filter(provider =>
          provider.job === this.selectedJob && provider.price <= this.maxPrice
        );
        console.log('Filtered Providers (fallback):', JSON.stringify(this.filteredProviders, null, 2));
        this.errorMessage = 'Erreur lors du filtrage par prix, filtre local appliqué.';
        this.loading = false;
      }
    });
  }

  viewProfile(provider: any) {
    console.log('View profile for:', provider.name);
  }
}