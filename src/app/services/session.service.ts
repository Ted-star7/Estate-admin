import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  public saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.setItem('token', token);
      } catch (error) {
        console.error('Error saving token in session storage:', error);
      }
    }
  }

  public saveUserId(userId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.setItem('userId', userId);
      } catch (error) {
        console.error('Error saving userId in session storage:', error);
      }
    }
  }

  public saverole(role: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.setItem('role', role);
      } catch (error) {
        console.error('Error saving role in session storage:', error);
      }
    }
  }

  public saveuserName(userName: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.setItem('userName', userName);
      } catch (error) {
        console.error('Error saving username in session storage:', error);
      }
    }
  }

  public getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? sessionStorage.getItem('token') : null;
  }

  public getuserName(): string | null {
    return isPlatformBrowser(this.platformId) ? sessionStorage.getItem('userName') : null;
  }

  public getUserId(): string | null {
    return isPlatformBrowser(this.platformId) ? sessionStorage.getItem('userId') : null;
  }

  public getrole(): string | null {
    return isPlatformBrowser(this.platformId) ? sessionStorage.getItem('role') : null;
  }

  public deleteSessions(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('role');
    }
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
