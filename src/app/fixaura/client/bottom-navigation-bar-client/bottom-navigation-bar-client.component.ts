import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation-bar-client',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './bottom-navigation-bar-client.component.html',
  styleUrls: ['./bottom-navigation-bar-client.component.css']
})
export class BottomNavigationBarClientComponent implements OnInit {
  clientId: string | null = null;
  category: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Retrieve clientId and category from query parameters
    this.route.queryParams.subscribe(params => {
      this.clientId = params['clientId'] || null;
      this.category = params['category'] || null;
      console.log('BottomNavigationBarClient - Client ID:', this.clientId, 'Category:', this.category);
    });
  }

  // Getter for query parameters to use in template
  get queryParams() {
    return {
      clientId: this.clientId,
      category: this.category
    };
  }
}