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
  @Input() isSidebarOpen: boolean = false; // Declare the input property
  @Output() toggleSidebar = new EventEmitter<void>(); // Declare the output event
 
  constructor(private sessionService: SessionService){
    
  }
  isDropdownOpen = false;


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    console.log('Logout clicked');
    this.sessionService.deleteSessions(); 
  }
}