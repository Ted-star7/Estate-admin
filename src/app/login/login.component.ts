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
  username: string | undefined;
  password: string | undefined;
  role: string | undefined;
  showPassword: boolean = false; // Toggles password visibility
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
    this.role = '';
    this.username ='';
  }
  onLogin(): void {
    this.loading = true
    const formData = {
      email: this.email,
      password: this.password,
      role: this.role,
      username: this.username,
    };

    this.consumeService.postRequest('/api/open/user/login', formData, null).subscribe(
      (response) => {
        this.loading = false;
        console.log('Full response:', response);

        // Ensure response has the required fields
        if (response && response.status && response.token && response.id !== undefined && response.role && response.userName) {
          if (response.status.trim().toLowerCase() === 'success') { // Adjust based on actual success message
            const { token, id, role, userName } = response;

            // Save session data
            this.sessionService.saveToken(token);
            this.sessionService.saveUserId(id);
            this.sessionService.saverole(role);
            this.sessionService.saveuserName(userName);

            this.snackBar.open('Login Successful', 'Close', { duration: 3000 });
            this.resetform();
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Login failed:', response);
            this.snackBar.open('Login Failed: ' + (response.message || 'Unexpected error'), 'Close', { duration: 5000 });
          }
        } else {
          console.error('Invalid response format:', response);
          this.snackBar.open('Login Failed: Invalid response format', 'Close', { duration: 5000 });
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
