import { Component, OnInit } from '@angular/core';
import { ConsumeService } from '../services/consume.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-properties',
  standalone: true,
  imports: [MatSnackBarModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './view-properties.component.html',
  styleUrls: ['./view-properties.component.css'],
})
export class ViewPropertiesComponent implements OnInit {
  properties: any[] = [];
  loading: boolean = false;

  constructor(
    private consumeService: ConsumeService,
    private snackBar: MatSnackBar,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.fetchProperties();
  }


  fetchProperties(): void {
    this.loading = true;
    this.consumeService.getRequest('/api/open/properties', null).subscribe({
      next: (response: any) => {
        this.properties = response.map((property: any) => ({ ...property, isEditing: false })); // Add isEditing flag
        console.log('Properties fetched successfully:', this.properties);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching properties:', error);
        this.snackBar.open('Error fetching properties. Please try again.', 'Close', { duration: 5000 });
        this.loading = false; // Hide loading state
      },
    });
  }

  // Enable edit mode for a property
  enableEdit(property: any): void {
    property.isEditing = true;
  }

  // Cancel edit mode
  cancelEdit(property: any): void {
    property.isEditing = false;
  }

  // Save updated property details
  saveProperty(property: any): void {
    // Create a FormData object
    const formData = new FormData();

    // Append the property object as a JSON string
    formData.append('property', JSON.stringify(property));

    // Append images (if any)
    if (property.images && property.images.length > 0) {
      property.images.forEach((image: File, index: number) => {
        formData.append('images', image); // Append each image file
      });
    }

    // Send the PUT request
    this.consumeService.putRequest(`/api/open/properties/${property.id}`, formData).subscribe(
      (response) => {
        this.snackBar.open('Property updated successfully', 'Close', { duration: 3000 });
        property.isEditing = false;
        this.fetchProperties(); // Refresh the property list
      },
      (error) => {
        console.error('Error updating property:', error);
        this.snackBar.open(`Failed to update property: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
      }
    );
  }

  // Delete property
  deleteProperty(propertyId: string): void {
    // const token = this.sessionService.getToken();
    // if (!token) {
    //   this.snackBar.open('Authentication required', 'Close', { duration: 3000 });
    //   return;
    // }

    // Show a confirmation snackbar
    const snackBarRef = this.snackBar.open('Are you sure you want to delete this property?', 'Delete', {
      duration: 5000,
    });

    // Subscribe to the snackbar action (e.g., when the user clicks "Delete")
    snackBarRef.onAction().subscribe(() => {
      // User confirmed deletion
      this.consumeService.deleteRequest(`/api/open/properties/${propertyId}`, null).subscribe(
        (response) => {
          this.snackBar.open('Property deleted successfully', 'Close', { duration: 3000 });
          this.fetchProperties(); // Refresh the property list
        },
        (error) => {
          console.error('Error deleting property:', error);
          this.snackBar.open('Failed to delete property', 'Close', { duration: 5000 });
        }
      );
    });

    // Optional: Handle when the snackbar is dismissed without action
    snackBarRef.afterDismissed().subscribe(() => {
      console.log('Deletion canceled');
    });
  }

  // Sort properties
  onSortChange(event: any): void {
    const sortBy = event.target.value;
    switch (sortBy) {
      case 'priceLowToHigh':
        this.properties.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        this.properties.sort((a, b) => b.price - a.price);
        break;
      case 'location':
        this.properties.sort((a, b) => a.location.localeCompare(b.location));
        break;
      case 'type':
        this.properties.sort((a, b) => a.propertyType.localeCompare(b.propertyType));
        break;
      default:
        this.fetchProperties(); // Reset to default order
        break;
    }
  }
}