import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsumeService } from '../services/consume.service';
import { SessionService } from '../services/session.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
})
export class TestimonialsComponent implements OnInit {
onDelete(_t58: any) {
throw new Error('Method not implemented.');
}
  testimonialForm: FormGroup;
  testimonials: any[] = [];
  loading = false;

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
    // const token = this.sessionService.getToken();
    // console.log('Token:', token); 

    // if (!token) {
    //   this.snackBar.open('Token is missing or invalid. Please log in again.', 'Close', { duration: 5000 });
    //   return;
    // }

    // Get Testimonials from API
    this.consumeService.getRequest('/api/open/ratings/get-testimonials/all', null).subscribe(
      (response: any) => {
        this.testimonials = response.data;
      },
      (error) => {
        console.error('Error loading testimonials:', error);
        this.snackBar.open('Failed to load testimonials. Please try again.', 'Close', { duration: 5000 });
      }
    );
  }

  // Submit Testimonial
  submitTestimonial() {
    if (this.testimonialForm.invalid) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const formData = this.testimonialForm.value;
    const token = this.sessionService.getToken();
    console.log('Token:', token); // Log token to verify it's being retrieved correctly

    if (!token) {
      this.snackBar.open('Token is missing or invalid. Please log in again.', 'Close', { duration: 5000 });
      this.loading = false;
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.consumeService.postRequest('/api/ratings/post-testimonials', formData, token).subscribe(
      (response) => {
        this.loading = false;
        this.snackBar.open('Testimonial submitted successfully!', 'Close', { duration: 3000 });
        this.testimonialForm.reset();
        this.loadTestimonials(); // Refresh the list
      },
      (error) => {
        this.loading = false;
        console.error('Error submitting testimonial:', error);
        this.snackBar.open('Failed to submit testimonial. Please try again.', 'Close', { duration: 5000 });
      }
    );
  }

  // Edit Testimonial
  onEdit(testimonial: any) {
    console.log('Edit testimonial:', testimonial);
    // Open a modal or form for editing
    // You can bind the testimonial data to the form here
  }

  // Delete Testimonial
  // onDelete(testimonial: any) {
  //   if (confirm('Are you sure you want to delete this testimonial?')) {
  //     const token = this.sessionService.getToken();
  //     if (!token) {
  //       this.snackBar.open('Token is missing or invalid. Please log in again.', 'Close', { duration: 5000 });
  //       return;
  //     }

  //     this.consumeService.deleteRequest(`/api/open/ratings/${testimonial.id}`, token).subscribe(
  //       (response) => {
  //         this.snackBar.open('Testimonial deleted successfully!', 'Close', { duration: 3000 });
  //         this.loadTestimonials(); // Refresh the list
  //       },
  //       (error) => {
  //         console.error('Error deleting testimonial:', error);
  //         this.snackBar.open('Failed to delete testimonial. Please try again.', 'Close', { duration: 5000 });
  //       }
  //     );
  //   }
  // }
}
