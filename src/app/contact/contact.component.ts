import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ConsumeService } from '../services/consume.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  messages: any[] = [];
  filteredMessages: any[] = [];
  selectedMessage: any = null;
  selectedPastMessage: any = null; // For past messages
  replyForm: FormGroup;
  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  showPastMessages: boolean = false; // Toggle between recent and past messages

  constructor(
    private http: HttpClient,
    private consumeService: ConsumeService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.replyForm = this.fb.group({
      replyMessage: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchRecentMessages();
  }

  fetchRecentMessages() {
    this.showPastMessages = false;
    const token = this.sessionService.getToken();
    if (!token) {
      this.snackBar.open('Session expired. Please login again.', 'Close', { duration: 5000 });
      return;
    }

    this.consumeService.getRequest('/api/contact-us/admin-get-all-messages', token).subscribe(
      (response: any) => {
        this.messages = response || [];
        this.filteredMessages = [...this.messages];
      },
      (error) => {
        console.error('Error fetching messages:', error);
        this.snackBar.open('Failed to load messages', 'Close', { duration: 3000 });
      }
    );
  }

  fetchPastMessages() {
    this.showPastMessages = true;
    const token = this.sessionService.getToken();
    if (!token) {
      this.snackBar.open('Session expired. Please login again.', 'Close', { duration: 5000 });
      return;
    }

    this.consumeService.getRequest('/api/contact-us/history', token).subscribe(
      (response: any) => {
        this.messages = response || [];
        this.filteredMessages = [...this.messages];
      },
      (error) => {
        console.error('Error fetching past messages:', error);
        this.snackBar.open('Failed to load past messages', 'Close', { duration: 3000 });
      }
    );
  }

  viewPastMessage(message: any) {
    this.selectedPastMessage = message;
  }

  // Search Messages
  searchMessages() {
    this.filteredMessages = this.messages.filter(message =>
      message.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      message.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      message.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      message.phoneNumber.includes(this.searchText)
    );
  }

  selectMessage(message: any) {
    this.selectedMessage = message;
    this.replyForm.reset();
  }

  sendReply() {
    if (this.replyForm.invalid) {
      this.snackBar.open('Please enter a reply message', 'Close', { duration: 3000 });
      return;
    }

    const replyData = {
      replyMessage: this.replyForm.value.replyMessage
    };

    const messageId = this.selectedMessage.id;  

    const token = this.sessionService.getToken();
    if (!token) {
      this.snackBar.open('Session expired. Please login again.', 'Close', { duration: 5000 });
      return;
    }

    // Make the API call with messageId as query parameter and reply message in the body
    this.consumeService.postRequest(`/api/contact-us/reply?messageId=${messageId}`, replyData, token).subscribe(
      (response) => {
        this.snackBar.open('Reply sent successfully! The message has been delivered to the email.', 'Close', { duration: 3000 });
        this.replyForm.reset();
        this.selectedMessage = null;
      },
      (error) => {
        console.error('Error sending reply:', error);
        this.snackBar.open('Failed to send reply', 'Close', { duration: 5000 });
      }
    );
  }


  get paginatedMessages() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredMessages.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMessages.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
