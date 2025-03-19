import { Component, OnInit } from '@angular/core';
import { ConsumeService } from '../services/consume.service';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-site-visit',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './site-visit.component.html',
  styleUrls: ['./site-visit.component.css'],
})
export class SiteVisitComponent implements OnInit {
  siteVisits: any[] = [];
  archivedVisits: any[] = [];
  editingId: number | null = null;
  selectedVisitId: number | null = null;
  message: { [key: number]: string } = {};
  token: string | null = sessionStorage.getItem('token');
  showArchivedVisits: boolean = false;

  constructor(
    private consumeService: ConsumeService,
    private snackBar: MatSnackBar,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.fetchSiteVisits();
  }

  fetchSiteVisits(): void {
    this.showArchivedVisits = false;
    this.consumeService.getRequest('/api/open/site-visits', this.token).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.siteVisits = response.data;
        }
      },
      error: () => this.showNotification('Error fetching site visits', 'error'),
    });
  }

  fetchArchivedSiteVisits(): void {
    this.showArchivedVisits = true;
    this.consumeService.getRequest('/api/open/site-visits/archive', this.token).subscribe({
      next: (response) => {
        this.archivedVisits = response.data || [];
      },
      error: () => this.showNotification('Error fetching archived site visits', 'error'),
    });
  }

  deleteSiteVisit(id: number): void {
    if (confirm('Are you sure you want to delete this site visit?')) {
      this.consumeService.deleteRequest(`/api/open/site-visits/${id}`, this.token).subscribe({
        next: () => {
          this.siteVisits = this.siteVisits.filter((visit) => visit.id !== id);
          this.showNotification('Site visit deleted successfully', 'success');
        },
        error: () => this.showNotification('Failed to delete site visit', 'error'),
      });
    }
  }

  startEditing(id: number): void {
    this.editingId = id;
  }

  saveEdit(id: number, updatedData: any): void {
    this.consumeService.putMethod(`/api/open/site-visits/${id}`, updatedData, this.token).subscribe({
      next: () => {
        this.editingId = null;
        this.fetchSiteVisits();
        this.showNotification('Site visit updated successfully', 'success');
      },
      error: () => this.showNotification('Failed to update site visit', 'error'),
    });
  }

  toggleReply(id: number): void {
    this.selectedVisitId = this.selectedVisitId === id ? null : id;
  }

  sendReply(id: number): void {
    if (!this.message[id]?.trim()) {
      this.showNotification('Please enter a reply message', 'warning');
      return;
    }

    // Correct payload structure
    const payload = { message: this.message[id] };

    this.consumeService.postRequest(`/api/open/site-visits/${id}/reply`, payload, this.token).subscribe({
      next: () => {
        this.showNotification('Reply sent successfully!', 'success');
        this.message[id] = '';
        this.selectedVisitId = null;
      },
      error: (error) => {
        console.error('Error sending reply:', error);
        const errorMessage = error.error?.message || 'Failed to send reply. Please try again.';
        this.showNotification(errorMessage, 'error');
      },
    });
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    let panelClass = '';
    if (type === 'success') panelClass = 'snack-success';
    if (type === 'error') panelClass = 'snack-error';
    if (type === 'warning') panelClass = 'snack-warning';

    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: panelClass,
    });
  }
}