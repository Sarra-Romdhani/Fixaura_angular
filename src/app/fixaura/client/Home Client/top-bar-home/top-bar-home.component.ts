import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SearchService } from '../search.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-top-bar-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './top-bar-home.component.html',
  styleUrls: ['./top-bar-home.component.css'],
})
export class TopBarHomeComponent implements OnInit {
  searchQuery: string = '';
  clientId: string | null = null;
  category: string | null = null;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Retrieve clientId and category from query parameters
    this.route.queryParams.subscribe(params => {
      this.clientId = params['clientId'] || null;
      this.category = params['category'] || null;
      console.log('TopBarHome - Client ID:', this.clientId, 'Category:', this.category);
    });
  }

  onSearch() {
    this.searchService.setSearchQuery(this.searchQuery);
  }

  // Getter for query parameters to use in template
  get queryParams() {
    return {
      clientId: this.clientId,
      category: this.category
    };
  }
}