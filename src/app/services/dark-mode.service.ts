import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      this.isDarkMode.next(JSON.parse(savedDarkMode));
      document.documentElement.classList.toggle('dark-mode', this.isDarkMode.value);
    }
  }

  toggleDarkMode(checked: boolean): void {
    this.isDarkMode.next(checked);
    localStorage.setItem('darkMode', JSON.stringify(checked));
    document.documentElement.classList.toggle('dark-mode', checked);
    // Backend sync placeholder for PUT /prestataires/{userId}/dark-mode
  }
}