import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchSubject = new Subject<string>();
  searchQuery$ = this.searchSubject.pipe(
    debounceTime(300), // Wait 300ms after typing stops
    distinctUntilChanged() // Only emit if query changes
  );

  setSearchQuery(query: string) {
    this.searchSubject.next(query);
  }
}