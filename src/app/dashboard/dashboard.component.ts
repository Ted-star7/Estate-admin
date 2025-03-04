import { Component, OnInit } from '@angular/core';
import { ConsumeService } from '../services/consume.service';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],  
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalProperties: number = 0;
  residentialProperties: number = 0;
  landProperties: number = 0;
  newNotifications: number = 0;
  loading: boolean = true;

  recentSiteVisitReply: string = '';
  recentContactReply: string = '';

  username: string = 'Admin';

  constructor(
    private consumeService: ConsumeService,
    private sessionService: SessionService,
    private router: Router // ✅ Ensure router is properly injected
  ) { }

  ngOnInit(): void {
    this.fetchUsername();
    this.fetchDashboardData();
    this.fetchRecentActivity();
  }

  navigateTo(route: string): void {
    if (this.router) {
      this.router.navigate([route]);
    } else {
      console.error('Router is not available');
    }
  }

  fetchUsername(): void {
    const storedUser = this.sessionService.getuserName('username');
    if (storedUser) {
      this.username = storedUser;
    }
  }

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

  fetchRecentActivity(): void {
    this.consumeService.getRequest('/api/open/dashboard/site-visit/recent-reply', null).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.recentSiteVisitReply = response.data;
        }
      },
      error: (error) => {
        console.error('Error fetching recent site visit reply:', error);
      },
    });

    this.consumeService.getRequest('/api/open/dashboard/message/recent-contact-reply', null).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.recentContactReply = response.data;
        }
      },
      error: (error) => {
        console.error('Error fetching recent contact reply:', error);
      },
    });
  }
}
