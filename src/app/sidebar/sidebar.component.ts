import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../services/session.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = false; // Sidebar state
  @Output() toggleSidebar = new EventEmitter<void>(); // Sidebar toggle event
  isDropdownOpen = false; // Dropdown state

  properties = [
    { id: 101, name: "Luxury Villa" },
    { id: 102, name: "Modern Apartment" },
    { id: 103, name: "Beach House" },
  ];

  constructor(private sessionService: SessionService) { }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    console.log('Logout clicked');
    this.sessionService.deleteSessions();
  }
}
