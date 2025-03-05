import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent], // Import SidebarComponent here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Estate-admin';
  hideSidebar = false;
  isSidebarOpen = false; // Track sidebar state for mobile screens

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        // Hide sidebar on '/', '/login', and '/resetpassword' routes
        this.hideSidebar = currentRoute === '/' || currentRoute === '/login' || currentRoute === '/resetpassword';
        this.isSidebarOpen = false; // Close sidebar on route change
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}