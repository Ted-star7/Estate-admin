import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsumeService } from '../services/consume.service';
import { SessionService } from '../services/session.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, HttpClientModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
})
export class TestimonialsComponent implements OnInit {
  testimonialForm: FormGroup;
  testimonials: any[] = [];
  loading = false;
  isEditing = false; // Track if in edit mode
  currentTestimonialId: string | null = null; // Track the testimonial being edited

  constructor(
    private fb: FormBuilder,
    private consumeService: ConsumeService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) {
    // Initialize Form
    this.testimonialForm = this.fb.group({
      name: ['', Validators.required],
      rating: [null, Validators.required],
      testimonial: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTestimonials();
  }

  // Load Testimonials from API
  loadTestimonials() {
    this.consumeService
      .getRequest('/api/open/ratings/get-testimonials/all', null)
      .subscribe({
        next: (response: any) => {
          this.testimonials = response.data;
        },
        error: (error) => {
          console.error('Error loading testimonials:', error);
          this.snackBar.open('Failed to load testimonials. Please try again.', 'Close', { duration: 5000 });
        },
      });
  }

  // Submit or Update Testimonial
  submitTestimonial() {
    if (this.testimonialForm.invalid) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const formData = this.testimonialForm.value;
    const token = this.sessionService.getToken();

    if (!token) {
      this.snackBar.open('Token is missing or invalid. Please log in again.', 'Close', { duration: 5000 });
      this.loading = false;
      return;
    }

    if (this.isEditing && this.currentTestimonialId) {
      // Update existing testimonial
      this.consumeService
        .putMethod(`/api/ratings/${this.currentTestimonialId}`, formData, token)
        .subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Testimonial updated successfully!', 'Close', { duration: 3000 });
            this.resetForm();
            this.loadTestimonials();
          },
          error: (error) => {
            this.loading = false;
            console.error('Error updating testimonial:', error);
            this.snackBar.open('Failed to update testimonial. Please try again.', 'Close', { duration: 5000 });
          },
        });
    } else {
      // Submit new testimonial
      this.consumeService
        .postRequest('/api/ratings/post-testimonials', formData, token)
        .subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Testimonial submitted successfully!', 'Close', { duration: 3000 });
            this.resetForm();
            this.loadTestimonials();
          },
          error: (error) => {
            this.loading = false;
            console.error('Error submitting testimonial:', error);
            this.snackBar.open('Failed to submit testimonial. Please try again.', 'Close', { duration: 5000 });
          },
        });
    }
  }

  // Edit Testimonial
  onEdit(testimonial: any) {
    this.isEditing = true;
    this.currentTestimonialId = testimonial.id;
    this.testimonialForm.patchValue({
      name: testimonial.name,
      rating: testimonial.rating,
      testimonial: testimonial.testimonial,
    });
  }

  // Delete Testimonial
  onDelete(testimonial: any) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const token = this.sessionService.getToken();
      if (!token) {
        this.snackBar.open('Token is missing or invalid. Please log in again.', 'Close', { duration: 5000 });
        return;
      }

      this.consumeService
        .deleteRequest(`/api/ratings/${testimonial.id}`, token)
        .subscribe({
          next: () => {
            this.snackBar.open('Testimonial deleted successfully!', 'Close', { duration: 3000 });
            this.loadTestimonials();
          },
          error: (error) => {
            console.error('Error deleting testimonial:', error);
            this.snackBar.open('Failed to delete testimonial. Please try again.', 'Close', { duration: 5000 });
          },
        });
    }
  }

  // Reset Form
  resetForm() {
    this.testimonialForm.reset();
    this.isEditing = false;
    this.currentTestimonialId = null;
  }
}