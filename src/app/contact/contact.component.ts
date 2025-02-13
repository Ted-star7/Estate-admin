import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsumeService } from '../services/consume.service'; // Assuming this is your service for API calls
import { SessionService } from '../services/session.service'; // Assuming you store session data

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule], // Ensure required modules are imported
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  messages: any[] = [];
  filteredMessages: any[] = [];
  selectedMessage: any = null;
  replyForm: FormGroup;
  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 5; // Number of messages per page

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
    this.fetchMessages();
  }

  fetchMessages() {

    const token = this.sessionService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    this.consumeService.getRequest('/api/contact-us/admin-get-all-messages', null).subscribe(
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

  searchMessages() {
    this.filteredMessages = this.messages.filter(message =>
      message.name.toLowerCase().includes(this.searchText.toLowerCase())
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
      messageId: this.selectedMessage.id,
      replyMessage: this.replyForm.value.replyMessage
    };

    this.consumeService.postRequest('/api/contact-us/reply', replyData, null).subscribe(
      () => {
        this.snackBar.open('Reply sent successfully!', 'Close', { duration: 3000 });
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
    if (this.currentPage < Math.ceil(this.filteredMessages.length / this.pageSize)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
