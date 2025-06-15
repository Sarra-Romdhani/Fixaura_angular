import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  initializeTheme() {
    const isDark = localStorage.getItem('isDarkMode') === 'true';
    this.isDarkModeSubject.next(isDark);
    this.applyTheme(isDark);
  }

  toggleTheme() {
    const isDark = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(isDark);
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean) {
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    localStorage.setItem('isDarkMode', isDark.toString());
  }

  getDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}