import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { SignupService } from '../signup.service';

@Component({
  selector: 'app-signup2',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './signup2.component.html',
  styleUrl: './signup2.component.css',
})
export class Signup2Component {
  selectedServiceType: string = '';
  selectedStatus: string = '';
  cnss: string = '';
  matricule: string = '';
  prixMax: string = '';
  facebook: string = '';
  instagram: string = '';
  website: string = '';
  serviceRoles: { [key: string]: string[] } = {
    'Réparations et entretien': [
      'Plombier ',
      'Électricien ',
      'Mécanicien à domicile ',
      'Réparateur d’électroménager ',
      'Serrurier',
      'Vitrier',
    ],
    'Maison et aménagement': [
      'Peintre en bâtiment ',
      'Menuisier ',
      'Jardinier ',
      'Agent de nettoyage',
    ],
    'Santé': [
      'Médecin à domicile ',
      'Infirmier à domicile ',
      'Kinésithérapeute à domicile ',
    ],
    'Beauté': [
      'Coiffeur à domicile',
      'Esthéticienne à domicile ',
    ],
    'Déménagement et transport': [
      'Déménageur',
      'Chauffeur privé/VTC ',
    ],
  };

  constructor(private router: Router, private signupService: SignupService) {}

  onNext() {
    if (!this.selectedServiceType || !this.selectedStatus || (this.selectedStatus === 'independant' && !this.cnss) || (this.selectedStatus === 'societe' && !this.matricule) || !this.prixMax) {
      console.log('Please fill all required fields');
      return;
    }

    const step1Data = this.signupService.getData().step1 || {};
    const prestataireData = {
      category: this.selectedServiceType,
      job: this.serviceRoles[this.selectedServiceType][0] || '', 
      businessAddress: step1Data.homeAddress || '', 
      available: true,
      maxPrice: parseFloat(this.prixMax),
      businessID: this.selectedStatus === 'independant' ? this.cnss : this.matricule,
      status: this.selectedStatus.charAt(0).toUpperCase() + this.selectedStatus.slice(1),
      facebook: this.facebook,
      instagram: this.instagram,
      website: this.website,
    };
    this.signupService.setData('step2', prestataireData);

      this.router.navigate(['/final step']);
  }

  onServiceTypeChange(event: any) {
    this.selectedServiceType = event.target.value;
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
  }
}