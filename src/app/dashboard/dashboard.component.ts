import { Component, OnInit } from '@angular/core';
import { ConsumeService } from '../services/consume.service';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Variables to hold API data
  totalProperties: number = 0;
  residentialProperties: number = 0;
  landProperties: number = 0;
  newNotifications: number = 0;
  loading: boolean = true; // To show loading state

  // Variable to hold the username
  username: string = 'Admin'; // Default to 'Admin' if no username is found

  constructor(private consumeService: ConsumeService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    // Fetch the username from sessionStorage
    this.fetchUsername();
    this.fetchDashboardData();
  }

  // Fetch the username from sessionStorage
  fetchUsername(): void {
    const storedUser = this.sessionService.getuserName('username');
    if (storedUser) {
      this.username = storedUser; // Directly assign the username from session storage
    }
  }

  // Fetch data from the API
  fetchDashboardData(): void {
    this.consumeService.getRequest('/api/open/dashboard/counts', null).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.totalProperties = response.data.totalProperties || 0;
          this.residentialProperties = response.data.residentialProperties || 0;
          this.landProperties = response.data.landProperties || 0;
          this.newNotifications = response.data.newNotifications || 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        this.loading = false;
      },
    });
  }
}
