import { Component } from '@angular/core';
import { ConsumeService } from '../services/consume.service'; // Adjust the path if needed
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../services/session.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import Snackbar

// Define the structure of the property details
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
  imports: [CommonModule, HttpClientModule, FormsModule, MatSnackBarModule, RouterModule] // Include MatSnackBarModule
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
    propertyDetails: ''
  };

  constructor(
    private consumeService: ConsumeService,
    private router: Router,
    private sessionService: SessionService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }

  // Handle file selection
  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  // Show Snackbar Message
  showSnackbar(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // 3 seconds
      panelClass: isError ? 'snackbar-error' : 'snackbar-success'
    });
  }

  // Submit property details and images
  onSubmit(): void {
    console.log('Submitting property details:', this.propertyDetails);

    const formData = new FormData();
    // const token = this.sessionService.getToken()
    // Append property details
    Object.keys(this.propertyDetails).forEach((key) => {
      const validKey = key as keyof PropertyDetails;
      formData.append(validKey, this.propertyDetails[validKey]);
    });

    // Append images
    this.selectedFiles.forEach((file) => {
      formData.append('image', file, file.name);
    });

    // API Call
    this.consumeService.postFormData('/api/open/properties', formData, null)
      .subscribe({
        next: (response) => {
          console.log('Property added successfully:', response);
          this.showSnackbar('Property added successfully!');
          this.router.navigate(['/properties']); // Redirect after success
        },
        error: (error) => {
          console.error('Error adding property:', error);
          this.showSnackbar('Error adding property. Please try again.', true);
        }
      });
  }

  // Navigate to View Properties
  navigateToProperties(): void {
    this.router.navigate(['/properties']);
  }
}
