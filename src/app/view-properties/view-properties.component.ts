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
  filteredProperties: any[] = [];
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
        this.properties = response.map((property: any) => ({ ...property, isEditing: false }));
        this.filteredProperties = [...this.properties]; // Initialize filteredProperties
        console.log('Properties fetched successfully:', this.properties);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching properties:', error);
        this.snackBar.open('Error fetching properties. Please try again.', 'Close', { duration: 5000 });
        this.loading = false;
      },
    });
  }

  // Filter properties by type
  onFilterChange(event: any): void {
    const filterValue = event.target.value;
    if (filterValue) {
      this.filteredProperties = this.properties.filter(
        (property) => property.propertyType === filterValue
      );
    } else {
      this.filteredProperties = [...this.properties]; // Show all properties if no filter is selected
    }
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
    const formData = new FormData();
    formData.append('property', JSON.stringify(property));

    if (property.images && property.images.length > 0) {
      property.images.forEach((image: File, index: number) => {
        formData.append('images', image);
      });
    }

    this.consumeService.putRequest(`/api/open/properties/${property.id}`, formData).subscribe(
      (response) => {
        this.snackBar.open('Property updated successfully', 'Close', { duration: 3000 });
        property.isEditing = false;
        this.fetchProperties();
      },
      (error) => {
        console.error('Error updating property:', error);
        this.snackBar.open(`Failed to update property: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
      }
    );
  }

  // Delete property
  deleteProperty(propertyId: string): void {
    const snackBarRef = this.snackBar.open('Are you sure you want to delete this property?', 'Delete', {
      duration: 5000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.consumeService.deleteRequest(`/api/open/properties/${propertyId}`, null).subscribe(
        (response) => {
          this.snackBar.open('Property deleted successfully', 'Close', { duration: 3000 });
          this.fetchProperties();
        },
        (error) => {
          console.error('Error deleting property:', error);
          this.snackBar.open('Failed to delete property', 'Close', { duration: 5000 });
        }
      );
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log('Deletion canceled');
    });
  }
}