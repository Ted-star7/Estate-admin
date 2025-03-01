import { Component } from '@angular/core';
import { ConsumeService } from '../services/consume.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../services/session.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface PropertyDetails {
  propertyName: string;
  propertyType: string;
  price: string;
  city: string;
  status: string;
  location: string;
  bedrooms: string;
  squareFeet: string;
  bathrooms: string;
  parkingSpace: string;
  propertyDetails: string;
}

@Component({
  selector: 'app-properties',
  standalone: true,
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule, MatSnackBarModule, RouterModule],
})
export class PropertiesComponent {
  selectedFiles: File[] = [];
  propertyDetails: PropertyDetails = {
    propertyName: '',
    propertyType: '',
    price: '',
    city: '',
    status: '',
    location: '',
    bedrooms: '',
    squareFeet: '',
    bathrooms: '',
    parkingSpace: '',
    propertyDetails: '',
  };
  isLoading = false; // Loading spinner flag

  constructor(
    private consumeService: ConsumeService,
    private router: Router,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) { }

  isLand(): boolean {
    return this.propertyDetails.propertyType === 'Land';
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  showSnackbar(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? 'snackbar-error' : 'snackbar-success',
    });
  }

  resetForm(): void {
    this.propertyDetails = {
      propertyName: '',
      propertyType: '',
      price: '',
      city: '',
      status: '',
      location: '',
      bedrooms: '',
      squareFeet: '',
      bathrooms: '',
      parkingSpace: '',
      propertyDetails: '',
    };
    this.selectedFiles = [];
  }

  onSubmit(): void {
    console.log('Submitting property details:', this.propertyDetails);

    const formData = new FormData();
    formData.append('property', JSON.stringify(this.propertyDetails)); 

    this.selectedFiles.forEach((file) => {
      formData.append('images', file, file.name);
    });

    this.isLoading = true; // Show spinner

    this.consumeService.postFormData('/api/open/properties', formData, null).subscribe({
      next: (response) => {
        console.log('Property added successfully:', response);
        this.showSnackbar('Property added successfully!');
        this.resetForm(); // Reset form
        this.isLoading = false; // Hide spinner
      },
      error: (error) => {
        console.error('Error adding property:', error);
        this.showSnackbar('Error adding property. Please try again.', true);
        this.isLoading = false; // Hide spinner
      },
    });
  }
}
