import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConsumeService } from '../services/consume.service';
import { SessionService } from '../services/session.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatSnackBarModule, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string | undefined;
  userName: string | undefined;
  password: string | undefined;
  // role: string | undefined;
  showPassword: boolean = false; 
  isPasswordVisible: any;
  loading: boolean = false

  constructor(
    private router: Router,
    private consumeService: ConsumeService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  navigateToResetPassword(): void {
    this.router.navigate(['/resetpassword']);
  }

  resetform(): void {
    this.email = '';
    this.password = '';
    // this.role = '';
    this.userName = '';
  }
  onLogin(): void {
    this.loading = true;
    const formData = {
      email: this.email,
      password: this.password,
      // role: this.role,
      userName: this.userName,
    };

    this.consumeService.postRequest('/api/open/user/login', formData, null).subscribe(
      (response) => {
        this.loading = false;
        console.log('Full Response:', response);
        console.log('Type of response:', typeof response);

        // Ensure response is an object
        const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;

        // Check for required fields
        if (
          parsedResponse?.status?.toLowerCase() === 'success' &&
          parsedResponse?.token &&
          parsedResponse?.id !== undefined &&
          // parsedResponse?.role &&
          parsedResponse?.userName
        ) {
          const { token, id, role, userName } = parsedResponse;

          // Save session data
          this.sessionService.saveToken(token);
          this.sessionService.saveUserId(id);
          // this.sessionService.saverole(role);
          this.sessionService.saveuserName(userName);

          this.snackBar.open('Login Successful', 'Close', { duration: 3000 });
          this.resetform();
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Login failed:', parsedResponse);
          this.snackBar.open('Login Failed: ' + (parsedResponse.message || 'Unexpected error'), 'Close', { duration: 5000 });
        }
      },
      (error) => {
        console.error('Login error:', error);
        const errorMsg = error.error?.message || 'Network error';
        this.snackBar.open('Login Failed: ' + errorMsg, 'Close', { duration: 5000 });
        this.loading = false;
      }
    );
  }


}
