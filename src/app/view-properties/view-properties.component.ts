import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumeService } from '../services/consume.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-properties',
  standalone: true,
  imports: [MatSnackBarModule, HttpClientModule, CommonModule],
  templateUrl: './view-properties.component.html',
  styleUrls: ['./view-properties.component.css']
})
export class ViewPropertiesComponent implements OnInit {
  properties: any[] = []; // Array to store fetched properties
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consumeService: ConsumeService,
    private snackBar: MatSnackBar,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.fetchProperties(); // Fetch properties when the component initializes
  }

  // Fetch properties from the API
  fetchProperties(): void {
    this.loading = true; // Show loading state
    this.consumeService.getRequest('/api/open/properties', null)
      .subscribe({
        next: (response: any) => {
          this.properties = response; // Assign the fetched properties to the array
          console.log('Properties fetched successfully:', this.properties);
          this.loading = false; // Hide loading state
        },
        error: (error) => {
          console.error('Error fetching properties:', error);
          this.snackBar.open('Error fetching properties. Please try again.', 'Close', { duration: 5000 });
          this.loading = false; // Hide loading state
        }
      });
  }

  updateProperty(propertyId: string, updatedData: any): void {
    const token = this.sessionService.getToken(); // Get token from SessionService
    if (!token) {
      this.snackBar.open('Authentication required', 'Close', { duration: 3000 });
      return;
    }

    this.consumeService.putRequest(`/api/open/properties/${propertyId}`, updatedData, token).subscribe(
      (response) => {
        this.snackBar.open('Property updated successfully', 'Close', { duration: 3000 });
        this.fetchProperties(); // Refresh the property list
      },
      (error) => {
        console.error('Error updating property:', error);
        this.snackBar.open('Failed to update property', 'Close', { duration: 5000 });
      }
    );
  }

  deleteProperty(propertyId: string): void {
    const token = this.sessionService.getToken(); // Get token from SessionService
    if (!token) {
      this.snackBar.open('Authentication required', 'Close', { duration: 3000 });
      return;
    }

    this.consumeService.deleteRequest(`/api/open/properties/${propertyId}`, token).subscribe(
      (response) => {
        this.snackBar.open('Property deleted successfully', 'Close', { duration: 3000 });
        this.fetchProperties(); // Refresh the property list
      },
      (error) => {
        console.error('Error deleting property:', error);
        this.snackBar.open('Failed to delete property', 'Close', { duration: 5000 });
      }
    );
  }
}