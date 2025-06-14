import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private signupData: any = {};

  setData(key: string, value: any): void {
    this.signupData[key] = value;
  }

  getData(): any {
    return { ...this.signupData };
  }

  clearData(): void {
    this.signupData = {};
  }
}